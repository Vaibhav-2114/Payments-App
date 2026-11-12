# PaymentsApp

A full-stack payments application for account registration, balance management, friend discovery, and user-to-user transfers. The frontend is built with React and Vite; the API is an Express server backed by MongoDB and Mongoose.

> **Project status:** This is a learning/demo application. The Add Money endpoint credits a fixed amount and should not be treated as a real payment integration.

## Features

- Sign up and sign in with JWT-based authentication
- Protected dashboard with account balance
- Search for users and add friends
- Transfer funds to another user
- MongoDB-backed users and accounts
- React single-page app styled with Tailwind CSS

## Tech stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose, MongoDB, JWT, bcryptjs
- **Package manager:** npm or Bun (lockfiles are included in the respective app directories)

## Requirements

- Node.js (a current LTS release is recommended)
- MongoDB connection string (local MongoDB or a hosted MongoDB deployment)
- npm, or Bun if you prefer to use the included `bun.lock` files

## Getting started

### 1. Configure the backend

```bash
cd backend
```

Create `backend/.env` with the following values:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/paymentsapp
JWT_SECRET=replace-this-with-a-long-random-secret
PORT=3000
```

Use a strong, private `JWT_SECRET`. Do not commit `.env` files or real credentials.

Install dependencies and start the API:

```bash
npm install
npm start
```

The backend starts on `http://localhost:3000` by default. It connects to MongoDB before listening for requests.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite serves the frontend at `http://localhost:5173` by default. The backend CORS configuration currently allows that origin, and the frontend API client currently points to `http://localhost:3000`.

### Using Bun

Bun lockfiles are provided in both `backend/` and `frontend/`. To use Bun instead of npm, run `bun install` in each directory. Start the backend with `bun run start` and the frontend with `bun run dev`.

## Available scripts

### Frontend (`frontend/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

### Backend (`backend/`)

| Command | Description |
| --- | --- |
| `npm start` | Start the API with Nodemon and load `backend/.env` |

## API overview

All routes are prefixed with `/api`. Routes marked **Protected** require a bearer token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/user/signup` | Public | Register a user |
| `POST` | `/api/user/signin` | Public | Authenticate and receive a token |
| `GET` | `/api/user/me` | Protected | Get the current authenticated user |
| `GET` | `/api/user/search?username=...` | Protected | Find a user by username |
| `GET` | `/api/friends/getfriends` | Protected | Get the current user's friends |
| `POST` | `/api/friends/addfriend` | Protected | Add a friend by user ID |
| `GET` | `/api/account/balance` | Protected | Get the current account balance |
| `GET` | `/api/account/addmoney` | Protected | Add the demo credit to the current account |
| `POST` | `/api/account/transfer` | Protected | Transfer money to another account |

Transfer requests use a recipient user ID and a numeric amount:

```json
{
  "toUserID": "recipient-user-id",
  "amount": 25
}
```

The API validates the transfer amount and recipient. For production financial use, add appropriate payment-provider integration, stronger operational safeguards, and tests/security review.

## Project structure

```text
paymentsApp/
├── backend/
│   ├── configs/       # Application configuration, including JWT settings
│   ├── controllers/   # API request handlers
│   ├── database/      # MongoDB connection
│   ├── middleware/    # Authentication middleware
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express route definitions
│   └── index.js       # API server entry point
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        └── App.jsx
```

## Security notes

- Keep `backend/.env` private; never commit secrets or production credentials.
- JWT-protected endpoints require a valid bearer token.
- The current frontend and CORS settings are configured for local development. Update them before deploying to other origins.
- The fixed-credit Add Money route is for demonstration only, not a real deposit flow.
