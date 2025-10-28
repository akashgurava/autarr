FROM node:22-alpine AS build
WORKDIR /app

# Prepare pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

# Copy package manifests first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .

# Allow overriding base path, app version, and PocketBase URL at build time
ENV PUBLIC_PB_URL=/pb

# Build SvelteKit static site
RUN pnpm run build

# Use multi-arch PocketBase image to copy the binary
FROM adrianmusante/pocketbase:0.31 AS pb

# Final image to hold SSG site + PocketBase
FROM nginx:1.29.2-alpine-slim AS prod
WORKDIR /app

RUN apk add --no-cache ca-certificates && \
    mkdir -p /usr/share/nginx/html /etc/nginx/conf.d /data

COPY --from=pb /usr/local/bin/pocketbase /usr/local/bin/pocketbase
COPY --from=build /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

VOLUME ["/data"]

EXPOSE 8066

# Start PocketBase and nginx parallelly
CMD ["/start.sh"]
