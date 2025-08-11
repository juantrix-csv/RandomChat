# RandomChat Server

This is a minimal [NestJS](https://nestjs.com/) server for RandomChat.

It uses [TypeORM](https://typeorm.io/) for PostgreSQL access because of its tight
integration with NestJS and support for Postgres-specific types such as
`citext` and JSONB.

## Development

```bash
npm install
npm run dev
```

The server runs on `http://localhost:3000`.

### Database

Set the `DATABASE_URL` environment variable to a PostgreSQL connection string.

Run migrations with:

```bash
npm run migrate
```

To drop and recreate all tables:

```bash
npm run migrate:reset
```

## Production build

```bash
npm run build
npm start
```

Swagger documentation is available at `http://localhost:3000/docs` and a health check at `http://localhost:3000/health`.
