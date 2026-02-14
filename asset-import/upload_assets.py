import boto3
import pandas as pd
from decimal import Decimal
from dateutil import parser
import uuid
from datetime import datetime, timezone

file_path = "./maitland.xlsx"
# df = pd.read_excel(file_path)  # Change to pd.read_excel(file_path) if it's an Excel file
# print(df.tail())  # Check the structure of the DataFrame

TABLE_NAME = "crud-nosql-app-assets-table"

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def parse_currency(value):
    if pd.isna(value):
        return None

    # If already numeric (float or int)
    if isinstance(value, (int, float)):
        return Decimal(str(value))

    # If string with currency formatting
    cleaned = (
        str(value)
        .replace("R", "")
        .replace(" ", "")
        .replace(",", "")  # remove thousands separator
        .strip()
    )

    return Decimal(cleaned)

def parse_images(value):
    if pd.isna(value):
        return []
    return [img.strip() for img in str(value).split(",") if img.strip()]

def safe_string(value):
    if value is None:
        return None
    return str(value)

def transform_row(row):
    return {
        "id": safe_string(uuid.uuid4()),
        "createdAt": safe_string(datetime.now(timezone.utc).isoformat()),
        "assetID": safe_string(row["AssetID"]),
        "equipment": safe_string(row["Equipment"]),
        "model": safe_string(row["Model"]),
        "manufacturer": safe_string(row["Manufacturer"]),
        "yearOfManufacture":
            safe_string(row["Year of Manufacture"]),
        "location": safe_string(row["Location"]),
        "serialNumber": safe_string(row["Serial Number"]),
        "condition": safe_string(row["Condition"]),
        "replacementValue": parse_currency(
            row["Replacement Value"]
        ),
        "area": safe_string(row["Area"]),
        "images": parse_images(row["Images"]),
    }

def upload_file(file_path):
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    elif file_path.endswith(".xlsx"):
        df = pd.read_excel(file_path)
        df = df.where(pd.notnull(df), None)  # Replace NaN with None for DynamoDB compatibility
    else:
        raise ValueError("Unsupported file type")


    with table.batch_writer() as batch:
        for _, row in df.iterrows():
            item = transform_row(row)
            # for key, value in item.items():               # use to check types if error returned
            #     print(key, type(value), value)
            batch.put_item(Item=item)

    print("Upload complete.")


if __name__ == "__main__":
    try:
        upload_file(file_path)
        print("File uploaded successfully.")
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
    except Exception as e:
        print(f"Error: {e}")