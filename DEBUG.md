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

## Issue 2: Upload of images to s3 results in errors

# S3 Pre-Signed URL Upload Issues — Resolution Summary

## Error:

```html
<Error>
  <code>IllegalLocationConstraintException</code>
  <Message
    >The af-south-1 location constraint is incompatible for the region specific
    endpoint this request was sent to.</Message
  >
  <RequestId>66GVHM9HNA7KW4GY</RequestId>
  <HostId
    >Rgmbk0QAFG6uJvbkE30OV6V21Zcduq3P/h6lpZm5yIafA+VJ1coDfJGNsGO8l3ntYawtAEfs+
    FocUeevXCJhcCOGpcIlJVSdKJKqXADBQBk=
  </HostId>
</Error>
```

## 1. IllegalLocationConstraintException

**Cause**

- Bucket is in `af-south-1`
- Pre-signed URL used the global endpoint (`s3.amazonaws.com`)

**Fix**

- Force regional S3 endpoint: "s3.af-south-1.amazonaws.com"

- Explicitly set `region_name="af-south-1"` in the S3 client.

```py
from botocore.config import Config

s3 = boto3.client(
    "s3",
    region_name="af-south-1",
    config=Config(
        s3={"addressing_style": "virtual"},
        signature_version="s3v4",
        region_name="af-south-1"
    )
)
```

## 2. SignatureDoesNotMatch

**Cause**

- Pre-signed URL was generated for `PUT`, but the request was sent as `GET`
- Or `Content-Type` header did not exactly match the signed value

**Fix**

- Use **HTTP PUT** when uploading
- Either:
- Match `Content-Type` exactly, **or**
- Do not sign `Content-Type` at all (recommended)

---

## 3. Upload Fails via curl/Postman

**Cause**

- Extra or mismatched headers in the request
- Incorrect curl usage

**Fix**

- Send raw binary data
- No extra headers unless signed

````bash
curl -X PUT --data-binary "@file.jpg" "PRESIGNED_URL"

## 4. AccessDenied (Final Blocking Issue)

```html
"<?xml version="1.0" encoding="UTF-8"?> <Error> <Code>AccessDenied</Code>
<Message>User: arn:aws:sts::157489943321:assumed-role/postMaintenanceRequest_exec_role/postMaintenanceRequest is not authorized to perform: s3:PutObject on resource: "arn:aws:s3:::crud-nosql-app-images/maintenance/20251117_140309.jpg" because no identity-based policy allows the s3:PutObject action</Message>
<RequestId>DM9V7QGQM06KN5M2</RequestId>
<HostId>r0o65RWqEL5i3r1DMO6HsYbdxkjlz10o/LRAHeOYwLIgzcSpgiPprzprVJh2P4kVcCnJYEbS7wD8LusgycDEhibbHzaoN68h</HostId>
</Error>"
````

The policy created by terraform was not attached to the lambda function "postMaintenanceRequest.py"

add the policy:

```json
{
  "Statement": [
    {
      "Action": ["dynamodb:PutItem", "dynamodb:UpdateItem"],
      "Effect": "Allow",
      "Resource": "arn:aws:dynamodb:af-south-1:157489943321:table/crud-nosql-app-maintenance-request-table"
    },
    {
      "Action": ["s3:PutObject"],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::crud-nosql-app-images/maintenance/*"
    },
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ],
  "Version": "2012-10-17"
}
```

The file was correctly added to the s3 bucket.
