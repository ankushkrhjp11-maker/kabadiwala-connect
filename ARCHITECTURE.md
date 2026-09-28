# Architecture

## MVP approach

Kabadiwala Connect begins as a TypeScript modular monolith. A single NestJS API owns business rules and MySQL persistence. The collector mobile app and the two web portals consume its API. Redis, queues, object storage, AI services, and other distributed infrastructure remain optional until a current feature requires them.

## Boundaries

```text
Collector mobile (Expo) ─┐
Recycler portal (Next) ──┼── NestJS API ── MySQL 8.4
Admin portal (Next) ─────┘
                              └── Prisma
```

The future API modules are identity, catalogue, pricing, collection, lots, recycler offers, pickup, QR traceability, payments, earnings, notifications, support, administration, and audit. They are modules in one deployment, not microservices.

## Client principles

- Collector operations will be offline-first using Expo SQLite and an idempotent sync outbox.
- The interface will support English, Hindi, and Marathi, with icon-led and voice-assisted flows.
- Recycler and admin portals will be responsive Next.js applications.

## Data and safety principles

- MySQL will be the authoritative relational store; Prisma migrations will be introduced only in the database phase.
- QR codes will carry a signed, non-sensitive public token; custody changes will be append-only events.
- Payment records and earnings ledger entries will be auditable and immutable by correction-through-reversal.
- Future AI is assistive: it may classify visible objects/visible damage and produce an estimated range with confidence. It cannot infer a hidden internal fault from an ordinary photo. The required response is: `Hidden fault cannot be determined from image — Verification Required.`

## Phase 2 database and backend foundation

MySQL 8.4 is the relational system of record. The Prisma schema at `database/prisma/schema.prisma` owns its future migrations and generates the Prisma client consumed by the NestJS API.

The initial entity graph is deliberately compact:

- A `User` has one role and may have a `CollectorProfile` or `Recycler` profile.
- A collector owns `Lot` records; every lot belongs to one `MaterialCategory`.
- A recycler submits `RecyclerOffer` records against lots.
- `PriceBoard` stores dated, location-specific category prices.
- `TraceabilityEvent` is append-oriented and connects a lot to the acting user.
- `Payment` is a data model only in this phase; no payment endpoint or processing exists.
- `SafetyGuidance` supplies language-specific guidance for material categories.

Money is stored as MySQL decimal values and coordinates use fixed decimal precision. UUIDs are used for primary IDs, relational constraints enforce ownership, and lookup indexes support the MVP’s category, location, status, and timeline queries.

The NestJS API remains one modular deployment. `PrismaModule` provides data access; feature modules establish the future boundaries for auth, users, materials, prices, lots, recyclers, offers, traceability, payments, and safety. The only Phase 2 endpoint is `GET /api/health`.
