# Assignment 3 — Developer Documentation

## 1. Overview

This API provides authenticated access to a small in-memory mail system. It demonstrates:

- JWT-based authentication
- Role-Based Access Control (RBAC) using composable policy functions
- Per-request logging with stable UUIDs
- In-memory fixed-window rate limiting
- Centralized error handling with consistent JSON responses

**Base URL:** `http://localhost:3000`

**Tech stack:** Node.js, Express 4, `jsonwebtoken`, `uuid`

---

## 2. Authentication

### 2.1 How to Obtain a Token

Send a `POST` request to `/auth/login` with a JSON body containing `username` and `password`.

**Endpoint:** `POST /auth/login`

**Request body:**

```json
{
  "username": "user1",
  "password": "user123"
}
```

**Success response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ1NDY5MDAwLCJleHAiOjE3NDU0NzI2MDB9.abc123"
}
```

- Tokens are signed with the `JWT_SECRET` environment variable.
- Tokens expire after **1 hour**.
- The payload embedded in the token contains `userId` and `role`.

### 2.2 Using the Token

All protected endpoints require this HTTP header:

```
Authorization: Bearer <token>
```

If the header is absent, malformed, contains an expired token, or the signature is invalid, the API returns an error through the centralized error handler (see Section 6).

### 2.3 Demo Credentials

| Username | Password  | Role  | userId |
|----------|-----------|-------|--------|
| admin    | admin123  | admin | 1      |
| user1    | user123   | user  | 2      |
| user2    | user123   | user  | 3      |

---

## 3. Roles and RBAC Rules

The API uses two roles: `admin` and `user`.

| Endpoint       | Method | admin             | user                        |
|----------------|--------|-------------------|-----------------------------|
| `/auth/login`  | POST   | open              | open                        |
| `/status`      | GET    | open              | open                        |
| `/mail/:id`    | GET    | any mail item     | only mail they own          |

**Policy logic for `GET /mail/:id`:**

- A user is granted access if `isAdmin(user)` returns `true` **OR** `ownsResource(user, mail)` returns `true`.
- `isAdmin` checks that `user.role === "admin"`.
- `ownsResource` checks that `user.userId === mail.userId`.
- The middleware chain for this route is: `authenticateJWT → loadMail → authorize(canViewMail) → handler`.
  - If any step fails, the remaining steps are skipped and the error goes to the centralized error handler.

---

## 4. Endpoints

### 4.1 `POST /auth/login`

**Description:** Exchange credentials for a signed JWT.

**Authentication required:** No

**Request body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Success response (200):**

```json
{
  "token": "<jwt>"
}
```

**Error responses:**

| Condition                         | Status | error          |
|-----------------------------------|--------|----------------|
| `username` or `password` missing  | 400    | `BadRequest`   |
| Credentials do not match          | 401    | `Unauthorized` |

**Example — missing fields (400):**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{}"
```

```json
{
  "error": "BadRequest",
  "message": "username and password are required.",
  "statusCode": 400,
  "requestId": "d3f1a2b4-9c0e-4f23-8b77-1a2b3c4d5e6f",
  "timestamp": "2026-04-24T03:00:00.000Z"
}
```

---

### 4.2 `GET /mail/:id`

**Description:** Retrieve a single mail message by its integer ID.

**Authentication required:** Yes — `Authorization: Bearer <token>`

**URL parameter:**

| Parameter | Type    | Description          |
|-----------|---------|----------------------|
| `id`      | integer | The mail item's ID   |

**Access rules:**

- `admin` — may view any mail ID.
- `user` — may only view mail where `mail.userId` equals their own `userId`.

**Middleware chain:** `authenticateJWT` → `loadMail` → `authorize(canViewMail)` → response handler

**Success response (200):**

```json
{
  "id": 2,
  "userId": 2,
  "subject": "Hello User1",
  "body": "Your report is ready."
}
```

**Error responses:**

| Condition                         | Status | error          |
|-----------------------------------|--------|----------------|
| No / invalid token                | 401    | `Unauthorized` |
| Token expired                     | 401    | `TokenExpired` |
| Mail ID not found                 | 404    | `NotFound`     |
| Authenticated but not authorized  | 403    | `Forbidden`    |

---

### 4.3 `GET /status`

**Description:** Health-check endpoint. Returns `{ "status": "ok" }` whenever the API process is running.

**Authentication required:** No

**Success response (200):**

```json
{
  "status": "ok"
}
```

---

## 5. Rate Limiting

The API uses a simple in-memory **fixed-window** rate limiter applied globally to every request (including `/auth/login` and `/status`).

**Configuration (set via environment variables):**

| Variable                    | Default | Description                              |
|-----------------------------|---------|------------------------------------------|
| `RATE_LIMIT_MAX`            | `5`     | Max requests allowed per window          |
| `RATE_LIMIT_WINDOW_SECONDS` | `60`    | Window length in seconds                 |

**Key:** Each unique client IP address gets its own counter.

**When the limit is exceeded:**

- The middleware passes a `429` error to `next(err)`.
- The centralized error handler returns a JSON body with `"error": "TooManyRequests"`.
- A `Retry-After` HTTP header is set to the number of seconds remaining in the current window.

**Rate-limited response (429):**

```json
{
  "error": "TooManyRequests",
  "message": "Rate limit exceeded. Please try again later.",
  "statusCode": 429,
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2026-04-24T03:00:00.000Z"
}
```

**Response header:**

```http
Retry-After: 47
```

