# Service Network

Small Express and EJS application for managing partner organizations, service projects, categories, and volunteer signups.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in your database and session values.
3. Create the database schema from `src/models/setup.sql`.
4. Start the app with `npm run dev` or `npm start`.

## Environment Variables

- `NODE_ENV`: `development` or `production`
- `PORT`: HTTP port for the server
- `DB_URL`: PostgreSQL connection string
- `SESSION_SECRET`: secret used to sign session cookies
- `ENABLE_SQL_LOGGING`: set to `true` to log SQL queries in development

## Recent Hardening

- Session cookie settings are environment-aware.
- Logout and volunteer actions use `POST` instead of `GET`.
- Missing records now return proper 404 responses.
- Category assignment updates are wrapped in a database transaction.
