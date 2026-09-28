# Development Plan

## Phase 1 — Foundation (current)

- Establish Git and pnpm workspace structure.
- Define application/package boundaries and TypeScript conventions.
- Add environment template, documentation, and initial shared contracts/translations.
- Deliberately exclude schema, authentication, screens, dashboards, AI, and infrastructure.

## Phase 2 — Core backend and data (current)

- Add Prisma’s MySQL schema, client generation, domain relations, indexes, and a migration when a MySQL connection is configured.
- Create the NestJS modular-monolith shell with safe configuration validation, CORS, a global validation pipe, Prisma service, and `GET /api/health`.
- Establish module boundaries for auth, users, materials, prices, lots, recyclers, offers, traceability, payments, and safety. JWT/OTP, CRUD APIs, and payment processing remain intentionally deferred.

## Phase 3 — Collector MVP

- Implement low-literacy multilingual collector flow, offline SQLite drafts/outbox, item capture, and current price view.

## Phase 4 — Lots and recycler workflow

- Add QR-tagged lots, recycler authorization, offers, pickup booking, and digital handover.

## Phase 5 — Trust and operations

- Add cash/UPI records, earnings ledger, notifications, complaints, ratings, and admin controls.

## Phase 6 — Assistive intelligence and demo hardening

- Add safe visible-condition AI only after verified data and review workflows exist.
- Add explainable anomaly rules, environmental impact, demo data, offline testing, and SIH rehearsal.
