# 📬 Mail REST API  
**INFT2201 – Web Development Enterprise**

This project is a RESTful API for managing mail messages. It is built using PHP, MySQL, Docker, and PHPUnit, and follows Test-Driven Development (TDD) principles. The API supports full CRUD operations and returns JSON responses with proper HTTP status codes.

---

## 📌 Features

- Create mail
- Retrieve a single mail by ID
- Retrieve all mail
- Update existing mail
- Delete mail
- JSON API responses
- Proper HTTP status codes
- Dockerized environment
- PHPUnit test coverage

---

## 🏗️ Project Structure

    .
    ├── docker-compose.yml
    ├── Dockerfile
    ├── init-prod/
    │   └── init.sql
    ├── html/
    │   ├── api/
    │   │   └── mail/
    │   ├── src/
    │   │   └── Application/
    │   │       ├── Mail.php
    │   │       └── Page.php
    │   ├── tests/
    │   │   └── Application/
    │   │       └── MailTest.php
    │   ├── composer.json
    │   └── .htaccess

---

## 🐳 Running the Application

### 1. Build and Start Containers

    docker-compose up --build

This will:
- Start the Apache/PHP container
- Start the MySQL container
- Initialize the production database

---

### 2. Access the API

Base URL:

    http://localhost:8080/api/mail

---

## 📡 API Endpoints

### 🔹 Get All Mail

GET  
    /api/mail

Response:
- 200 OK  
- Returns a JSON array of mail objects

---

### 🔹 Get Mail by ID

GET  
    /api/mail/{id}

Responses:
- 200 OK – Mail found
- 404 Not Found – If the ID does not exist

---

### 🔹 Create Mail

POST  
    /api/mail

Request Body (JSON):

    {
      "subject": "Test Subject",
      "body": "Test message body"
    }

Responses:
- 201 Created (or 200 OK)
- 400 Bad Request (invalid or missing input)

---

### 🔹 Update Mail

PUT  
    /api/mail/{id}

Request Body (JSON):

    {
      "subject": "Updated Subject",
      "body": "Updated body"
    }

Responses:
- 200 OK
- 404 Not Found
- 400 Bad Request

---

### 🔹 Delete Mail

DELETE  
    /api/mail/{id}

Responses:
- 200 OK
- 404 Not Found

---

## 🧪 Running Tests

This project uses PHPUnit for testing.

Run inside the container:

    vendor/bin/phpunit

The test suite includes tests for:

- createMail()
- getMail()
- getAllMail()
- updateMail()
- deleteMail()

The test database is reset before each test to ensure isolation.

---

## 🛠️ Technologies Used

- PHP 8+
- MySQL
- Apache
- Docker & Docker Compose
- Composer (PSR-4 Autoloading)
- PHPUnit

---

## 🔒 Security & Best Practices

- All SQL queries use prepared statements
- No direct SQL string interpolation
- Proper HTTP status codes for all responses
- JSON-only API responses
- Environment variables for database configuration
- vendor/ directory excluded from submission

---

## 📋 Database Schema

Example mail table:

    CREATE TABLE mail (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

---

## 🧠 Development Approach

This project follows:

- RESTful API design principles
- Test-Driven Development (TDD)
- Clean separation of concerns
- Dockerized development environment

---

## 👨‍💻 Author

Student Name: [Your Name]  
Course: INFT2201 – Web Development Enterprise
