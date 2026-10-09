# Frontend: Next.js standalone build -> tiny Node server (no node_modules at runtime)

# ---- 1. Install dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- 2. Build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Empty = the browser calls /api/... on the same site; nginx forwards it to the backend
ARG NEXT_PUBLIC_API_BASE_URL=""
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
# Cap the build's memory so it fits a small server (with swap)
ENV NODE_OPTIONS=--max-old-space-size=1024
RUN npm run build

# ---- 3. Run (only the standalone server + static files) ----
FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Fewer background threads = less memory
ENV UV_THREADPOOL_SIZE=2
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
# Small heap (measured: ~125 MB peak under load with these flags)
CMD ["node", "--max-old-space-size=48", "--max-semi-space-size=1", "server.js"]
