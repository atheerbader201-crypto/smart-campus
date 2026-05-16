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

### Live URLs (Render)

| Role | URL | Mark |
|------|-----|------|
| **Server (API)** | https://smart-campus-cuco.onrender.com | Server — 1 mark |
| **Client (React UI)** | Deploy separately (see below) | Client — 1 mark |

`https://smart-campus-cuco.onrender.com` is the **Express API only** (not the login page).  
Opening it in the browser shows API status JSON; listings: `/items?type=lost`.

#### Deploy the frontend on Render (required for Client mark)

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Static Site**.
2. Connect the same GitHub repo.
3. Settings:
   - **Root Directory:** `client`
   - **Build Command:** `npm ci && npm run build`
   - **Publish Directory:** `dist`
4. **Environment** → add:

   ```env
   VITE_API_URL=https://smart-campus-cuco.onrender.com
   ```

   No trailing slash. **Save** then **Manual Deploy** (rebuild required after any change).

5. Copy the new static site URL (e.g. `https://smart-campus-client.onrender.com`) — use this for the **presentation** (login, listings, admin).

**Important:** `VITE_API_URL` must be the **API** host (`smart-campus-cuco`), not the frontend URL.

Or deploy both services from repo root via **Blueprint** using `render.yaml` (API + static frontend).

### Verify deployment

1. **Server:** https://smart-campus-cuco.onrender.com/items?type=lost — JSON array.
2. **Client:** open your static site URL — home page and login work; Network tab calls `smart-campus-cuco.onrender.com`.
3. Register / login on the **frontend** URL, not the API URL.

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
