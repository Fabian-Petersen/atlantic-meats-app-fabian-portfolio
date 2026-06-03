import boto3
from typing import Optional

###
# run: python upload_locations.py --table crud-nosql-app-locations-table
###

locations = {
    "phillipi": {
        "code": "PHP",
        "area": "phillipi",
        "address": "Shop 1 Junction Mall, 149 Govan Mbeki Rd, Philippi, Cape Town, 7750",
        "position": {"longitude": "-34.001215487937536", "latitude": "18.59174489802823"},
        "landline": "0213720065",
    },
    "bellville": {
        "code": "BTX",
        "area": "bellville",
        "address": "20 Charl Malan St, Unclear, Cape Town, 7530",
        "position": {"longitude": "-33.90537673722487", "latitude": "18.629428576756258"},
        "landline": "0219494243",
    },
    "khayelitsha": {
        "code": "IKH",
        "area": "khayelitsha",
        "address": "Shop F04, Ilitha Mall, 17 Khwezi Cres, Litha Park, Cape Town, 7784",
        "position": {"longitude": "-34.04907921392364", "latitude": "18.6706643321264"},
        "landline": "0210300167",
    },
    "wynberg": {
        "code": "WBG",
        "area": "wynberg",
        "address": "26 Station Rd, Wynberg, Cape Town, 7800",
        "position": {"longitude": "-34.00514896083619", "latitude": "18.47061344770795"},
        "landline": "0217615767",
    },
    "maitland": {
        "code": "VTR",
        "area": "maitland",
        "address": "287 Voortrekker Rd, Maitland, Cape Town, 7404",
        "position": {"longitude": "-33.92196391122811", "latitude": "18.491258977067456"},
        "landline": "",
    },
    "distribution": {
        "code": "DCN",
        "area": "maitland",
        "address": "12B Chatham St, Maitland, Cape Town, 7404",
        "position": {"longitude": "-33.92255685007822", "latitude": "18.49629623260718"},
        "landline": "",
    },
    "golden acre": {
        "code": "GAC",
        "area": "cape town",
        "address": "Shop S41A, Shopping Centre, Golden Acre, 9 Adderley, Strand St, Foreshore, Cape Town, 8001",
        "position": {"longitude": "", "latitude": ""},
        "landline": "",
    },
}


def upload_locations(
    table_name: str,
    region: str = "af-south-1",
    profile: Optional[str] = None,
) -> None:
    """
    Upload all locations to a DynamoDB table.

    Each item uses `code` as the partition key. Empty strings are omitted
    so DynamoDB doesn't reject them (DynamoDB disallows empty string values
    unless you explicitly enable them on the table).

    Args:
        table_name: Name of the target DynamoDB table.
        region:     AWS region (defaults to af-south-1 / Cape Town).
        profile:    Optional AWS credentials profile name.
    """
    session = boto3.Session(profile_name=profile)
    dynamodb = session.resource("dynamodb", region_name=region)
    table = dynamodb.Table(table_name)

    with table.batch_writer() as batch:
        for location, data in locations.items():
            item = {
                "location": location,          # partition key — set this to match your table schema
                "code": data["code"],
                "area": data["area"],
                "address": data["address"],
            }

            # Only include position fields if they have a value
            lon = data["position"].get("longitude")
            lat = data["position"].get("latitude")
            if lon:
                item["longitude"] = lon
            if lat:
                item["latitude"] = lat

            if data.get("landline"):
                item["landline"] = data["landline"]

            batch.put_item(Item=item)
            print(f"  Queued: {location} ({data['code']})")

    print(f"\nDone — {len(locations)} locations written to '{table_name}'.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Seed locations into DynamoDB.")
    parser.add_argument("--table",   required=True, help="DynamoDB table name")
    parser.add_argument("--region",  default="af-south-1", help="AWS region")
    parser.add_argument("--profile", default=None,
                        help="AWS credentials profile")
    args = parser.parse_args()

    upload_locations(table_name=args.table,
                     region=args.region, profile=args.profile)
