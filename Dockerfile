# syntax=docker/dockerfile:1.4

# Initial image to build static site
FROM node:22-alpine AS build
WORKDIR /app

# Prepare pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

# Copy package manifests first for better caching
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Allow overriding PocketBase URL at build time
ARG PUBLIC_PB_URL=/pb
ENV PUBLIC_PB_URL=${PUBLIC_PB_URL}

# Build SvelteKit static site
RUN pnpm run build && \
    # Remove source maps in production for smaller size
    find build -name '*.map' -type f -delete

# Final production image to hold SSG site + PocketBase
FROM nginx:1.29.2-alpine-slim AS prod

ENV BUILD_MODE=production

WORKDIR /app

# Use multi-arch PocketBase image to copy the binary
FROM adrianmusante/pocketbase:0.31 AS pb
COPY --from=pb /usr/local/bin/pocketbase /usr/local/bin/pocketbase

# Install runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    tini && \
    mkdir -p /usr/share/nginx/html /etc/nginx/conf.d /data && \
    # Create nginx user if it doesn't exist
    addgroup -g 101 -S nginx 2>/dev/null || true && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx 2>/dev/null || true

# Copy built static site with proper permissions
COPY --from=build --chown=nginx:nginx /app/build /usr/share/nginx/html

# Copy nginx config and startup script
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Set proper permissions for data directory
RUN chown -R nginx:nginx /data

# Volume for PocketBase data
VOLUME ["/data"]

# Expose port
EXPOSE 8066

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8066/ || exit 1

# Use tini as init system for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start PocketBase and nginx
CMD ["/start.sh"]
