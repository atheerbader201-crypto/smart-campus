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

## Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `MONGODB_URI` | server / Docker | MongoDB Atlas connection |
| `PORT` | server | API port (default `5000`) |
| `VITE_API_URL` | client build | Backend base URL for Axios |
