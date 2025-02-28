# **RCW Client Backend Server Documentation**

## **1. Overview**

This serverless application (AWS Lambda function) handles user authentication (sign-up, sign-in) via **Amazon Cognito** and manages basic **cash transaction data** in **Amazon DynamoDB**. It supports both **POST** and **GET** requests, routed by **API Gateway** based on the incoming event’s HTTP method and path.

**Key Components**:
- **AWS Cognito** for user management.  
- **DynamoDB** for storing transaction records.  
- **AWS SSM Parameter Store** for retrieving sensitive configuration (Cognito Client ID, environment variables).  

---

## **2. Environment Variables**

- **`TABLE_NAME`**: Name of the DynamoDB table.  
- **`ENVIRONMENT`**: Specifies the deployment stage (e.g., dev, prod).  
- The code fetches parameters (like **COGNITO_CLIENT_ID**) from **SSM** using `get_ssm_parameter()`.  

---

## **3. Handler & Routing**

### **Entry Point**: `lambda_handler(event, context)`

- Reads **`httpMethod`** (`GET` / `POST`) and **`path`** from the event to determine which function to call:
  - **`POST /signup`** → `sign_up(event)`
  - **`POST /signin`** → `sign_in(event)`
  - **`POST /upload-cash-transaction`** → `upload_cash_transaction(event)`
  - **`GET /get-db-items`** → `get_db_items(event)`
  - Otherwise returns **`405 Method Not Allowed`** if the method/path combination isn’t recognized.

**Sample Event Structure (API Gateway)**:
```json
{
  "httpMethod": "POST",
  "path": "/signin",
  "headers": { "...": "..." },
  "body": "{ \"username\": \"john@example.com\", \"password\": \"p@ssw0rd\" }"
}
```

---

## **4. Endpoints**

### 1. **Sign Up**  
**`POST /signup`**

**Purpose**  
- Creates a new user in **Cognito**. Expects **firstName**, **lastName**, **password**, **email** in the request body.

**Request Body (JSON)**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "password": "SomeStrongPassword123",
  "email": "john.doe@example.com"
}
```

**Response**:  
- **Success (200)**: Returns the raw Cognito response, which may contain an indication if email confirmation is required.  
- **Error (400)**: Typically if the user already exists or parameters are invalid.

```json
{
  "UserConfirmed": false,
  "CodeDeliveryDetails": {
    "Destination": "j***@example.com",
    "DeliveryMedium": "EMAIL",
    "AttributeName": "email"
  },
  ...
}
```

---

### 2. **Sign In**  
**`POST /signin`**

**Purpose**  
- Authenticates a user via **Cognito** using **USER_PASSWORD_AUTH**.

**Request Body (JSON)**:
```json
{
  "username": "john.doe@example.com",
  "password": "SomeStrongPassword123"
}
```

**Response**:  
- **Success (200)**: Returns the Cognito **AuthenticationResult** (tokens such as `IdToken`, `AccessToken`, `RefreshToken`).  
- **Error (400)**: Credentials incorrect, user not found, etc.

```json
{
  "IdToken": "...",
  "AccessToken": "...",
  "RefreshToken": "...",
  "ExpiresIn": 3600,
  "TokenType": "Bearer"
}
```

---

### 3. **Upload Cash Transaction**  
**`POST /upload-cash-transaction`**

**Purpose**  
- Inserts a **cash transaction** record into DynamoDB. Generates a random transaction ID (format: `C-XXXXXXXXXXXX`).

**Request Body (JSON)**:
```json
{
  "user_name": "John Doe",
  "amount_value": "50",
  "purpose": "Donation",
  "currency": "USD"
}
```

**Response**:  
- **Success (201)**: A JSON object confirming the item was created, including the generated transaction ID.  
- **Error (500)**: If DynamoDB insertion fails or some exception occurs.

```json
{
  "message": "Item created successfully",
  "item": {
    "id": "C-6G5D8V0K9Q13", 
    "user_name": "John Doe",
    "amount_value": "50",
    "purpose": "Donation",
    "amount_currency": "USD",
    "data_type": "cash payment",
    "create_time": "2025-02-23T11:45:30.123456Z"
  }
}
```

---

### 4. **Get DB Items**  
**`GET /get-db-items`**

**Purpose**  
- Scans the DynamoDB table **TABLE_NAME** and returns all items. (Consider adding filters or pagination for large datasets.)

**Response**:  
- **Success (200)**: A JSON array of items in DynamoDB.  
- **Error (500)**: If the scan operation fails.

```json
{
  "message": "Items retrieved successfully",
  "items": [
    {
      "id": "C-6G5D8V0K9Q13",
      "user_name": "John Doe",
      ...
    }
  ]
}
```

---

## **5. Implementation Details**

1. **Logging**  
   - Uses Python’s built-in `logging` library.  
   - Logs errors for debugging (e.g., in CloudWatch Logs).

2. **DynamoDB**  
   - Accessed via `boto3.resource('dynamodb')`.  
   - Table name is read from `os.environ.get("TABLE_NAME")`.

3. **Cognito**  
   - **`cognito_client.sign_up()`** for user registration.  
   - **`cognito_client.initiate_auth()`** for sign-in.  
   - **SSM** fetches the Cognito Client ID from param store key: `/rcw-client-backend-<ENV>/COGNITO_CLIENT_ID`.

4. **CORS**  
   - Simple CORS headers set in each response: `Access-Control-Allow-Origin: "*"`.  
   - Adjust to your domain if you need stricter control.

---

## **6. Error Handling**

- **400** (Bad Request):  
  - Missing or invalid parameters (e.g., incomplete JSON, Cognito sign-up errors).  
- **405** (Method Not Allowed):  
  - If the request method or path is not recognized by this Lambda.  
- **500** (Internal Server Error):  
  - Unhandled exceptions, such as DynamoDB issues or runtime errors.  

---

## **7. Future Considerations**

- **Token Validation**: You might add checks for Cognito tokens on certain routes (e.g., uploading transactions) for extra security.  
- **Refined Queries**: The `/get-db-items` endpoint currently scans all items. You may optimize with queries or filters.  
- **Expanded Payment Types**: If you handle additional payment methods or advanced logic, extend `upload_cash_transaction` or add new endpoints.  
- **Environment-based Routing**: Distinguish dev vs. prod environments more explicitly (log levels, domain restrictions, etc.).

---

## **8. Summary**

This server code provides an **API** for **user sign-up** and **sign-in** via Cognito and **cash transaction management** via DynamoDB. It follows a **lambda_handler** approach, routing based on `httpMethod` and `path`. The concise set of endpoints allows for basic CRUD operations and authentication flows, with the flexibility to scale or be extended in the future (e.g., adding roles/permissions, analytics queries, etc.).