# Zap

Zap is a full-stack URL shortener with simple analytics.

## Monorepo Structure

```text
zap/
  backend/   # Express Backend
  frontend/  # React app
```

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Axios
- Tailwind CSS
- React Router

### Backend

- Express
- TypeScript
- MongoDB + Mongoose

## Prerequisites

- Node.js 18+
- pnpm 10+
- A MongoDB connection string

## Environment Variables

### Backend (`backend/.env`)

```env
MONGODB_URI=mongodb://localhost:27017/zap
JWT_SECRET=replace_with_a_strong_secret
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

If `VITE_API_BASE_URL` is not set, the frontend falls back to `/api`.

## Installation

Install dependencies in both apps:

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

## Run Locally

Run backend:

```bash
cd backend
pnpm run dev
```

Run frontend (in a new terminal):

```bash
cd frontend
pnpm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## API Overview

Base API path: `/api`

### User routes

- `POST /api/user/signup` - create account
- `POST /api/user/login` - login and receive JWT
- `GET /api/user` - get current user + links (requires `Authorization: Bearer <token>`)

### Link routes

- `GET /api/link/resolve/:slug` - resolve short link and increment clicks
- `GET /api/link` - list current user's links (auth required)
- `POST /api/link/create` - create a short link (auth required)
- `POST /api/link/update` - update a link by slug (auth required)
- `DELETE /api/link` - delete a link by slug (auth required)

## Frontend Routes

- `/` - landing and auth flow
- `/home` - authenticated dashboard
- `/:slug` - resolves short URL and redirects

## Notes

- Backend `dev` script currently compiles TypeScript and runs the built output (it is not watch mode).
- Slugs allow lowercase letters, numbers, and hyphens.
- When no custom slug is provided, the backend generates one automatically.
