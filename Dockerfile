# Stage 1: build the static site
FROM node:22-alpine AS build
WORKDIR /app

# Prepare pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

# Copy package manifests first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
# Allow overriding base path and app version at build time
ARG BASE_PATH=/
ENV BASE_PATH=${BASE_PATH}
ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION}

# Build SvelteKit static site (ensure you're using adapter-static)
RUN pnpm run build

# Stage 2: serve with a tiny node-based static server (serve) on port 8066
FROM node:22-alpine AS prod
WORKDIR /app

# Install `serve` using npm (avoids pnpm global-bin issues in alpine)
RUN npm install -g --silent serve@14.2.0

# Copy static build output from build stage (SvelteKit adapter-static writes to `build/`)
COPY --from=build /app/build /app/build

EXPOSE 8066
# `-s` enables single-page-app fallback; `-l` sets the port
CMD ["serve", "-s", "build", "-l", "8066"]
