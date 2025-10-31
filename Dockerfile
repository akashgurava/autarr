# Production Dockerfile - Multi-stage build
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Placeholder variable for build time
ENV PB_URL=http://pocketbase:8090

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# Install production dependencies only with cache mount
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --prod --frozen-lockfile

# Expose application port
EXPOSE 3000

# Healthcheck: verify app health endpoint responds OK
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=20s \
  CMD wget --spider -q http://localhost:3000/api/health || exit 1

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Run the production server
CMD ["node", "build"]
