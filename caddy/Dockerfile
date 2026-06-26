FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM caddy:alpine
COPY --from=frontend-builder /app/dist /usr/share/caddy
COPY caddy/Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443
