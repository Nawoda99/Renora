# syntax=docker/dockerfile:1

# Build the frontend
FROM node:22.13-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Runtime image (API + serves built dist/)
FROM node:22.13-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# MySQL client tools are useful for manual database administration in the container.
RUN apk add --no-cache mysql-client

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Default port; can be overridden by env PORT
ENV PORT=5174
EXPOSE 5174

CMD ["node", "server/index.js"]
