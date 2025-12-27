### Error accessing data from the database

Access to XMLHttpRequest at 'https://crud-nosql.app.fabian-portfolio.net/maintenance-request' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

### Solution

- Add the CORS policy in the lambda function (minimal function)

```py
#  ============ minimal function ============

import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("crud-nosql-app-maintenance-request-table")

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5173",  # or "*"
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
}


def lambda_handler(event, context):
    try:
        response = table.scan()  # TEMP: returns all items

        return _response(200, response.get("Items", []))

    except Exception as exc:
        print("Error:", exc)
        return _response(500, {"message": "Internal server error"})


def _response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": HEADERS,
        "body": json.dumps(body),
    }
```
