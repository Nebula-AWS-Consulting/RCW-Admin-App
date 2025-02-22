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


TABLE_NAME = os.environ.get("TABLE_NAME")

dynamodb = boto3.resource('dynamodb')
cognito_client = boto3.client('cognito-idp')
ssm = boto3.client('ssm')
table = dynamodb.Table(TABLE_NAME)

def get_ssm_parameter(name: str) -> str:
    """Fetch a parameter from AWS SSM Parameter Store with decryption enabled."""
    response = ssm.get_parameter(Name=name, WithDecryption=True)
    return response['Parameter']['Value']

def get_environment() -> str:
    """Retrieve the deployment environment, defaulting to 'dev' if not set."""
    return os.environ.get("ENVIRONMENT", "dev")

def get_user_pool_client_id() -> str:
    """Retrieve Cognito User Pool Client ID from SSM."""
    return get_ssm_parameter(f"/rcw-client-backend-{get_environment()}/COGNITO_CLIENT_ID")


def lambda_handler(event, context):
    """
    Lambda handler to support API operations:
      - POST: for sign-up, sign-in, or cash transaction upload
      - GET: to retrieve items from DynamoDB
    Assumes that API Gateway provides a 'path' in the event to differentiate endpoints.
    """
    logger.info("Received event: %s", json.dumps(event))
    http_method = event.get("httpMethod")
    path = event.get("path", "")
    
    if http_method == "POST":
        if path == "/signup":
            return sign_up(event)
        elif path == "/signin":
            return sign_in(event)
        elif path == "/upload-cash-transaction":
            return upload_cash_transaction(event)
    elif http_method == "GET":
        if path == "/get-db-items":
            return get_db_items(event)
    else:
        return {
            "statusCode": 405,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": "Method Not Allowed"})
        }

def sign_up(event):
    """
    Sign up a new user using Cognito.
    Expects JSON in the request body with keys:
      - username
      - password
      - email
    """
    try:
        body = json.loads(event['body'])
        first_name = body.get('firstName')
        last_name = body.get('lastName')
        password = body.get('password')
        email = body.get('email')
        
        # Call Cognito's sign_up API
        response = cognito_client.sign_up(
            ClientId=get_user_pool_client_id(),
            Username=email,
            Password=password,
            UserAttributes=[
                {'Name': 'email', 'Value': email},
                {'Name': 'custom:firstName', 'Value': first_name},
                {'Name': 'custom:lastName', 'Value': last_name}
            ]
        )
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true"
            },
            "body": json.dumps(response)
        }
    except Exception as e:
        logger.error("Error during sign in: %s", str(e))
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": str(e)})
        }

def sign_in(event):
    """
    Sign in an existing user using Cognito.
    Expects JSON in the request body with keys:
      - username
      - password
    """
    try:
        body = json.loads(event['body'])
        username = body.get('username')
        password = body.get('password')
        
        # Call Cognito's initiate_auth API with the USER_PASSWORD_AUTH flow
        response = cognito_client.initiate_auth(
            ClientId=get_user_pool_client_id(),
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password
            }
        )
        # The AuthenticationResult contains tokens (ID, access, refresh tokens)
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",  # or specify your origin, e.g., "http://localhost:3039"
                "Access-Control-Allow-Credentials": "true"
            },
            "body": json.dumps(response['AuthenticationResult'])
        }
    except Exception as e:
        logger.error("Error during sign in: %s", str(e))
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": str(e)})
        }


def upload_cash_transaction(event):
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

def get_db_items(event): # Build off of it to use the items and use in a different function to create some sort of analytics
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