The value is the number of seconds until the current window resets. Clients should wait at least this long before retrying.

---

## 6. Error Response Format

All errors — whether from route handlers, middleware, or unexpected exceptions — flow through the centralized `errorHandler` middleware and return the same JSON structure:

```json
{
  "error": "ErrorCategory",
  "message": "Human-readable explanation.",
  "statusCode": 403,
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2026-04-24T03:00:00.000Z"
}
```

| Field        | Type    | Description                                                        |
|--------------|---------|--------------------------------------------------------------------|
| `error`      | string  | Machine-readable error category (e.g., `Forbidden`)               |
| `message`    | string  | Safe, human-readable explanation (no stack traces or internals)    |
| `statusCode` | integer | The HTTP status code, also set on the response                     |
| `requestId`  | string  | UUID matching the `REQUEST <uuid>` log line for this request       |
| `timestamp`  | string  | ISO 8601 UTC timestamp of when the error was handled               |

**Known error categories:**

| `error`               | Status | When it occurs                                      |
|-----------------------|--------|-----------------------------------------------------|
| `BadRequest`          | 400    | Missing or invalid request fields                   |
| `Unauthorized`        | 401    | Missing, malformed, or invalid JWT                  |
| `TokenExpired`        | 401    | JWT was valid but has expired                       |
| `Forbidden`           | 403    | Authenticated but not authorized by RBAC policy     |
| `NotFound`            | 404    | Requested resource does not exist                   |
| `TooManyRequests`     | 429    | Rate limit exceeded                                 |
| `InternalServerError` | 500    | Unexpected server-side error                        |

Stack traces and internal error details are **never** included in responses. They are logged server-side with the matching `requestId` so they can be retrieved by developers.

---

## 7. Logging and Request Tracing

Every request generates a UUID (`requestId`) attached to `req.requestId`. A log line is written immediately:

```
REQUEST a1b2c3d4-e5f6-7890-abcd-ef1234567890 GET /mail/2
```

When an error is handled, the same `requestId` appears in both the JSON response body and in the server-side error log:

```
Unhandled error for request a1b2c3d4-e5f6-7890-abcd-ef1234567890 [Error object]
```

This lets you correlate a client-reported `requestId` to the exact server-side log entry.

---

## 8. Example Flows

### 8.1 Happy Path — Login and Access Own Mail

**Step 1 — Log in as `user1` and capture the token:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"user123"}'
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Step 2 — Request `/mail/2` (owned by `user1`, userId=2):**

```bash
curl http://localhost:3000/mail/2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

```json
{
  "id": 2,
  "userId": 2,
  "subject": "Hello User1",
  "body": "Your report is ready."
}
```

---

### 8.2 Happy Path — Admin Accessing Any Mail

**Step 1 — Log in as `admin`:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Step 2 — Request `/mail/3` (owned by `user2`, not the admin):**

```bash
curl http://localhost:3000/mail/3 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

```json
{
  "id": 3,
  "userId": 3,
  "subject": "Hello User2",
  "body": "You have a new message."
}
```

Admin succeeds because `isAdmin(user)` returns `true` regardless of mail ownership.

---

### 8.3 Error Path — User Accessing Another User's Mail (403 Forbidden)

**Log in as `user1`, then request `/mail/3` (owned by `user2`):**

```bash
curl http://localhost:3000/mail/3 \
  -H "Authorization: Bearer <user1-token>"
```

```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource.",
  "statusCode": 403,
  "requestId": "c7d8e9f0-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
  "timestamp": "2026-04-24T03:00:00.000Z"
}
```

`user1` (userId=2) does not own mail item 3 (userId=3) and is not an admin, so `canViewMail` returns `false` and `authorize` passes a `403` error to the error handler.

---

### 8.4 Error Path — No Token Provided (401 Unauthorized)

```bash
curl http://localhost:3000/mail/2
```

```json
{
  "error": "Unauthorized",
  "message": "Missing Authorization header.",
  "statusCode": 401,
  "requestId": "f1e2d3c4-b5a6-7890-fedc-ba9876543210",
  "timestamp": "2026-04-24T03:00:00.000Z"
}
```

---

### 8.5 Error Path — Rate Limit Exceeded (429)

After sending more than `RATE_LIMIT_MAX` requests within `RATE_LIMIT_WINDOW_SECONDS` from the same IP:

```bash
curl http://localhost:3000/status
```

```json
{
  "error": "TooManyRequests",
  "message": "Rate limit exceeded. Please try again later.",
  "statusCode": 429,
  "requestId": "11223344-5566-7788-99aa-bbccddeeff00",
  "timestamp": "2026-04-24T03:00:00.000Z"
}
```

HTTP response headers will include:

```http
Retry-After: 47
```

Wait the indicated number of seconds before retrying.

---

## 9. Environment Variables

| Variable                    | Required | Default                               | Description                          |
|-----------------------------|----------|---------------------------------------|--------------------------------------|
| `JWT_SECRET`                | Yes       | `HPPrajapati`                         | Secret used to sign and verify JWTs  |
| `RATE_LIMIT_MAX`            | No       | `5`                                   | Max requests per window per IP       |
| `RATE_LIMIT_WINDOW_SECONDS` | No       | `60`                                  | Rate limit window in seconds         |

> **Important:** The current project code falls back to `HPPrajapati` if `JWT_SECRET` is not set. For local or deployed use, you should still set a strong, unique secret in your environment or Docker configuration.