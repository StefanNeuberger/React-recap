# Todo App Frontend

React + TypeScript + Vite + Tailwind + Orval + React Query.

## Development

```bash
# install deps
npm install

# run dev server (frontend only; backend assumed at :8080)
npm run dev
```

## Keeping the API client up to date

1. Make sure the Spring backend is running locally on `http://localhost:8080`.
2. Download the latest OpenAPI document and regenerate the client:

```bash
npm run client:generate
```

That script curls `/v3/api-docs` into `openapi.json` and then runs `npm run orval` to update everything inside `src/api/generated`.

```bash
npm run orval:watch
```

## Linting

```bash
npm run lint
```
