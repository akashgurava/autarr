# Autarr

A SvelteKit application with PocketBase backend, powered by [`sv`](https://github.com/sveltejs/cli).

## Features

- 🚀 SvelteKit with SSR support
- 🎨 TailwindCSS v4 for styling
- 🗄️ PocketBase backend integration
- 🐳 Docker support for dev and prod environments
- ✅ Vitest with browser testing
- 🔧 TypeScript, ESLint, and Prettier configured

## Quick Start

### Local Development (without Docker)

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm dev
```

Visit `http://localhost:5173`

### Docker Development (with PocketBase)

Start the full stack with hot reload:

```sh
pnpm docker:dev
```

This will start:
- SvelteKit dev server on `http://localhost:5173`
- PocketBase backend (internal only, accessible via server-side code)

See [DOCKER.md](./DOCKER.md) for detailed Docker documentation.

## Available Scripts

### Development
- `pnpm dev` - Start local dev server
- `pnpm docker:dev` - Start Docker dev environment
- `pnpm docker:dev:build` - Rebuild and start Docker dev environment

### Production
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm docker` - Start Docker production environment
- `pnpm docker:build` - Rebuild and start Docker production environment

### Testing & Quality
- `pnpm test` - Run all tests
- `pnpm test:unit` - Run tests in watch mode
- `pnpm check` - Type check with svelte-check
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier

### Docker Management
- `pnpm docker:down` - Stop production environment
- `pnpm docker:dev:down` - Stop dev environment
- `pnpm docker:clean` - Remove all Docker resources

## Project Structure

```
autarr/
├── src/
│   ├── lib/          # Shared components and utilities
│   ├── routes/       # SvelteKit routes
│   └── app.css       # Global styles
├── static/           # Static assets
├── docker-compose.yml       # Production environment config
├── docker-compose.dev.yml   # Dev environment config
├── Dockerfile        # Production container image
├── Dockerfile.dev    # Dev container image
└── DOCKER.md         # Docker documentation
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```sh
cp .env.example .env
```

Key variables:
- `POCKETBASE_URL` - Internal PocketBase URL (server-side only)

## PocketBase

PocketBase runs as an internal service and is only accessible from server-side code. It is not exposed to the public internet for security.

Data is persisted in Docker volumes:
- Development: `autarr_pocketbase_dev`
- Production: `autarr_pocketbase`

## Deployment

This project uses `@sveltejs/adapter-node` for SSR deployment.

### Docker Production Deployment

```sh
pnpm docker:build
```

The production build includes:
- Multi-stage Docker build for minimal image size
- Build caching for faster rebuilds
- Optimized and minified assets
- Production-ready Node.js server

See [DOCKER.md](./DOCKER.md) for advanced deployment options.

## Tech Stack

- **Framework:** SvelteKit 2.x with Svelte 5
- **Styling:** TailwindCSS v4
- **Backend:** PocketBase 0.31
- **Testing:** Vitest with Playwright
- **Language:** TypeScript
- **Package Manager:** pnpm
