from datetime import datetime
import random
import string
import boto3
import json
import os
import logging

# Set up basic logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize DynamoDB resource and table
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get("TABLE_NAME")
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    Lambda handler to support API operations:
      - POST: Accepts a JSON body, parses it into variables, and uploads an item to DynamoDB.
      - GET: Retrieves items from DynamoDB for visualization.
    """
    logger.info("Received event: %s", json.dumps(event))

    http_method = event.get("httpMethod")
    if http_method == "POST":
        return handle_post(event)
    elif http_method == "GET":
        return handle_get(event)
    else:
        return {
            "statusCode": 405,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": "Method Not Allowed"})
        }

def handle_post(event):
    """
    Handle POST requests: parse the incoming JSON body, extract variables, and upload the item to DynamoDB.
    """
    try:
        # Parse the request body
        body = json.loads(event.get("body", "{}"))

        def generate_transaction_id():
            """
            Generates a random transaction ID similar to a PayPal transaction ID.
            Format: C-XXXXXXXXXXXX, where:
            - XXXXXXXXXXXX is a 12-character string of random uppercase letters and digits.
            """
            prefix = "C"
            body = ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))
            return f"{prefix}-{body}"

        item_id = generate_transaction_id()

        # Extract variables from the body. Adjust field names as needed.
        # For example, assume your item has id, user_name, amount_value, purpose, currency, etc.
        item = { # create some logic to input data that won't be in the body
            "id": item_id,
            "user_name": body["user_name"],
            "amount_value": body["amount_value"],
            "purpose": body["purpose"],
            "amount_currency": body["currency"],
            "data_type": "cash payment",
            "create_time": datetime.utcnow().isoformat() + "Z"
        }
        
        # Put the item into the DynamoDB table.
        table.put_item(Item=item)
        
        logger.info("Item successfully inserted: %s", item)
        return {
            "statusCode": 201,
            "headers": {"Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "message": "Item created successfully",
                "item": item
            })
        }
        
    except Exception as e:
        logger.error("Error in handle_post: %s", str(e), exc_info=True)
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "message": "Error creating item",
                "error": str(e)
            })
        }

def handle_get(event): # Build off of it to use the items and use in a different function to create some sort of analytics
    """
    Handle GET requests: query or scan the DynamoDB table to retrieve data.
    """
    try:
        # For example, use a scan to retrieve all items (for visualization).
        response = table.scan()
        items = response.get("Items", [])
        
        logger.info("Items retrieved: %s", items)
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "message": "Items retrieved successfully",
                "items": items
            })
        }
        
    except Exception as e:
        logger.error("Error in handle_get: %s", str(e), exc_info=True)
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "message": "Error retrieving items",
                "error": str(e)
            })
        }