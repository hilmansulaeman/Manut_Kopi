# Kopi Haus Dashboard Backend API Documentation

This document provides an overview and guide for setting up, running, and testing the Kopi Haus Dashboard Backend API.

## Table of Contents
1.  [Overview](#1-overview)
2.  [Setup](#2-setup)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Environment Variables](#environment-variables)
    *   [Running the Server](#running-the-server)
3.  [API Endpoints](#3-api-endpoints)
    *   [Authentication](#authentication)
    *   [General Routes](#general-routes)
    *   [Master Data Routes](#master-data-routes)
    *   [Operational Routes](#operational-routes)
    *   [Reporting/Logging Routes](#reportinglogging-routes)
4.  [Authentication & Authorization (RBAC)](#4-authentication--authorization-rbac)
5.  [API Testing](#5-api-testing)
    *   [Using cURL](#using-curl)
    *   [Using GUI Tools (Postman/Insomnia)](#using-gui-tools-postmaninsomnia)
6.  [Swagger API Documentation](#6-swagger-api-documentation)

---

## 1. Overview

The Kopi Haus Dashboard Backend is an Express.js application that serves as the API for managing various aspects of a coffee shop business, including user management, product inventory, sales, purchases, stock adjustments, and more. It uses MongoDB as its database and implements JWT-based authentication with Role-Based Access Control (RBAC).

## 2. Setup

### Prerequisites
*   Node.js (LTS version recommended)
*   npm (Node Package Manager)
*   MongoDB (running locally or accessible via a connection string)

### Installation
1.  Navigate to the `backend-express` directory:
    ```bash
    cd backend-express
    ```
2.  Install the required Node.js dependencies:
    ```bash
    npm install
    ```

### Environment Variables
Create a `.env` file in the `backend-express` directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/kopihaus
PORT=5001
JWT_SECRET=your_secret_key_for_jwt_token_signing
```
*   `MONGODB_URI`: Your MongoDB connection string.
*   `PORT`: The port on which the Express server will run (e.g., `5001`).
*   `JWT_SECRET`: A strong, secret key used for signing and verifying JWT tokens. Generate a long, random string for this.

### Running the Server
To start the API server, navigate to the `backend-express` directory and run:
```bash
cd backend-express && npm start
```
You should see output similar to:
```
Server is running on port: 5001
MongoDB connected successfully
```

## 3. API Endpoints

The API is structured with various routes, many of which are protected by authentication and RBAC middleware. The base URL for the API is `http://localhost:5001/api`.

### Authentication
*   `POST /api/auth/register`
    *   **Description:** Registers a new user.
    *   **Body:** `{ "name": "string", "email": "string", "password": "string", "roles": ["string"] }`
    *   **Roles:** `Cashier`, `Warehouse`, `Admin`, `Manager`
    *   **Response:** `{ "message": "User registered successfully", "userId": "string" }`
*   `POST /api/auth/login`
    *   **Description:** Logs in an existing user and returns a JWT token.
    *   **Body:** `{ "email": "string", "password": "string" }`
    *   **Response:** `{ "token": "string" }`

### General Routes
*   `GET /`
    *   **Description:** Basic unprotected route to confirm server is running.
    *   **Response:** `"Hello from Express backend!"`
*   `GET /api/items`
    *   **Description:** Example of a protected route. Requires authentication.
    *   **Response:** `[{ "id": 1, "name": "Protected Item 1" }, ...]`

### Master Data Routes
(Protected: Requires `authenticateToken` and `authorize(['Admin', 'Manager'])`)
*   `GET /api/outlets`
*   `POST /api/outlets`
*   `PUT /api/outlets/:id`
*   `DELETE /api/outlets/:id`
*   `GET /api/categories`
*   `POST /api/categories`
*   `PUT /api/categories/:id`
*   `DELETE /api/categories/:id`
*   ... (similar CRUD operations for `registers`, `taxes`, `products`, `suppliers`, `product-prices`, `product-stocks`, `customers`, `payment-methods`)

### Operational Routes
*   **Shifts:** (Protected: `Cashier`, `Admin`, `Manager`)
    *   `GET /api/shifts`
    *   `POST /api/shifts`
    *   ...
*   **Purchases:** (Protected: `Warehouse`, `Admin`, `Manager`)
    *   `GET /api/purchases`
    *   `POST /api/purchases`
    *   ...
*   **Sales:** (Protected: `Cashier`, `Admin`, `Manager`)
    *   `GET /api/sales`
    *   `POST /api/sales`
    *   ...
*   **Payments:** (Protected: `Cashier`, `Admin`, `Manager`)
    *   `GET /api/payments`
    *   `POST /api/payments`
    *   ...
*   **Returns:** (Protected: `Cashier`, `Admin`, `Manager`)
    *   `GET /api/returns`
    *   `POST /api/returns`
    *   ...
*   **Stock Adjustments:** (Protected: `Warehouse`, `Admin`, `Manager`)
    *   `GET /api/stock-adjustments`
    *   `POST /api/stock-adjustments`
    *   ...
*   **Promotions:** (Protected: `Admin`, `Manager`)
    *   `GET /api/promotions`
    *   `POST /api/promotions`
    *   ...
*   **Expenses:** (Protected: `Cashier`, `Admin`, `Manager`)
    *   `GET /api/expenses`
    *   `POST /api/expenses`
    *   ...

### Reporting/Logging Routes
*   **Stock Movements:** (Protected: `Warehouse`, `Admin`, `Manager`)
    *   `GET /api/stock-movements`
    *   ...
*   **Audit Logs:** (Protected: `Admin` only)
    *   `GET /api/audit-logs`
    *   ...

## 4. Authentication & Authorization (RBAC)

This API uses JSON Web Tokens (JWT) for authentication and Role-Based Access Control (RBAC) for authorization.

*   **Authentication:** After successful login (`/api/auth/login`), a JWT token is issued. This token must be included in the `Authorization` header of subsequent requests to protected routes, in the format `Bearer YOUR_JWT_TOKEN`.
*   **Authorization:** The `rbac.js` middleware checks the roles embedded in the JWT token against the required roles for a specific route. If the user's role does not match the required role(s), access will be denied.

## 5. API Testing

### Using cURL
Once the server is running, you can use `curl` from your terminal.

**Example: Testing an unprotected endpoint**
```bash
curl http://localhost:5001/
```
Expected output: `Hello from Express backend!`

**Example: Registering a user**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name": "Test User", "email": "test@example.com", "password": "password123", "roles": ["Cashier"]}' http://localhost:5001/api/auth/register
```
This will return a success message and user ID.

**Example: Logging in and getting a JWT token**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "password123"}' http://localhost:5001/api/auth/login
```
This will return a JSON object containing your JWT token. Copy this token.

**Example: Accessing a protected endpoint with a JWT token**
```bash
curl -H "Authorization: Bearer [YOUR_JWT_TOKEN]" http://localhost:5001/api/items
```
Replace `[YOUR_JWT_TOKEN]` with the actual token you received.

### Using GUI Tools (Postman/Insomnia)
For a more user-friendly experience, consider using Postman or Insomnia.
1.  **Install:** Download and install your preferred tool.
2.  **Create Request:** Create a new HTTP request.
3.  **Set Method & URL:** Choose the HTTP method (GET, POST, PUT, DELETE) and enter the full API URL (e.g., `http://localhost:5001/api/auth/login`).
4.  **Set Headers:** For `POST`/`PUT` requests, set `Content-Type: application/json`. For protected routes, set `Authorization: Bearer YOUR_JWT_TOKEN`.
5.  **Set Body:** For `POST`/`PUT` requests, select `raw` and `JSON` and provide the JSON payload.
6.  **Send Request:** Click "Send" to get the API response.

## 6. Swagger API Documentation

To view the interactive API documentation using Swagger UI, ensure your backend server is running (as described in [Running the Server](#running-the-server)), then open your web browser and navigate to:

```
http://localhost:5001/api-docs
```
This interface allows you to explore all defined endpoints, view their expected request/response formats, and even test them directly from the browser.
