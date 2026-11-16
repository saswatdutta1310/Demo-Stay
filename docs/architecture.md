# System Architecture - Hotel Demo Template

## 1. Multi-Tenant Declarative Structure

```
clients/
  ├── _template/          # Base template copied for each new prospect
  └── <client-slug>/      # Isolated declarative client configuration
       ├── config.json     # Brand metadata, theme colors, map coords
       ├── rooms.json      # Room inventory, rates, amenities
       ├── policies.json   # Check-in/out, cancellation, ID rules
       └── content.json    # FAQs, nearby spots, testimonials
```

## 2. Dynamic Client Loading & Theming
- In `apps/web`, `client-config.ts` reads the active `$CLIENT` configuration at build / server runtime.
- Colors and typography are injected into `:root` as CSS variables (`--color-primary`, `--font-theme`), allowing identical components to morph seamlessly between clients.
- `apps/api` pulls room definitions directly from `clients/$CLIENT/rooms.json` into Prisma database seeds.

## 3. High-Converting Booking State Machine
1. Guest checks dates (`/api/v1/availability`).
2. Guest selects room -> temporary hold booking created (`/api/v1/bookings/hold`) with 15-minute countdown.
3. Razorpay Order generated in test mode.
4. Guest completes test payment -> signature verified (`/api/v1/payments/verify`).
5. Live SSE event published (`/api/v1/owner/events`) to update the Owner Dashboard in real-time.
