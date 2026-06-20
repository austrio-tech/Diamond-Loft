# Diamond Loft

A full-stack jewellery e-commerce store with a customer storefront and an admin CMS — built with **Next.js 15**, **TypeScript**, **Prisma + SQLite**, and **NextAuth.js**. No third-party services required: the database is a file in the project and images are stored locally.

## Features

**Storefront**
- Home page with admin-managed sections (hero, marquee, categories, featured, trust, testimonials)
- Shop with category filtering, search, and sorting (shareable URLs)
- Category and product detail pages with image galleries and related products
- Cart with localStorage persistence and a 3-step checkout
- Wishlist with localStorage persistence
- WhatsApp order notifications (order summary opens in WhatsApp on checkout)
- Static info pages: FAQ, Shipping, Returns, Size Guide, Care Guide, Privacy, Terms

**Admin panel** (`/admin`, login required)
- Dashboard with stats and recent orders
- Product management (create/edit, image upload, archive, feature toggles)
- Category management
- Order management with status workflow
- Homepage section editor (toggle and edit content of each section)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Database | SQLite via Prisma ORM |
| Auth | NextAuth.js v5 (Credentials) |
| Images | Local `public/uploads/` |
| Styling | Global CSS (storefront) + CSS Modules (admin) |
| Icons | lucide-react |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env and fill in values:

```bash
cp .env.example .env.local
```

- `DATABASE_URL` — already set to `file:./dev.db` (kept in `.env` for the Prisma CLI)
- `AUTH_SECRET` / `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin login (required in production)

### 3. Set up the database

```bash
npm run db:push    # create the SQLite schema
npm run db:seed    # seed 16 products, 4 categories, 6 sections, admin user
```

### 4. Run

```bash
npm run dev        # development (http://localhost:3000)
npm run build      # production build
npm start          # production server
```

### Admin access

Visit `/admin/login`. Default dev credentials (change immediately): `admin@diamondloft.pk` / `changeme123`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Apply schema to the database |
| `npm run db:seed` | Seed initial data (also enables WAL) |
| `npm run db:wal` | Enable SQLite WAL journal mode (run once per new DB) |
| `npm run db:backup` | Create a consistent DB + uploads backup |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |

## Deployment

This app uses **SQLite** and **local file uploads**, so it must run on a host with a **persistent disk** — e.g. Railway, a DigitalOcean Droplet, Render (with a disk), or your own VPS. Serverless platforms (Vercel/Netlify) are **not** compatible because they have no persistent filesystem.

On the server:

```bash
npm install
npm run build
npm run db:push
npm run db:wal                                   # enable WAL (durability/concurrency)
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed
npm start
```

### Data persistence

Your data lives in the SQLite file `prisma/dev.db`. It **persists across server
restarts and crashes** — stopping/starting the app does not clear it. The only
ways to lose data are: deleting the DB file, running `prisma migrate reset`, or
deploying on a host with no persistent disk. (Re-running `db:seed` will reset the
original 16 seed products to their seed values, but won't touch orders or any
products/categories you added — avoid re-seeding a live store.)

### Backups

`npm run db:backup` creates a timestamped snapshot under `backups/` containing a
consistent copy of the database (via SQLite `VACUUM INTO`, safe to run while the
app is live) plus the `public/uploads/` folder. The latest 14 are kept
(override with `BACKUP_KEEP`).

Schedule it nightly with cron on your server:

```cron
# 2:00 AM daily — adjust the path to your app
0 2 * * * cd /path/to/diamond-loft && /usr/bin/npm run db:backup >> /var/log/diamondloft-backup.log 2>&1
```

To restore: stop the app, copy the chosen backup's `dev.db` to `prisma/dev.db`
and its `uploads/` to `public/uploads/`, then start the app. For off-site safety,
sync the `backups/` folder to remote storage (e.g. `rsync`/`rclone`).

## Project Structure

```
app/
  (store)/        Storefront route group (home, shop, category, product, wishlist, info pages)
  admin/          Admin CMS (dashboard, products, orders, categories, sections)
  api/            REST API routes (products, categories, orders, sections, upload, auth)
components/
  store/          Storefront components
  admin/          Admin components
context/          Cart + Wishlist React contexts
lib/              Prisma client, auth, data access, utils, upload
prisma/           Schema + seed
types/            Shared TypeScript types
```

> The original Vite/React source is archived in `src-backup/` for reference.
