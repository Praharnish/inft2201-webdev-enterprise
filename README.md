# 🌐 INFT2201 – Enterprise Web Development

A collection of three enterprise-level web development assignments completed as part of the **INFT2201** course. This repository covers building RESTful APIs, implementing authentication and role-based access control, and hardening Node.js APIs with JWT, logging, rate limiting, and centralized error handling — all within fully Dockerized environments.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Assignments](#assignments)
  - [Assignment 1 – REST API for a Mail App (PHP + Docker + TDD)](#assignment-1--rest-api-for-a-mail-app-php--docker--tdd)
  - [Assignment 2 – Authentication, Authorization & RBAC (Node + PHP + JWT)](#assignment-2--authentication-authorization--rbac-node--php--jwt)
  - [Assignment 3 – Secure Node.js API (JWT + RBAC + Logging + Rate Limiting)](#assignment-3--secure-nodejs-api-jwt--rbac--logging--rate-limiting)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Author](#author)

---

## 📌 Overview

This repository demonstrates progressive, enterprise-grade backend development across three assignments. Each builds on core concepts from the previous — starting from raw PHP REST APIs, advancing to multi-service authentication, and culminating in a hardened Node.js API with professional-grade middleware.

---

## 📁 Repository Structure

```
inft2201-webdev-enterprise/
├── Assignment 1 Build a REST API for a Mail App (PHP + Docker + TDD)/
│   ├── docker/
│   ├── html/
│   │   ├── src/Application/
│   │   │   ├── Mail.php
│   │   │   └── Page.php
│   │   ├── tests/Application/
│   │   │   └── MailTest.php
│   │   └── api/mail/
│   ├── init-prod/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── Assignment 2 – Authentication, Authorization, and RBAC (Node + PHP + JWT)/
│   ├── docker/
│   ├── node/
│   │   └── index.js
│   └── codebase/
│       ├── html/        ← React client (provided)
│       └── api/mail/    ← PHP endpoints
│
├── Assignment 3/
│   ├── api/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── policies/
│   │   └── data/
│   ├── docs/
│   │   └── dev-doc-template.md
│   └── docker-compose.yml
│
└── README.md
```

---

## 📚 Assignments

### Assignment 1 – REST API for a Mail App (PHP + Docker + TDD)

**Tech:** PHP 8.2 · PostgreSQL · Docker · Composer (PSR-4) · PHPUnit · Apache

A fully containerized RESTful API for a corporate mail application built with PHP, backed by PostgreSQL, and developed using a Test-Driven Development (TDD) workflow. All endpoints follow proper REST semantics with appropriate HTTP status codes.

**API Endpoints:**

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/mail/` | List all mail entries |
| `GET` | `/api/mail/{id}` | Retrieve a specific entry |
| `POST` | `/api/mail/` | Create a new mail entry |
| `PUT` | `/api/mail/{id}` | Update an existing entry |
| `DELETE` | `/api/mail/{id}` | Delete a mail entry |

**Key concepts covered:**
- TDD with PHPUnit — all five database operations tested before implementation (`createMail`, `getMail`, `getAllMail`, `updateMail`, `deleteMail`)
- Dockerized PHP + Apache + dual PostgreSQL setup (separate prod and test databases)
- PSR-4 autoloading with Composer
- Prepared statements for all user-input queries (SQL injection prevention)
- Clean URL routing via `.htaccess` rewrites
- JSON responses and correct HTTP status codes (`200`, `201`, `400`, `404`, `500`)
- Isolated test database with table teardown/rebuild in `setUp()`

**Run locally:**
```bash
cd "Assignment 1 Build a REST API for a Mail App (PHP + Docker + TDD)"
docker-compose up --build --detach

# Install Composer inside the container
docker-compose run --rm app bash
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
cd /var/www/html && composer install

# Run tests
docker-compose run --rm app vendor/bin/phpunit tests
```

**Test the API with curl:**
```bash
# Create mail
curl -X POST http://localhost:8080/api/mail/ \
  -H "Content-Type: application/json" \
  -d '{"subject":"Hello","body":"World"}'

# List all
curl http://localhost:8080/api/mail/

# Get by ID
curl http://localhost:8080/api/mail/1

# Update
curl -X PUT http://localhost:8080/api/mail/1 \
  -H "Content-Type: application/json" \
  -d '{"subject":"Updated","body":"Content"}'

# Delete
curl -X DELETE http://localhost:8080/api/mail/1
```

---

### Assignment 2 – Authentication, Authorization & RBAC (Node + PHP + JWT)

**Tech:** Node.js · PHP · JWT (`jsonwebtoken`) · React (provided UI) · Docker · PostgreSQL

A multi-service architecture upgrade to the mail app, adding user accounts, stateless JWT-based authentication, and role-based access control (RBAC) across a Node.js login service and PHP API backend. A fully functional React client is provided and driven entirely by backend implementation.

**Architecture:**
```
React Client → POST /node/login → Node.js service (issues JWT)
React Client → GET/POST /api/mail/ → PHP API (validates JWT via Verifier class)
```

**Key concepts covered:**
- Node.js login service validating credentials from `users.txt` (`username,password,userId,role`)
- JWT issuance with signed payload containing `userId` and `role`
- PHP `Verifier` class (autoloaded via Composer) decoding and verifying JWT on every request
- `Authorization: Bearer <token>` header enforcement — returns `401` if missing or invalid
- RBAC enforcement:
  - **Admin** — sees all mail, can create mail for any user
  - **Regular user** — sees only their own mail, creates mail scoped to their `userId`
- Dockerized multi-service setup (Node container + PHP/Apache container + PostgreSQL)
- Clean separation of concerns: Node handles auth, PHP handles data

**Run locally:**
```bash
cd "Assignment 2 – Authentication, Authorization, and RBAC (Node + PHP + JWT)/docker"
docker-compose build && docker-compose up -d

# Test login
curl -X POST http://localhost/node/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"12345"}'
```

---

### Assignment 3 – Secure Node.js API (JWT + RBAC + Logging + Rate Limiting)

**Tech:** Node.js · JWT · Docker · UUID · Express middleware

A purpose-built, security-hardened Node.js API implementing professional-grade middleware patterns: JWT authentication, composable RBAC policies, structured request logging with trace IDs, in-memory rate limiting, and a centralized error handler. Includes full developer documentation.

**API Endpoints:**

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| `GET` | `/status` | No | Health check |
| `POST` | `/auth/login` | No | Authenticate and receive JWT |
| `GET` | `/mail/:id` | Yes | Retrieve mail (RBAC enforced) |

**Middleware pipeline for `GET /mail/:id`:**
```
authenticateJWT → loadMail → authorize(canViewMail) → handler
```

**Key concepts covered:**

- **JWT Authentication** — `/auth/login` validates credentials from `data/users.js`, signs a JWT with `userId` and `role`, returns `{ token }`. `authenticateJWT` middleware verifies `Authorization: Bearer` header and attaches `req.user`.

- **RBAC with composable policies:**
  - `isAdmin(user)` — returns `true` if role is `"admin"`
  - `ownsResource(user, mail)` — returns `true` if `mail.userId === user.userId`
  - `canViewMail(user, mail)` — allows access if admin OR owner
  - `authorize(policy)` middleware — reads `req.user` and `req.mail`, calls `next(err)` with a Forbidden error if the policy fails

- **Request logging with trace IDs** — `requestLogger` middleware generates a UUID per request, attaches it as `req.requestId`, and logs `REQUEST <id> <METHOD> <PATH>`. The same ID is included in all error responses for end-to-end tracing.

- **Rate limiting** — configurable via `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_SECONDS` environment variables. Tracks requests per IP or authenticated `userId`. Exceeding the limit triggers a `429 Too Many Requests` response with a `Retry-After` field.

- **Centralized error handler** — all errors from all middleware funnel through `errorHandler.js`, which returns a consistent JSON structure:
  ```json
  {
    "error": "Forbidden",
    "message": "You do not have access to this resource",
    "statusCode": 403,
    "requestId": "a1b2c3d4-...",
    "timestamp": "2025-11-30T12:34:56Z"
  }
  ```
  Stack traces and internal details are never exposed to the client.

- **Developer documentation** — `docs/dev-doc-template.md` documents the full authentication flow, required headers, RBAC rules per endpoint, rate limiting behaviour, and example request/response pairs for success, forbidden, and rate-limited scenarios.

**Run locally:**
```bash
cd "Assignment 3"
docker-compose up --build

# Health check
curl http://localhost:3000/status

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"12345"}'

# Access mail with token
curl http://localhost:3000/mail/1 \
  -H "Authorization: Bearer <your_token>"
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **PHP 8.2** | REST API development (Assignment 1 & 2) |
| **Node.js / JavaScript** | Login service, secure API (Assignment 2 & 3) |
| **PostgreSQL 16** | Relational database |
| **Docker / Docker Compose** | Containerization across all assignments |
| **JWT** | Stateless authentication tokens |
| **PHPUnit** | Test-driven development (Assignment 1) |
| **Composer / PSR-4** | PHP dependency management and autoloading |
| **React** | Provided frontend client (Assignment 2) |
| **HTML / Shell** | Supporting files and scripts |

**Language breakdown:**
- JavaScript — 53.9%
- PHP — 38.0%
- Dockerfile — 5.6%
- HTML — 1.6%
- Shell — 0.9%

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Node.js](https://nodejs.org/) v16+
- [PHP](https://www.php.net/) 8.0+
- [Composer](https://getcomposer.org/)

### Clone the Repository

```bash
git clone https://github.com/Praharnish/inft2201-webdev-enterprise.git
cd inft2201-webdev-enterprise
```

Each assignment is self-contained — navigate into the relevant folder and follow the **Run locally** instructions in its section above.

---

## 👤 Author

**Praharnish**
- GitHub: [@Praharnish](https://github.com/Praharnish)

---

> 📘 *This repository is part of coursework for INFT2201 – Enterprise Web Development.*
