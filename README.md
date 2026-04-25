# 🌐 INFT2201 – Enterprise Web Development

A collection of enterprise-level web development assignments completed as part of the **INFT2201** course. This repository demonstrates progressive backend development skills using modern technologies including PHP, Node.js, Docker, JWT, and Test-Driven Development (TDD).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Assignments](#assignments)
  - [Assignment 1 – REST API for a Mail App (PHP + Docker + TDD)](#assignment-1--rest-api-for-a-mail-app-php--docker--tdd)
  - [Assignment 2 – Authentication, Authorization & RBAC (Node + PHP + JWT)](#assignment-2--authentication-authorization--rbac-node--php--jwt)
  - [Assignment 3](#assignment-3)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Author](#author)

---

## 📌 Overview

This repository contains enterprise web development projects built to industry standards. Each assignment covers a distinct domain of backend and API development — from building RESTful services with containerized environments to implementing secure authentication systems with role-based access control.

---

## 📁 Repository Structure

```
inft2201-webdev-enterprise/
├── Assignment 1 Build a REST API for a Mail App (PHP + Docker + TDD)/
├── Assignment 2 – Authentication, Authorization, and RBAC (Node + PHP + JWT)/
├── Assignment 3/
└── README.md
```

---

## 📚 Assignments

### Assignment 1 – REST API for a Mail App (PHP + Docker + TDD)

**Tech:** PHP · Docker · Test-Driven Development (TDD)

A fully containerized RESTful API for a mail application, built with PHP and Docker. Developed using a Test-Driven Development approach, ensuring reliability and maintainability from the ground up.

**Key concepts covered:**
- Designing and implementing a RESTful API with proper HTTP methods (GET, POST, PUT, DELETE)
- Containerizing a PHP application with Docker and Docker Compose
- Writing unit and integration tests following TDD principles
- JSON request/response handling and input validation
- API endpoint design for mail operations (compose, read, delete, etc.)

---

### Assignment 2 – Authentication, Authorization & RBAC (Node + PHP + JWT)

**Tech:** Node.js · PHP · JSON Web Tokens (JWT) · Role-Based Access Control (RBAC)

A secure authentication and authorization system built across a Node.js frontend layer and PHP backend, secured with JWT. Implements Role-Based Access Control (RBAC) to manage user permissions at a granular level.

**Key concepts covered:**
- User registration, login, and session management
- JWT generation, signing, and verification
- Role-Based Access Control — defining roles (e.g., admin, user) and protecting routes accordingly
- Middleware for token validation and authorization checks
- Cross-service communication between Node.js and PHP layers
- Secure password handling and token expiry

---

### Assignment 3

**Tech:** JavaScript · PHP · HTML · Shell

*(Details to be added as the assignment progresses.)*

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **PHP** | Backend REST API development |
| **Node.js / JavaScript** | Authentication layer & middleware |
| **Docker / Dockerfile** | Containerization and environment consistency |
| **JWT** | Stateless authentication tokens |
| **HTML** | Frontend views |
| **Shell** | Build and automation scripts |
| **TDD** | Test-driven development methodology |

**Language breakdown:**

- JavaScript — 53.9%
- PHP — 38.0%
- Dockerfile — 5.6%
- HTML — 1.6%
- Shell — 0.9%

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PHP](https://www.php.net/) (v8.0 or higher)
- [Composer](https://getcomposer.org/) (PHP dependency manager)

### Clone the Repository

```bash
git clone https://github.com/Praharnish/inft2201-webdev-enterprise.git
cd inft2201-webdev-enterprise
```

### Running Assignment 1 (PHP + Docker)

```bash
cd "Assignment 1 Build a REST API for a Mail App (PHP + Docker + TDD)"
docker-compose up --build
```

The API will be available at `http://localhost:8000` (or as configured in `docker-compose.yml`).

### Running Assignment 2 (Node + PHP + JWT)

```bash
cd "Assignment 2 – Authentication, Authorization, and RBAC (Node + PHP + JWT)"

# Install Node dependencies
npm install

# Start the Node.js server
node index.js
```

Ensure your PHP backend is also running (via Docker or a local server) before testing authenticated routes.

---

## 👤 Author

**Praharnish**
- GitHub: [@Praharnish](https://github.com/Praharnish)

---

> 📘 *This repository is part of coursework for INFT2201 – Enterprise Web Development.*
