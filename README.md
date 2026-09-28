# Kabadiwala Connect

Kabadiwala Connect is an SIH MVP for helping informal e-waste collectors create traceable lots, discover authorized recyclers, and record transparent transactions.

## Phase 1 status

This repository contains only the foundation: a pnpm monorepo, project boundaries, shared TypeScript/i18n packages, configuration, and planning documents. No database schema, authentication, AI, collector screens, or dashboards have been implemented.

## Workspaces

- `apps/collector-mobile` — Expo/React Native collector application
- `apps/recycler-portal` — Next.js recycler portal
- `apps/admin-portal` — Next.js administration portal
- `services/api` — NestJS modular-monolith backend
- `packages/types` — shared domain contracts
- `packages/i18n` — Hindi, Marathi, and English translation foundation
- `packages/config` — shared project configuration
- `database/prisma` — reserved for Prisma schema and migrations

## Prerequisites

- Node.js 20.9 or newer
- pnpm 11 or newer
- Git
- Docker Desktop and MySQL 8.4 (required from the database phase)
- Android Studio / Android SDK (required when mobile development starts)

## Commands

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm dev:api
pnpm dev:collector
pnpm dev:recycler
pnpm dev:admin
```

Copy `.env.example` to `.env` before a feature needs environment configuration. Never commit `.env`.

## Product safety commitment

Image analysis may describe only visible external condition. It must not claim hidden hardware faults from an ordinary photograph. Such cases must state: `Hidden fault cannot be determined from image — Verification Required.`

See [ARCHITECTURE.md](ARCHITECTURE.md) and [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md).
