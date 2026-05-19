# Smart Campus — production: build React UI + run Express (API + static on one port)
# Render: Web Service → Docker → this file at repo root, set MONGODB_URI

FROM node:20-alpine AS client-build

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ ./

# Same origin as API in production (see client/src/api/api.js)
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

COPY server/ ./
COPY --from=client-build /app/client/dist ./public

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
