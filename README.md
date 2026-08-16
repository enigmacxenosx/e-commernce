# Enosx Technologies — E-commerce Aggregator

![Enosx Technologies](https://img.shields.io/badge/Enosx-Technologies-0ea5e9) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Build](https://img.shields.io/badge/build-passing-22c55e)

Enosx Technologies is a trusted electronics aggregator, bringing you the best deals from Kenya's top e-commerce platforms — **Jumia**, **Kilimall**, and **Jiji** — all in one place. Built and maintained by [Enosh Yeswa](https://github.com/enigmacxenosx) and the Enosx team since 2024.

> **Contact us:** WhatsApp [+254 798 303 978](https://wa.me/254798303978) · Instagram [@enosx_tech](https://instagram.com/enosx_tech) · [@engima_cx](https://instagram.com/engima_cx)

## Live Site

| Item | Details |
| :--- | :--- |
| Production | [enosxtech-hub.vercel.app](https://enosxtech-hub.vercel.app) |
| Stack | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Hosting | Vercel |

## Features

- **Unified search** — search products across multiple platforms simultaneously.
- **Price comparison** — compare prices and features side by side to find the best deals.
- **Watchlist & cart** — save items you love and check out in one flow.
- **Order tracking** — keep track of all orders in a single dashboard.
- **Product detail pages** — multi-image galleries and full specifications for electronics.

## Routes

| Route | Purpose |
| :--- | :--- |
| `/` | Home — featured deals |
| `/search` | Unified cross-platform search |
| `/compare` | Price comparison view |
| `/cart`, `/checkout` | Shopping flow |
| `/orders/[id]` | Order tracking |
| `/watchlist` | Saved items |
| `/auth/*` | Login, signup, profile setup |

## Getting Started

```bash
git clone https://github.com/enigmacxenosx/e-commernce.git
cd e-commernce
npm install
npm run dev        # local development at http://localhost:3000
npm run build      # production build
```

## Project Structure

```text
app/              # Next.js App Router (pages, API routes, auth)
components/       # Shared UI components
hooks/            # Custom React hooks
lib/              # Utilities and API clients
scripts/          # Build and deployment helpers
styles/           # Global CSS and theme tokens
docs/             # Architecture and design documentation
public/           # Product imagery and static assets
```

## Security

The dependency lockfile is kept clean: the August 2026 security pass removed three high-severity npm vulnerabilities. Run `npm audit` periodically and update the lockfile when new advisories appear.

## Enosx Portfolio

| Product | URL |
| :--- | :--- |
| ENOSX AI | https://enosxai.vercel.app |
| E-commerce Hub | https://enosxtech-hub.vercel.app |
| Tech Site | https://enosxtech.vercel.app |
| Exlover Coaching | https://exlover.vercel.app |

## License

Proprietary — © 2024–2026 Enosx Technologies. All rights reserved.
