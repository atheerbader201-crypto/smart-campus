# Smart Campus

Lost & found listings for campus — React (Vite) frontend + Express/MongoDB API.

## Project structure

| Path | Description |
|------|-------------|
| `client/` | React frontend |
| `server/` | Express API |
| `docker-compose.yml` | Run API + frontend together |

---

## Local development (without Docker)

### 1. API

```bash
cd server
cp .env.example .env
# Edit .env — set MONGODB_URI (MongoDB Atlas)
npm install
npm run dev
```

API: http://localhost:5000

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:5173 (Vite default)

---

## Containerization (Docker)

### API only

```bash
docker build -t smart-campus-api ./server
docker run --rm -p 5000:5000 \
  -e MONGODB_URI="your-mongodb-atlas-uri" \
  smart-campus-api
```

### Frontend only

```bash
docker build -t smart-campus-client \
  --build-arg VITE_API_URL=http://localhost:5000 \
  ./client
docker run --rm -p 8080:80 smart-campus-client
```

Open http://localhost:8080

### Orchestration — API + frontend

```bash
# From repo root
cp .env.example .env
# Edit .env — set MONGODB_URI (MongoDB Atlas)

docker compose up --build
```

| Service | URL |
|---------|-----|
| API | http://localhost:5000 |
| Web UI | http://localhost:8080 |

Stop: `docker compose down`

---

## Tests (frontend)

```bash
cd client
npm run test:run
```

---

## Deploy on Render (recommended: one service)

The root `Dockerfile` builds the React app and runs Express on one URL (API + UI). No separate `VITE_API_URL` needed in production.

1. Push this repo to GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** (or **Web Service** → **Docker**).
3. Connect the repo. Use **Dockerfile** at repo root (not the old Static Site-only setup).
4. Set **`MONGODB_URI`** to your MongoDB Atlas URI (same as local `server/.env`).
5. In Atlas → **Network Access** → allow `0.0.0.0/0` (or Render IPs).
6. Deploy. Open your service URL (e.g. `https://smart-campus-xxxx.onrender.com`).

If you still have a **Static Site** service (frontend only), delete it or replace it with this Docker Web Service — otherwise `/admin/stats` returns 404.

**Free tier:** first request after idle can take ~1 minute.

---

## Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `MONGODB_URI` | server / Docker / Render | MongoDB Atlas connection |
| `PORT` | server / Render | API port (Render sets this automatically) |
| `VITE_API_URL` | client build (local only) | `http://localhost:5000` for `npm run dev` |
