# Job API Server

Job API Server is a backend service that provides authentication and job management features using Node.js and Express. It follows best practices for security, validation, and API documentation.

## Features:

- User authentication (Register, Login) with JWT.
- CRUD operations for job listings.
- Security measures: rate limiting, helmet, CORS, and XSS protection.
- API documentation with Swagger.
- MongoDB integration using Mongoose.

## Tech Stack:

- **Backend:** Node.js, Express `4.21.1`
- **Database:** MongoDB, Mongoose `8.7.3`
- **Security:** Helmet `8.0.0`, Express Rate Limit `7.4.1`, XSS-Clean `0.1.4`
- **Auth:** JWT `9.0.2`, BcryptJS `2.4.3`
- **API Documentation:** Swagger-UI-Express `5.0.1`, YAMLJS `0.3.0`

## Installation & Usage:

### 1. Clone the repository:

```bash
git clone https://github.com/MF-Vv/job-api-server.git
cd job-api-server
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Create a `.env` file and configure environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
TEST_USER_ID=your_user_id
```

### 4. Start the server:

```bash
npm start
```

Server will be running at `http://localhost:5000`

### 5. Run in development mode:

```bash
npm run dev
```

## API Endpoints:

### Authentication:

#### Register:

```http
POST /api/v1/auth/register
```

**Request Body:**

```json
{
  "name": "example",
  "email": "example@example.com",
  "password": "example@password"
}
```

#### Login:

```http
POST /api/v1/auth/login
```

**Request Body:**

```json
{
  "email": "example@example.com",
  "password": "example@password"
}
```

### Jobs:

#### Get All Jobs:

```http
GET /api/v1/jobs
```

#### Get Job by ID:

```http
GET /api/v1/jobs/{id}
```

#### Create Job:

```http
POST /api/v1/jobs
```

**Request Body:**

```json
{
  "company": "Tesla",
  "position": "Intern"
}
```

#### Update Job:

```http
PATCH /api/v1/jobs/{id}
```

**Request Body:**

```json
{
  "company": "Microsoft",
  "position": "Internship Junior"
}
```

#### Delete Job:

```http
DELETE /api/v1/jobs/{id}
```

## Authentication & Security:

- JWT-based authentication
- Secure routes require `Authorization: Bearer <token>`

## Deployment:

This API is deployed on Render:

```
https://job-api-server.onrender.com/api-docs
```

### Important Notice:

🚨 **Free-tier Limitation:** Since this API is hosted on a free account, the server may spin down due to inactivity, causing delays of up to 50 seconds when handling requests.
