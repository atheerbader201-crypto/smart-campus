# Render Web Service (repo root). Prefer Root Directory = server + server/Dockerfile if you prefer.
FROM node:20-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

COPY server/ ./

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
