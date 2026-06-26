# Scriftex

Self-hosted LaTeX editor with live PDF preview and document management.
## Quick start

```sh
git clone https://github.com/hisyamfausta/scriftex
cd scriftex
docker compose up -d
```

Open `http://localhost:80`. Create a document, write LaTeX, hit **Compile**.

## Architecture

Three containers in Docker Compose:

| Service | Role |
|---------|------|
| **caddy** | Reverse proxy, TLS termination, static file server |
| **backend** | Document CRUD API (Hono + SQLite) |
| **latex** | pdflatex compilation (Hono) |

Caddy proxies `/api/*` to the backend and serves the production-built frontend for all other routes.

## Tech stack

**Frontend:** React.js, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Monaco Editor, react-pdf

**Backend:** Hono, better-sqlite3 (persistent volume)

**LaTeX:** Hono, pdflatex (texlive-full)

**Proxy:** Caddy (auto HTTPS with domain config)

## Project structure

```
scriftex/
├── caddy/
│   ├── Dockerfile        # Multi-stage: builds frontend, runs caddy
│   └── Caddyfile         # Reverse proxy + SPA config
├── frontend/             # React + Vite (built into caddy image)
│   └── src/
│       ├── api/          # API client
│       ├── components/   # UI components
│       └── lib/          # cn() utility
├── backend/              # Document API
│   └── src/
│       ├── db.ts         # SQLite schema + queries
│       └── index.ts      # Hono routes
├── services/latex/               # Compilation service
│   └── src/
│       └── index.ts      # pdflatex runner
└── docker-compose.yml
```

## Configuration

### Domain and HTTPS

Replace `:80` in `caddy/Caddyfile` with your domain for automatic TLS:

```
scriftex.example.com {
    ...
}
```

Then update `docker-compose.yml` to expose ports 80 and 443.

## Development

The current setup is production-oriented (built assets served by Caddy). For development with hot-reload, add a `frontend` service pointing to Vite's dev server:

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
    environment:
      - VITE_API_URL=http://backend:3001
    depends_on:
      - backend
```

Then access `http://localhost:5173` instead.
