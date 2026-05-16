# Smart Campus

Lost & found listings for campus — React (Vite) frontend + Express/MongoDB API.

## Project structure

| Path | Description |
|------|-------------|
| `client/` | React frontend |
| `server/` | Express API |
| `docker-compose.yml` | Run API + frontend together |
| `render.yaml` | Deploy API to [Render](https://render.com) |

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

## Deployment

### Backend — Render (Docker)

1. Push this repo to GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** (or Web Service).
3. Connect the repo. Set **Root Directory** to `server` if not using Blueprint.
4. Environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `NODE_ENV` = `production`
5. Deploy. Copy the service URL, e.g. `https://smart-campus-api.onrender.com`

Or use the included `render.yaml` Blueprint from the repo root.

### Frontend — Netlify / Vercel / Render Static

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Root directory: `client`
4. Environment variable:

   ```env
   VITE_API_URL=https://YOUR-BACKEND-RENDER-URL.onrender.com
   ```

   No trailing slash. Rebuild after changing this value.

Update `client/.env.production` with the same URL for local production builds:

```bash
cd client
npm run build
```

### Live URLs

| App | URL |
|-----|-----|
| Frontend (Render) | https://smart-campus-1-dm81.onrender.com |
| API (Render) | Set after deploying `server/` — e.g. `https://smart-campus-api.onrender.com` |

**Important:** `https://smart-campus-1-dm81.onrender.com` is the **React app** (UI).  
`VITE_API_URL` must be the **backend** URL (Express), not the frontend URL.

On Render → your **frontend** service → **Environment** → add or update:

```env
VITE_API_URL=https://YOUR-API-SERVICE.onrender.com
```

Then **Manual Deploy** / redeploy so the build picks up the variable.

### Verify deployment

1. Open https://smart-campus-1-dm81.onrender.com — home page loads listings.
2. Register / login — browser network tab should call your API host (not the frontend URL).
3. API: open `https://YOUR-API-SERVICE.onrender.com/items?type=lost` — should return JSON (not HTML).

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
| `MONGODB_URI` | server / Docker / Render | MongoDB Atlas connection |
| `PORT` | server / Render | API port (default `5000`) |
| `VITE_API_URL` | client build | Backend base URL for Axios |
