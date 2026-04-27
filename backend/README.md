# WorkDesk Backend

Phase 1 backend foundation for the WorkDesk application.

## Setup

1. Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string.
2. Install dependencies with `npm install`.
3. Start the server with `npm run dev`.

## Deploying On Render

Use `npm install` as the build command and `npm start` as the start command.

Set these environment variables in Render:

- `NODE_ENV=production`
- `PORT=10000` (or leave unset and let Render provide `PORT`)
- `MONGODB_URI=<your-mongodb-uri>`
- `JWT_SECRET=<long-random-secret>`
- `JWT_REFRESH_SECRET=<long-random-secret>`
- `JWT_EXPIRES_IN=15m`
- `JWT_REFRESH_EXPIRES_IN=7d`
- `BCRYPT_SALT_ROUNDS=12`
- `FRONTEND_URL=https://<your-vercel-domain>`
- `CORS_ORIGIN=https://<your-vercel-domain>`
- For Vercel preview deployments, add the exact preview URL as well.
- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`

## Health Check

The server exposes `GET /health` for a basic runtime check.
