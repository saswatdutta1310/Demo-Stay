# Hotel Demo Template

> Multi-client white-label hotel, resort, and guest house direct-booking demo platform.

Designed to spin up realistic, high-converting direct-booking showcase websites for hotel prospects in under 5 minutes.

---

## 🌟 Key Features

1. **Multi-Tenant / Multi-Client Architecture**:
   - Each prospect demo lives in its own declarative folder inside `clients/<slug>/`.
   - Switching the demo is as simple as updating `CLIENT=client-slug` in `.env`.
2. **Next.js 14 App Router Frontend (`apps/web`)**:
   - Dynamic CSS variable themes (modern, classic, minimal).
   - High-converting direct booking engine with guest checkout & Razorpay test modal.
   - Owner portal protected with simple demo PIN (`OWNER_PIN="1234"`).
   - Interactive demo tools: Demo Banner, interactive Feedback Widget, and 1-click Reset Demo button.
   - Built-in `legal/` routes (Privacy, Terms, Refund Policy) required for payment gateway onboarding.
3. **Express + Prisma Backend (`apps/api`)**:
   - REST API for live inventory checking, hold reservations with 15-min countdown, pricing calculation, and Razorpay orders.
   - Live events / polling feed for the owner dashboard.
   - Automated cleanup job to release unconfirmed room holds.
4. **Shared Types & Zod Schemas (`packages/shared`)**:
   - Zero duplication of types or validation between client and server.
5. **Pitching Automation Scripts (`scripts/`)**:
   - `npm run client:new` -> scaffold a new demo from `_template`.
   - `npm run client:validate` -> validate JSON files against schemas.
   - `npm run demo:seed` -> inject realistic simulated bookings.
   - `npm run demo:reset` -> clean demo database before client pitches.

---

## 📁 Repository Structure

```
hotel-demo-template/
├── clients/                        # Multi-client configurations
│   ├── _template/                  # Blank starter template
│   └── gayatree-stay/              # Gayatree Nivas demo
├── apps/
│   ├── web/                        # Next.js App Router frontend
│   └── api/                        # Express + Prisma API backend
├── packages/
│   └── shared/                     # Shared Zod schemas & TypeScript types
├── scripts/                        # Automation & pitching scripts
└── docs/                           # Architecture, onboarding, pitch script, payments
```

---

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/saswatdutta1310/Demo-Stay.git
cd Demo-Stay

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env

# 4. Generate Prisma client & migrate
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 5. Run development servers
# Terminal 1 (API):
npm run dev:api
# Terminal 2 (Web):
npm run dev:web
```
