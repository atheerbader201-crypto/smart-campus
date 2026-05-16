# Root Dockerfile for Render (expects repo root as build context).
# API lives in ./server
FROM node:20-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

COPY server/ ./

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
