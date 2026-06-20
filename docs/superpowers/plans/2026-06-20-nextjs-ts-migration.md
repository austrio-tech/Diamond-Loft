# Diamond Loft — Next.js 15 + TypeScript Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Diamond Loft jewellery store from a React 18 + Vite SPA to a full-stack Next.js 15 App Router application with TypeScript, Prisma + SQLite backend, local image storage, NextAuth.js admin authentication, and a CMS-style admin panel — with zero third-party services required.

**Architecture:** Next.js 15 App Router with route groups — `(store)` for the public storefront and `admin` for the CMS. Server Components fetch data directly from Prisma; Client Components handle interactivity (cart, filters, forms). API routes serve as the REST backend consumed by admin forms and the checkout flow. SQLite database lives as a single file (`prisma/dev.db`) inside the project. Images are uploaded to `public/uploads/` and served directly by Next.js.

**Tech Stack:** Next.js 15, TypeScript, Prisma + SQLite, NextAuth.js v5 (Auth.js), Lucide React, CSS Modules, bcryptjs.

**Hosting requirement:** Must deploy on a VPS with a persistent disk (Railway, DigitalOcean Droplet, Render with disk, or your own server). Vercel/Netlify serverless platforms do NOT support SQLite or local file uploads.

## Global Constraints

- Next.js 15.x, React 19, TypeScript strict mode
- App Router only — no Pages Router
- CSS Modules (`.module.css`) for all component styles — no Tailwind
- All prices in PKR (`number`), displayed with `.toLocaleString()`
- Preserve all existing design tokens (`--gold`, `--cream`, `--charcoal`, etc.)
- No `any` types — use `unknown` with type guards where needed
- Admin routes protected by middleware — redirect to `/admin/login` if unauthenticated
- Uploaded images stored in `public/uploads/` and served at `/uploads/<filename>`; seed data uses Unsplash URLs (`next/image` remotePatterns for `images.unsplash.com` only)
- `package.json` name: `"diamond-loft"`

---

## File Map

```
diamond-loft/
├── app/
│   ├── (store)/
│   │   ├── layout.tsx                  # Store shell: Navbar + Footer + CartDrawer + WhatsAppButton
│   │   ├── page.tsx                    # Home (SC)
│   │   ├── shop/page.tsx               # Shop with filter/sort via searchParams (SC shell + CC filters)
│   │   ├── category/[slug]/page.tsx    # Category page (SC)
│   │   ├── product/[id]/page.tsx       # Product detail (SC shell + CC interactions)
│   │   └── wishlist/page.tsx           # Wishlist page (CC — reads WishlistContext)
│   ├── admin/
│   │   ├── layout.tsx                  # Admin shell: auth check + AdminSidebar
│   │   ├── page.tsx                    # Dashboard (SC)
│   │   ├── login/page.tsx              # Login form (CC)
│   │   ├── products/
│   │   │   ├── page.tsx                # Products list (SC)
│   │   │   ├── new/page.tsx            # New product (CC form)
│   │   │   └── [id]/page.tsx           # Edit product (SC fetches, CC form)
│   │   ├── categories/
│   │   │   ├── page.tsx                # Categories list (SC)
│   │   │   └── [id]/page.tsx           # Edit category (SC fetches, CC form)
│   │   ├── orders/page.tsx             # Orders list (SC)
│   │   └── sections/page.tsx           # Homepage sections CMS (SC fetches, CC editor)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── products/
│   │   │   ├── route.ts                # GET list, POST create
│   │   │   └── [id]/route.ts           # GET one, PUT update, DELETE archive
│   │   ├── categories/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts                # GET list (admin), POST create (public)
│   │   │   └── [id]/route.ts           # PUT update status (admin)
│   │   ├── sections/route.ts           # GET all, PUT batch update
│   │   └── upload/route.ts             # POST image → saves to public/uploads/
│   ├── error.tsx                       # Route-level error boundary (CC)
│   ├── global-error.tsx                # Root error boundary (CC)
│   ├── not-found.tsx                   # 404 page
│   ├── globals.css                     # Design tokens + resets (migrated from index.css)
│   └── layout.tsx                      # Root layout: fonts + CartProvider + WishlistProvider
├── components/
│   ├── store/
│   │   ├── Navbar.tsx + .module.css    # CC — uses useCart, usePathname
│   │   ├── Footer.tsx + .module.css    # SC
│   │   ├── Hero.tsx + .module.css      # SC (config from Section DB row)
│   │   ├── Marquee.tsx + .module.css   # SC
│   │   ├── CategoryGrid.tsx + .module.css  # SC
│   │   ├── FeaturedProducts.tsx + .module.css  # SC
│   │   ├── TrustBar.tsx + .module.css  # SC
│   │   ├── Testimonials.tsx + .module.css  # SC
│   │   ├── ProductCard.tsx + .module.css    # CC — uses useCart, useWishlist
│   │   ├── CartDrawer.tsx + .module.css     # CC
│   │   ├── WhatsAppButton.tsx + .module.css # SC
│   │   └── DiamondLoftLogo.tsx         # SC (pure SVG)
│   └── admin/
│       ├── AdminSidebar.tsx + .module.css   # CC
│       ├── ProductForm.tsx + .module.css    # CC
│       ├── ProductTable.tsx + .module.css   # CC
│       ├── CategoryForm.tsx                 # CC
│       ├── OrdersTable.tsx                  # CC
│       ├── SectionsManager.tsx              # CC
│       └── ImageUpload.tsx                  # CC
├── context/
│   ├── CartContext.tsx                 # CC — useReducer + localStorage
│   └── WishlistContext.tsx             # CC — Set<number> + localStorage
├── lib/
│   ├── prisma.ts                       # Prisma singleton
│   ├── auth.ts                         # NextAuth config
│   ├── upload.ts                       # Local file save to public/uploads/
│   ├── adminAuth.ts                    # requireAdmin() helper
│   └── utils.ts                        # formatPrice, slugify, calcDiscount, sanitizeWANumber
├── types/
│   └── index.ts                        # All shared interfaces
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── uploads/                        # Runtime image uploads (gitignored, created on first upload)
├── middleware.ts                        # Protects /admin/* routes
├── next.config.ts
├── tsconfig.json
└── .env.example
```

---

## Phase 1 — Project Scaffold & Configuration

### Task 1: Bootstrap Next.js Project

**Files:**
- Create: `next.config.ts`
- Create: `tsconfig.json` (auto-generated, verify settings)
- Create: `.env.example`
- Create: `.env.local` (gitignored, fill with real values)
- Modify: `package.json`

- [ ] **Step 1: Create the Next.js project**

```bash
npx create-next-app@latest diamond-loft \
  --typescript \
  --eslint \
  --app \
  --no-tailwind \
  --no-src-dir \
  --import-alias "@/*"
cd diamond-loft
```

- [ ] **Step 2: Install all dependencies**

```bash
npm install @prisma/client next-auth@beta bcryptjs lucide-react
npm install -D prisma @types/bcryptjs
```

- [ ] **Step 3: Write `next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Write `.env.example`**

```
# SQLite — file lives inside the project, no external service needed
DATABASE_URL="file:./dev.db"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

- [ ] **Step 5: Update `package.json` name and add seed script**

```json
{
  "name": "diamond-loft",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  }
}
```

- [ ] **Step 6: Install tsx for seed script**

```bash
npm install -D tsx
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore: scaffold Next.js 15 project with TypeScript"
```

---

### Task 2: TypeScript Types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Write `types/index.ts`**

```typescript
// ── Primitives ────────────────────────────────────────────────
export type BadgeType = "Sale" | "New" | "Bestseller" | "Premium";
export type SortOption = "featured" | "price-asc" | "price-desc" | "rating";
export type PaymentMethod = "bank" | "mobile";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

// ── Store entities ─────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  accent: string;
  sortOrder: number;
  _count?: { products: number };
}

export interface Product {
  id: number;
  categoryId: string;
  category?: Category;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  badge: BadgeType | null;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  archived: boolean;
  description: string;
  material: string;
  weight: string;
  size: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ── Cart ───────────────────────────────────────────────────────
export interface CartItem extends Omit<Product, "createdAt" | "updatedAt"> {
  qty: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: "ADD"; product: Product; qty: number }
  | { type: "REMOVE"; id: number }
  | { type: "UPDATE"; id: number; qty: number }
  | { type: "CLEAR" }
  | { type: "SET_OPEN"; open: boolean }
  | { type: "HYDRATE"; items: CartItem[] };

// ── Orders ────────────────────────────────────────────────────
export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  total: number;
  payMethod: PaymentMethod;
  status: OrderStatus;
  notes: string | null;
  createdAt: string;
}

export interface CreateOrderPayload {
  name: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  total: number;
  payMethod: PaymentMethod;
}

export interface CreateOrderResponse {
  order: Order;
  whatsappUrl: string;
}

// ── Homepage Sections ─────────────────────────────────────────
export interface HeroConfig {
  label: string;
  tagline: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  bgImage: string;
}

export interface MarqueeConfig {
  items: string[];
}

export interface FeaturedConfig {
  label: string;
  title: string;
}

export interface TrustPerk {
  icon: string; // lucide icon name
  title: string;
  desc: string;
}

export interface TrustConfig {
  perks: TrustPerk[];
}

export interface TestimonialEntry {
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
  avatar: string;
}

export interface TestimonialsConfig {
  label: string;
  title: string;
  reviews: TestimonialEntry[];
}

export type SectionConfig =
  | HeroConfig
  | MarqueeConfig
  | FeaturedConfig
  | TrustConfig
  | TestimonialsConfig;

export type SectionType = "hero" | "marquee" | "featured" | "trust" | "testimonials";

export interface Section {
  id: string;
  type: SectionType;
  enabled: boolean;
  sortOrder: number;
  config: SectionConfig;
}

// ── Store Info ────────────────────────────────────────────────
export interface StoreInfo {
  name: string;
  tagline: string;
  description: string;
  whatsapp: string;
  whatsappClean: string; // digits only, e.g. "923225578305"
  email: string;
  instagram: string;
  facebook: string;
  pinterest: string;
}

// ── API helpers ───────────────────────────────────────────────
export interface ApiError {
  error: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add types/
git commit -m "feat: add shared TypeScript types"
```

---

### Task 3: Shared Utilities

**Files:**
- Create: `lib/utils.ts`
- Create: `lib/prisma.ts`
- Create: `lib/upload.ts`
- Create: `lib/adminAuth.ts`

- [ ] **Step 1: Write `lib/utils.ts`**

```typescript
import type { StoreInfo } from "@/types";

export const STORE_INFO: StoreInfo = {
  name: "Diamond Loft",
  tagline: "Elegance Crafted for You",
  description: "Handcrafted fine jewellery — earrings, pendants, bracelets & ear tops.",
  whatsapp: "+923225578305",
  whatsappClean: "923225578305",
  email: "diamondloft.pk@gmail.com",
  instagram: "https://instagram.com/diamondloftpk",
  facebook: "https://facebook.com/diamondloftpk",
  pinterest: "https://pinterest.com/diamondloftpk",
};

export function calcDiscount(price: number, originalPrice: number | null): number | null {
  if (!originalPrice) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function formatPrice(amount: number): string {
  return `PKR ${amount.toLocaleString()}`;
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function buildWhatsAppOrderUrl(
  phone: string,
  message: string
): string {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function buildOrderWhatsAppMessage(order: {
  name: string;
  phone: string;
  address: string;
  city: string;
  items: Array<{ name: string; qty: number; price: number }>;
  total: number;
  payMethod: string;
}): string {
  const itemLines = order.items
    .map((i) => `• ${i.name} × ${i.qty} — PKR ${(i.price * i.qty).toLocaleString()}`)
    .join("\n");

  const payLabel = order.payMethod === "bank" ? "Bank Transfer" : "JazzCash / EasyPaisa";

  return `🛍️ New Order — Diamond Loft

Customer: ${order.name}
Phone: ${order.phone}
Address: ${order.address}, ${order.city}

Items:
${itemLines}

Total: PKR ${order.total.toLocaleString()}
Payment: ${payLabel}

Please confirm this order.`;
}

export function validatePakistaniPhone(phone: string): boolean {
  return /^03[0-9]{2}-?[0-9]{7}$/.test(phone.trim());
}

export function badgeSlug(badge: string): string {
  return badge.toLowerCase().replace(/\s+/g, "-");
}
```

- [ ] **Step 2: Write `lib/prisma.ts`**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 3: Write `lib/upload.ts`**

```typescript
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function saveUpload(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}
```

- [ ] **Step 4: Write `lib/adminAuth.ts`**

```typescript
import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function requireAdmin(): Promise<ReturnType<typeof auth>> {
  const session = await auth();
  if (!session) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}
```

Usage in a route handler:
```typescript
export async function PUT(req: Request) {
  try {
    await requireAdmin();
    // ... handler logic
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/ 
git commit -m "feat: add prisma singleton, local upload util, utils, adminAuth helper"
```

---

## Phase 2 — Database

### Task 4: Prisma Schema & Seed

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`

- [ ] **Step 1: Write `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Product {
  id            Int       @id @default(autoincrement())
  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  name          String
  price         Float
  originalPrice Float?
  image         String
  images        String    @default("[]")  // JSON array stored as string — SQLite has no native array type
  badge         String?
  rating        Float     @default(0)
  reviews       Int       @default(0)
  inStock       Boolean   @default(true)
  featured      Boolean   @default(false)
  archived      Boolean   @default(false)
  description   String
  material      String
  weight        String
  size          String
  sortOrder     Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([categoryId])
  @@index([featured])
  @@index([archived])
}

model Category {
  id          String    @id
  name        String
  slug        String    @unique
  description String
  image       String
  accent      String    @default("#c9a96e")
  sortOrder   Int       @default(0)
  products    Product[]

  @@index([slug])
}

model Order {
  id        Int      @id @default(autoincrement())
  name      String
  phone     String
  address   String
  city      String
  items     Json
  total     Float
  payMethod String
  status    String   @default("pending")
  notes     String?
  createdAt DateTime @default(now())

  @@index([status])
  @@index([createdAt])
}

model Section {
  id        String  @id
  type      String
  enabled   Boolean @default(true)
  sortOrder Int     @default(0)
  config    Json
}

model AdminUser {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

- [ ] **Step 2: Write `prisma/seed.ts`**

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Categories
  await prisma.category.upsert({
    where: { id: "earrings" },
    update: {},
    create: {
      id: "earrings", name: "Earrings", slug: "earrings",
      description: "Statement drops, hoops & studs for every occasion.",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
      accent: "#c9a96e", sortOrder: 0,
    },
  });
  await prisma.category.upsert({
    where: { id: "pendants" },
    update: {},
    create: {
      id: "pendants", name: "Pendants", slug: "pendants",
      description: "Delicate charms and bold statement necklaces.",
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80",
      accent: "#b5838d", sortOrder: 1,
    },
  });
  await prisma.category.upsert({
    where: { id: "bracelets" },
    update: {},
    create: {
      id: "bracelets", name: "Bracelets", slug: "bracelets",
      description: "Stack them up or wear solo — pure elegance.",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
      accent: "#6d6875", sortOrder: 2,
    },
  });
  await prisma.category.upsert({
    where: { id: "ear-tops" },
    update: {},
    create: {
      id: "ear-tops", name: "Ear Tops", slug: "ear-tops",
      description: "Minimalist studs that speak volumes.",
      image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
      accent: "#a8927a", sortOrder: 3,
    },
  });

  // Products (upsert by name to avoid duplicates on re-seed)
  const products = [
    { categoryId: "earrings", name: "Golden Cascade Drop Earrings", price: 2499, originalPrice: 3200, image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80", images: ["https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"], badge: "Sale", rating: 4.8, reviews: 124, inStock: true, featured: true, description: "Handcrafted 18k gold-plated cascade drops that catch the light beautifully. Lightweight and comfortable for all-day wear.", material: "18K Gold Plated Brass", weight: "6g", size: "6 cm drop", sortOrder: 0 },
    { categoryId: "earrings", name: "Pearl Halo Hoops", price: 1899, originalPrice: null, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=80", images: ["https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80"], badge: "New", rating: 4.6, reviews: 58, inStock: true, featured: true, description: "Classic pearl-encrusted hoops with a modern twist — the perfect everyday luxury.", material: "Sterling Silver, Freshwater Pearls", weight: "5g", size: "3 cm diameter", sortOrder: 1 },
    { categoryId: "earrings", name: "Rose Quartz Dangle Earrings", price: 1599, originalPrice: null, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80", images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"], badge: null, rating: 4.7, reviews: 89, inStock: true, featured: false, description: "Natural rose quartz paired with gold-fill findings. Each stone is unique.", material: "Gold-Fill, Natural Rose Quartz", weight: "4g", size: "5 cm drop", sortOrder: 2 },
    { categoryId: "earrings", name: "Celestial Star Drops", price: 2199, originalPrice: 2800, image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80", images: ["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80"], badge: "Sale", rating: 4.9, reviews: 201, inStock: true, featured: false, description: "CZ-studded star motif drops that bring a night-sky vibe to any outfit.", material: "925 Sterling Silver, Cubic Zirconia", weight: "7g", size: "4.5 cm drop", sortOrder: 3 },
    { categoryId: "pendants", name: "Crescent Moon Pendant", price: 1799, originalPrice: null, image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&q=80", images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80"], badge: "Bestseller", rating: 4.9, reviews: 312, inStock: true, featured: true, description: 'A dainty crescent moon on a 16" gold chain. Minimalist and timeless.', material: "18K Gold Plated 925 Silver", weight: "3g", size: '1.5 cm charm, 16" chain', sortOrder: 0 },
    { categoryId: "pendants", name: "Solitaire Diamond Pendant", price: 5999, originalPrice: null, image: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=500&q=80", images: ["https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=800&q=80"], badge: "Premium", rating: 5.0, reviews: 45, inStock: true, featured: true, description: "A 0.25ct lab-grown diamond solitaire set in 18k white gold. Arrives gift-boxed.", material: "18K White Gold, Lab Diamond", weight: "2.5g", size: '0.8 cm pendant, 18" chain', sortOrder: 1 },
    { categoryId: "pendants", name: "Floral Enamel Locket", price: 2299, originalPrice: 2800, image: "https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=500&q=80", images: ["https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=800&q=80"], badge: "Sale", rating: 4.5, reviews: 67, inStock: true, featured: false, description: "Vintage-inspired enamel locket with a secret compartment. Holds two photos.", material: "Gold Plated Brass, Enamel", weight: "8g", size: '2 cm locket, 18" chain', sortOrder: 2 },
    { categoryId: "pendants", name: "Heart Birthstone Pendant", price: 1999, originalPrice: null, image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80", images: ["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80"], badge: "New", rating: 4.7, reviews: 93, inStock: false, featured: false, description: "Personalized heart pendant set with your choice of birthstone. A perfect gift.", material: "Sterling Silver, Semi-precious Stone", weight: "4g", size: '1.8 cm pendant, 16" chain', sortOrder: 3 },
    { categoryId: "bracelets", name: "Gold Tennis Bracelet", price: 4999, originalPrice: 6500, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80", images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"], badge: "Sale", rating: 4.9, reviews: 178, inStock: true, featured: true, description: "Classic CZ tennis bracelet in 18k gold plating. Secure lobster clasp, 18cm.", material: "18K Gold Plated Brass, CZ", weight: "12g", size: "18 cm (adjustable)", sortOrder: 0 },
    { categoryId: "bracelets", name: "Charm & Pearl Stack Set", price: 2799, originalPrice: null, image: "https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=500&q=80", images: ["https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=800&q=80"], badge: "New", rating: 4.6, reviews: 54, inStock: true, featured: true, description: "Set of 3 stackable bracelets — pearl strand, gold chain, and CZ charm band.", material: "Sterling Silver, Freshwater Pearls", weight: "10g", size: "17–20 cm (adjustable)", sortOrder: 1 },
    { categoryId: "bracelets", name: "Delicate Infinity Bangle", price: 1499, originalPrice: null, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80", images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"], badge: null, rating: 4.5, reviews: 112, inStock: true, featured: false, description: "A sleek open bangle with an infinity symbol — wear alone or layered.", material: "925 Sterling Silver", weight: "5g", size: "6 cm inner diameter (open)", sortOrder: 2 },
    { categoryId: "bracelets", name: "Evil Eye Beaded Bracelet", price: 999, originalPrice: null, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=80", images: ["https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80"], badge: "Bestseller", rating: 4.8, reviews: 287, inStock: true, featured: false, description: "Handstrung blue evil eye and crystal bead bracelet. Adjustable cord closure.", material: "Glass Beads, Crystal, Cord", weight: "6g", size: "Adjustable 15–20 cm", sortOrder: 3 },
    { categoryId: "ear-tops", name: "Classic Diamond Studs", price: 3499, originalPrice: null, image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80", images: ["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80"], badge: "Bestseller", rating: 5.0, reviews: 432, inStock: true, featured: true, description: "0.5ct each lab-grown diamond studs in platinum-plated silver. Timeless everyday studs.", material: "Platinum Plated Silver, Lab Diamond", weight: "1.5g per stud", size: "5 mm", sortOrder: 0 },
    { categoryId: "ear-tops", name: "Pearl & Gold Studs", price: 1299, originalPrice: null, image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80", images: ["https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80"], badge: "New", rating: 4.7, reviews: 76, inStock: true, featured: true, description: "Lustrous 7mm freshwater pearl studs in 18k gold. A wardrobe staple.", material: "18K Gold, Freshwater Pearl", weight: "1g per stud", size: "7 mm pearl", sortOrder: 1 },
    { categoryId: "ear-tops", name: "Tiny Heart Studs", price: 799, originalPrice: 1200, image: "https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=500&q=80", images: ["https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=800&q=80"], badge: "Sale", rating: 4.6, reviews: 198, inStock: true, featured: false, description: "Mini heart studs with a brushed gold finish. Cute and understated.", material: "18K Gold Plated 925 Silver", weight: "0.8g per stud", size: "6 mm", sortOrder: 2 },
    { categoryId: "ear-tops", name: "Moonstone Cabochon Studs", price: 1799, originalPrice: null, image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80", images: ["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80"], badge: null, rating: 4.8, reviews: 143, inStock: true, featured: false, description: "Adularescent moonstone cabochons set in a bezel of sterling silver. Ethereal glow.", material: "925 Sterling Silver, Natural Moonstone", weight: "1.5g per stud", size: "8 mm", sortOrder: 3 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(p) + 1 },
      update: {},
      create: p,
    });
  }

  // Default sections
  await prisma.section.upsert({
    where: { id: "hero" },
    update: {},
    create: {
      id: "hero", type: "hero", enabled: true, sortOrder: 0,
      config: {
        label: "New Collection 2025",
        tagline: "Elegance Crafted for You",
        subtitle: "Discover handcrafted jewellery — earrings, pendants, bracelets & ear tops designed to make every moment shine.",
        primaryCtaText: "Shop Now",
        primaryCtaHref: "/shop",
        secondaryCtaText: "Explore Earrings",
        secondaryCtaHref: "/category/earrings",
        bgImage: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=85",
      },
    },
  });

  await prisma.section.upsert({
    where: { id: "marquee" },
    update: {},
    create: {
      id: "marquee", type: "marquee", enabled: true, sortOrder: 1,
      config: {
        items: [
          "Free Shipping on orders above PKR 3,000",
          "Handcrafted with Love",
          "30-Day Easy Returns",
          "Authentic Gemstones & Metals",
          "Gift Wrapping Available",
          "New Arrivals Every Week",
        ],
      },
    },
  });

  await prisma.section.upsert({
    where: { id: "featured" },
    update: {},
    create: {
      id: "featured", type: "featured", enabled: true, sortOrder: 2,
      config: { label: "Handpicked for You", title: "Featured Pieces" },
    },
  });

  await prisma.section.upsert({
    where: { id: "trust" },
    update: {},
    create: {
      id: "trust", type: "trust", enabled: true, sortOrder: 3,
      config: {
        perks: [
          { icon: "Truck", title: "Free Shipping", desc: "On orders above PKR 3,000" },
          { icon: "RefreshCw", title: "Easy Returns", desc: "30-day hassle-free returns" },
          { icon: "Shield", title: "100% Authentic", desc: "Genuine gemstones & metals" },
          { icon: "Gift", title: "Gift Wrapping", desc: "Complimentary on every order" },
        ],
      },
    },
  });

  await prisma.section.upsert({
    where: { id: "testimonials" },
    update: {},
    create: {
      id: "testimonials", type: "testimonials", enabled: true, sortOrder: 4,
      config: {
        label: "Happy Customers",
        title: "What Our Customers Say",
        reviews: [
          { name: "Ayesha R.", location: "Lahore", rating: 5, text: "Absolutely stunning earrings! The quality is way better than I expected. Will definitely order again.", product: "Golden Cascade Drop Earrings", avatar: "A" },
          { name: "Sara M.", location: "Karachi", rating: 5, text: "The Crescent Moon Pendant is exactly what I wanted. Delicate, beautiful, and arrived perfectly packaged.", product: "Crescent Moon Pendant", avatar: "S" },
          { name: "Hira K.", location: "Islamabad", rating: 5, text: "Gifted the pearl studs to my sister and she was over the moon! Fast delivery, gorgeous piece.", product: "Pearl & Gold Studs", avatar: "H" },
        ],
      },
    },
  });

  // Admin user
  const passwordHash = await bcrypt.hash("changeme123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@diamondloft.pk" },
    update: {},
    create: { email: "admin@diamondloft.pk", password: passwordHash },
  });

  console.log("✓ Seed complete. Admin login: admin@diamondloft.pk / changeme123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 3: Push schema and seed**

```bash
npx prisma db push
npm run db:seed
```

Expected output: `✓ Seed complete. Admin login: admin@diamondloft.pk / changeme123`

- [ ] **Step 4: Commit**

```bash
git add prisma/
git commit -m "feat: add Prisma schema and seed data"
```

---

## Phase 3 — Authentication

### Task 5: NextAuth.js v5 Setup

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts`

- [ ] **Step 1: Write `lib/auth.ts`**

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return { id: String(user.id), email: user.email };
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
```

- [ ] **Step 2: Write `app/api/auth/[...nextauth]/route.ts`**

```typescript
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

- [ ] **Step 3: Write `middleware.ts`**

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: unknown }) => {
  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (isAdminPath && !isLoginPage && !req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
});

export const config = { matcher: ["/admin/:path*"] };
```

- [ ] **Step 4: Commit**

```bash
git add lib/auth.ts app/api/auth/ middleware.ts
git commit -m "feat: add NextAuth.js v5 admin authentication"
```

---

## Phase 4 — API Routes

### Task 6: Products & Categories API

**Files:**
- Create: `app/api/products/route.ts`
- Create: `app/api/products/[id]/route.ts`
- Create: `app/api/categories/route.ts`
- Create: `app/api/categories/[id]/route.ts`

- [ ] **Step 1: Write `app/api/products/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const q = searchParams.get("q");
  const archived = searchParams.get("archived") === "true";

  const products = await prisma.product.findMany({
    where: {
      archived,
      ...(category ? { categoryId: category } : {}),
      ...(featured === "true" ? { featured: true } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { categoryId, name, price, description, material, weight, size, image, images = [] } = body;

    if (!categoryId || !name || !price || !description || !material || !weight || !size || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        categoryId, name, price: Number(price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        image, images,
        badge: body.badge || null,
        rating: 0, reviews: 0,
        inStock: body.inStock ?? true,
        featured: body.featured ?? false,
        description, material, weight, size,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Write `app/api/products/[id]/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...body,
        price: body.price !== undefined ? Number(body.price) : undefined,
        originalPrice: body.originalPrice !== undefined
          ? (body.originalPrice ? Number(body.originalPrice) : null)
          : undefined,
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.product.update({
      where: { id: Number(id) },
      data: { archived: true },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Write `app/api/categories/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: { where: { archived: false } } } } },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, name, slug, description, image, accent } = body;
    if (!id || !name || !slug || !description || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const category = await prisma.category.create({
      data: { id, name, slug, description, image, accent: accent || "#c9a96e" },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Write `app/api/categories/[id]/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const category = await prisma.category.update({ where: { id }, data: body });
    return NextResponse.json(category);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add app/api/products/ app/api/categories/
git commit -m "feat: add products and categories API routes"
```

---

### Task 7: Orders, Sections & Upload API

**Files:**
- Create: `app/api/orders/route.ts`
- Create: `app/api/orders/[id]/route.ts`
- Create: `app/api/sections/route.ts`
- Create: `app/api/upload/route.ts`

- [ ] **Step 1: Write `app/api/orders/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { buildOrderWhatsAppMessage, buildWhatsAppOrderUrl, validatePakistaniPhone, STORE_INFO } from "@/lib/utils";
import type { CreateOrderPayload } from "@/types";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const orders = await prisma.order.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body: CreateOrderPayload = await req.json();
  const { name, phone, address, city, items, total, payMethod } = body;

  if (!name || !phone || !address || !city || !items?.length || !total || !payMethod) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!validatePakistaniPhone(phone)) {
    return NextResponse.json({ error: "Invalid phone number format (03XX-XXXXXXX)" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: { name, phone, address, city, items, total, payMethod, status: "pending" },
  });

  const message = buildOrderWhatsAppMessage({ name, phone, address, city, items, total, payMethod });
  const whatsappUrl = buildWhatsAppOrderUrl(STORE_INFO.whatsapp, message);

  return NextResponse.json({ order, whatsappUrl }, { status: 201 });
}
```

- [ ] **Step 2: Write `app/api/orders/[id]/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { status } = await req.json();
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });
    return NextResponse.json(order);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Write `app/api/sections/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const sections = await prisma.section.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(sections);
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const sections = await req.json();
    await Promise.all(
      sections.map((s: { id: string; enabled: boolean; sortOrder: number; config: unknown }) =>
        prisma.section.update({
          where: { id: s.id },
          data: { enabled: s.enabled, sortOrder: s.sortOrder, config: s.config },
        })
      )
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Write `app/api/upload/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/upload";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const url = await saveUpload(file);
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add app/api/orders/ app/api/sections/ app/api/upload/
git commit -m "feat: add orders, sections, and upload API routes"
```

---

## Phase 5 — Store Frontend

### Task 8: Root Layout, Globals & Context

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `context/CartContext.tsx`
- Create: `context/WishlistContext.tsx`

- [ ] **Step 1: Write `app/globals.css`** (design tokens only — fonts now handled by next/font)

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --gold: #c9a96e;
  --gold-light: #e8d5b0;
  --gold-dark: #a0793d;
  --cream: #faf7f2;
  --charcoal: #2c2c2c;
  --muted: #7a7065;
  --soft: #f3ede4;
  --white: #ffffff;
  --border: #e8e0d4;
  --shadow: 0 4px 24px rgba(44,44,44,0.08);
  --shadow-hover: 0 12px 40px rgba(44,44,44,0.16);
  --radius: 12px;
  --max-width: 1380px;
}

html { scroll-behavior: smooth; }
body {
  background: var(--cream);
  color: var(--charcoal);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
#root, body { width: 100%; }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }
ul { list-style: none; }

.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--cream); }
::-webkit-scrollbar-thumb { background: var(--gold-light); border-radius: 3px; }

.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

- [ ] **Step 2: Write `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { STORE_INFO } from "@/lib/utils";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: STORE_INFO.name, template: `%s | ${STORE_INFO.name}` },
  description: STORE_INFO.description,
  openGraph: {
    siteName: STORE_INFO.name,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body style={{ fontFamily: "var(--font-sans)" }}>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Write `context/CartContext.tsx`**

```tsx
"use client";
import { createContext, useContext, useReducer, useEffect, useState } from "react";
import type { CartItem, CartState, CartAction, Product } from "@/types";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items };
    case "ADD": {
      const idx = state.items.findIndex((i) => i.id === action.product.id);
      const items = idx !== -1
        ? state.items.map((i, n) => n === idx ? { ...i, qty: i.qty + action.qty } : i)
        : [...state.items, { ...action.product, qty: action.qty }];
      return { ...state, items, isOpen: true };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "UPDATE":
      return { ...state, items: state.items.map((i) => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i) };
    case "CLEAR":
      return { ...state, items: [] };
    case "SET_OPEN":
      return { ...state, isOpen: action.open };
    default:
      return state;
  }
}

const CartContext = createContext<{
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false });
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dl-cart");
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) });
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("dl-cart", JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      addToCart: (product, qty = 1) => dispatch({ type: "ADD", product, qty }),
      removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
      updateQty: (id, qty) => dispatch({ type: "UPDATE", id, qty }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      openCart: () => dispatch({ type: "SET_OPEN", open: true }),
      closeCart: () => dispatch({ type: "SET_OPEN", open: false }),
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
```

- [ ] **Step 4: Write `context/WishlistContext.tsx`**

```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext<{
  ids: Set<number>;
  toggle: (id: number) => void;
  has: (id: number) => boolean;
} | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dl-wishlist");
      if (saved) setIds(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("dl-wishlist", JSON.stringify([...ids]));
  }, [ids]);

  const toggle = (id: number) =>
    setIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <WishlistContext.Provider value={{ ids, toggle, has: (id) => ids.has(id) }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
```

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css context/
git commit -m "feat: root layout with next/font, CartContext and WishlistContext with localStorage"
```

---

### Task 9: Store Layout & Shared Components

**Files:**
- Create: `app/(store)/layout.tsx`
- Create: `components/store/DiamondLoftLogo.tsx`
- Create: `components/store/Navbar.tsx` + `Navbar.module.css`
- Create: `components/store/Footer.tsx` + `Footer.module.css`
- Create: `components/store/WhatsAppButton.tsx` + `WhatsAppButton.module.css`
- Create: `components/store/CartDrawer.tsx` + `CartDrawer.module.css`

- [ ] **Step 1: Write `app/(store)/layout.tsx`**

```tsx
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import CartDrawerWrapper from "@/components/store/CartDrawerWrapper";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartDrawerWrapper />
    </>
  );
}
```

Note: `CartDrawerWrapper` is a thin CC that reads `useCart().isOpen` and conditionally renders `<CartDrawer />`. This keeps the layout itself a SC.

```tsx
// components/store/CartDrawerWrapper.tsx
"use client";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function CartDrawerWrapper() {
  const { isOpen, closeCart } = useCart();
  if (!isOpen) return null;
  return <CartDrawer onClose={closeCart} />;
}
```

- [ ] **Step 2: Migrate `DiamondLoftLogo.tsx`** — copy existing SVG, add TypeScript props:

```tsx
interface Props { width?: number; className?: string; light?: boolean; }
export default function DiamondLoftLogo({ width = 160, className = "", light = false }: Props) { ... }
```

- [ ] **Step 3: Migrate `Navbar.tsx`** — key changes from the original:
  - `"use client"` directive at top
  - `import Link from "next/link"` (not react-router)
  - `import { usePathname } from "next/navigation"` (not useLocation)
  - `import { useRouter } from "next/navigation"` for search: `router.push(\`/shop?q=${searchQuery}\`)`
  - All CSS classes: `import styles from "./Navbar.module.css"` then `className={styles.navbar}`
  - Search `onKeyDown` (Enter key): `router.push(\`/shop?q=${encodeURIComponent(searchQuery)}\`); setSearchOpen(false);`

- [ ] **Step 4: Migrate `Footer.tsx`** — Server Component (no "use client"):
  - `import Link from "next/link"`
  - CSS Modules
  - Import `STORE_INFO` from `@/lib/utils`

- [ ] **Step 5: Migrate `WhatsAppButton.tsx`** — Server Component, CSS Modules, `STORE_INFO` from utils

- [ ] **Step 6: Migrate `CartDrawer.tsx`** — key changes:
  - `"use client"` directive
  - On `handleOrder`: POST to `/api/orders`, then open the returned `whatsappUrl` in a new tab, THEN clear cart and show done step
  - Phone validation: check `validatePakistaniPhone(form.phone)` before allowing submit
  - CSS Modules
  
  ```tsx
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePakistaniPhone(form.phone)) {
      setError("Please enter a valid phone number (03XX-XXXXXXX)");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty })),
          total: totalPrice,
          payMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      window.open(data.whatsappUrl, "_blank");
      clearCart();
      setStep("done");
    } finally {
      setLoading(false);
    }
  };
  ```

- [ ] **Step 7: Commit**

```bash
git add app/\(store\)/ components/store/
git commit -m "feat: migrate store layout, Navbar, Footer, CartDrawer to Next.js"
```

---

### Task 10: Home Page Components

**Files:**
- Create: `app/(store)/page.tsx`
- Create: `components/store/Hero.tsx` + `Hero.module.css`
- Create: `components/store/Marquee.tsx` + `Marquee.module.css`
- Create: `components/store/CategoryGrid.tsx` + `CategoryGrid.module.css`
- Create: `components/store/FeaturedProducts.tsx` + `FeaturedProducts.module.css`
- Create: `components/store/ProductCard.tsx` + `ProductCard.module.css`
- Create: `components/store/TrustBar.tsx` + `TrustBar.module.css`
- Create: `components/store/Testimonials.tsx` + `Testimonials.module.css`

- [ ] **Step 1: Write `app/(store)/page.tsx`** (Server Component — fetches sections and products from DB)

```tsx
import { prisma } from "@/lib/prisma";
import Hero from "@/components/store/Hero";
import Marquee from "@/components/store/Marquee";
import CategoryGrid from "@/components/store/CategoryGrid";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import TrustBar from "@/components/store/TrustBar";
import Testimonials from "@/components/store/Testimonials";
import type { Section, HeroConfig, MarqueeConfig, FeaturedConfig, TrustConfig, TestimonialsConfig } from "@/types";
import type { Metadata } from "next";
import { STORE_INFO } from "@/lib/utils";

export const metadata: Metadata = {
  title: `${STORE_INFO.name} — ${STORE_INFO.tagline}`,
  description: STORE_INFO.description,
  openGraph: { title: STORE_INFO.name, description: STORE_INFO.description },
};

export default async function HomePage() {
  const [sections, categories, featuredProducts] = await Promise.all([
    prisma.section.findMany({ where: { enabled: true }, orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({ where: { featured: true, archived: false }, orderBy: { sortOrder: "asc" } }),
  ]);

  const get = <T,>(id: string) => sections.find((s) => s.id === id)?.config as T | undefined;

  return (
    <>
      {get<HeroConfig>("hero") && <Hero config={get<HeroConfig>("hero")!} />}
      {get<MarqueeConfig>("marquee") && <Marquee config={get<MarqueeConfig>("marquee")!} />}
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} config={get<FeaturedConfig>("featured")} />
      {get<TrustConfig>("trust") && <TrustBar config={get<TrustConfig>("trust")!} />}
      {get<TestimonialsConfig>("testimonials") && <Testimonials config={get<TestimonialsConfig>("testimonials")!} />}
    </>
  );
}
```

- [ ] **Step 2: Migrate `Hero.tsx`** — Server Component, accepts `config: HeroConfig` prop, `next/link` for buttons, `next/image` for background.

- [ ] **Step 3: Migrate `Marquee.tsx`** — Server Component, accepts `config: MarqueeConfig`.

- [ ] **Step 4: Migrate `CategoryGrid.tsx`** — Server Component, accepts `categories: Category[]`.

- [ ] **Step 5: Write `ProductCard.tsx`** — Client Component (needs `useCart`, `useWishlist`):

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { calcDiscount, formatPrice, badgeSlug } from "@/lib/utils";
import type { Product } from "@/types";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggle, has } = useWishlist();
  const wished = has(product.id);
  const discount = calcDiscount(product.price, product.originalPrice);

  return (
    <article className={styles.pcard}>
      <div className={styles.imgWrap}>
        <Link href={`/product/${product.id}`}>
          <Image src={product.image} alt={product.name} width={500} height={500} className={styles.img} />
        </Link>
        <div className={styles.badges}>
          {product.badge && (
            <span className={`${styles.badge} ${styles[`badge--${badgeSlug(product.badge)}`]}`}>
              {product.badge}
            </span>
          )}
          {discount && <span className={`${styles.badge} ${styles["badge--discount"]}`}>-{discount}%</span>}
        </div>
        <button
          className={`${styles.wish} ${wished ? styles["wish--active"] : ""}`}
          onClick={() => toggle(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>
        <div className={styles.hoverActions}>
          <Link href={`/product/${product.id}`} className={styles.quickView}>Quick View</Link>
          <button
            className={styles.quickAdd}
            disabled={!product.inStock}
            onClick={() => product.inStock && addToCart(product, 1)}
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.rating}>
          <Star size={12} fill="currentColor" className={styles.star} />
          <span>{product.rating}</span>
          <span className={styles.reviews}>({product.reviews})</span>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className={styles.original}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {!product.inStock && <span className={styles.oos}>Out of Stock</span>}
      </div>
    </article>
  );
}
```

- [ ] **Step 6: Migrate `FeaturedProducts.tsx`, `TrustBar.tsx`, `Testimonials.tsx`** — all Server Components, accept their respective config props.

- [ ] **Step 7: Commit**

```bash
git add app/\(store\)/page.tsx components/store/
git commit -m "feat: migrate home page and all store components to Next.js"
```

---

### Task 11: Shop, Category & Product Pages

**Files:**
- Create: `app/(store)/shop/page.tsx`
- Create: `app/(store)/category/[slug]/page.tsx`
- Create: `app/(store)/product/[id]/page.tsx`
- Create: `app/(store)/wishlist/page.tsx`
- Create: `app/not-found.tsx`
- Create: `app/error.tsx`

- [ ] **Step 1: Write `app/(store)/shop/page.tsx`**

```tsx
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import ShopFilters from "@/components/store/ShopFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Jewellery",
  description: "Browse all Diamond Loft jewellery — earrings, pendants, bracelets and ear tops.",
};

interface Props {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { category, sort, q } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        archived: false,
        ...(category ? { categoryId: category } : {}),
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      },
      orderBy: sort === "price-asc" ? { price: "asc" }
        : sort === "price-desc" ? { price: "desc" }
        : sort === "rating" ? { rating: "desc" }
        : { sortOrder: "asc" },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <ShopFilters categories={categories} activeCategory={category} sort={sort} q={q} />
      <div className="container">
        <div className="shop-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
```

`ShopFilters` is a CC that updates URL params via `useRouter().push()`.

- [ ] **Step 2: Write `app/(store)/category/[slug]/page.tsx`**

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductCard from "@/components/store/ProductCard";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    openGraph: { title: category.name, description: category.description, images: [category.image] },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { products: { where: { archived: false }, orderBy: { sortOrder: "asc" } } },
  });
  if (!category) notFound();

  return (
    <div>
      {/* banner, sidebar with all categories, product grid — same layout as original */}
      <div className="container">
        {category.products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write `app/(store)/product/[id]/page.tsx`**

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/store/ProductDetailClient";
import type { Metadata } from "next";
import { STORE_INFO } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [product.image] },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, relatedProducts] = await Promise.all([
    prisma.product.findUnique({ where: { id: Number(id), archived: false }, include: { category: true } }),
    prisma.product.findMany({ where: { archived: false }, take: 4 }), // filtered by categoryId after product loads
  ]);
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, archived: false },
    take: 4,
    orderBy: { sortOrder: "asc" },
  });

  return <ProductDetailClient product={product} related={related} storeWhatsApp={STORE_INFO.whatsapp} />;
}
```

`ProductDetailClient` is a CC handling image gallery, qty selector, add to cart, wishlist toggle, and WhatsApp enquiry button.

- [ ] **Step 4: Write `app/(store)/wishlist/page.tsx`**

```tsx
"use client";
import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";
import ProductCard from "@/components/store/ProductCard";
import type { Product } from "@/types";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (ids.size === 0) { setProducts([]); return; }
    // Fetch each product — in a real app, add GET /api/products?ids=1,2,3
    Promise.all([...ids].map((id) => fetch(`/api/products/${id}`).then((r) => r.json())))
      .then(setProducts);
  }, [ids]);

  if (ids.size === 0) return <div className="container" style={{ padding: "120px 24px", textAlign: "center" }}><p>Your wishlist is empty.</p></div>;

  return (
    <div className="container" style={{ padding: "60px 24px" }}>
      <h1>Your Wishlist</h1>
      <div className="shop-grid">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Write `app/error.tsx`**

```tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "120px 24px" }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", marginBottom: "16px" }}>Something went wrong</h2>
      <p style={{ color: "var(--muted)", marginBottom: "24px" }}>{error.message}</p>
      <button onClick={reset} style={{ color: "var(--gold-dark)", border: "1px solid var(--gold)", padding: "10px 24px", borderRadius: "8px" }}>
        Try again
      </button>
    </div>
  );
}
```

- [ ] **Step 6: Write `app/not-found.tsx`**

```tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "120px 24px" }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "48px", marginBottom: "16px" }}>Page not found</h2>
      <Link href="/" style={{ color: "var(--gold-dark)", fontSize: "15px" }}>← Go back home</Link>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add app/\(store\)/ app/not-found.tsx app/error.tsx
git commit -m "feat: migrate shop, category, product detail and wishlist pages"
```

---

## Phase 6 — Admin Panel

### Task 12: Admin Auth & Layout

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/layout.tsx`
- Create: `components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Write `app/admin/login/page.tsx`**

```tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import DiamondLoftLogo from "@/components/store/DiamondLoftLogo";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Invalid email or password"); return; }
    router.push("/admin");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <DiamondLoftLogo width={140} />
        <h1 className={styles.title}>Admin Sign In</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/admin/layout.tsx`**

```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import styles from "./admin.module.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Write `components/admin/AdminSidebar.tsx`**

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Tag, ShoppingCart, Layers, LogOut } from "lucide-react";
import styles from "./AdminSidebar.module.css";

const links = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/categories", label: "Categories", Icon: Tag },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/sections", label: "Sections", Icon: Layers },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Diamond Loft</div>
      <nav className={styles.nav}>
        {links.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.link} ${pathname === href ? styles["link--active"] : ""}`}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
      <button className={styles.signout} onClick={() => signOut({ callbackUrl: "/admin/login" })}>
        <LogOut size={16} /> Sign Out
      </button>
    </aside>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/ components/admin/AdminSidebar.tsx
git commit -m "feat: admin login page, layout, and sidebar"
```

---

### Task 13: Admin Dashboard & Products

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/products/page.tsx`
- Create: `app/admin/products/new/page.tsx`
- Create: `app/admin/products/[id]/page.tsx`
- Create: `components/admin/ProductTable.tsx`
- Create: `components/admin/ProductForm.tsx`
- Create: `components/admin/ImageUpload.tsx`

- [ ] **Step 1: Write `app/admin/page.tsx`** (Dashboard)

```tsx
import { prisma } from "@/lib/prisma";
import styles from "./dashboard.module.css";

export default async function AdminDashboard() {
  const [totalProducts, pendingOrders, totalOrders, totalCategories, recentOrders] = await Promise.all([
    prisma.product.count({ where: { archived: false } }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count(),
    prisma.category.count(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Dashboard</h1>
      <div className={styles.stats}>
        <StatCard label="Products" value={totalProducts} />
        <StatCard label="Pending Orders" value={pendingOrders} highlight />
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Categories" value={totalCategories} />
      </div>
      <h2 className={styles.subheading}>Recent Orders</h2>
      <table className={styles.table}>
        <thead><tr><th>ID</th><th>Customer</th><th>City</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {recentOrders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.name}</td>
              <td>{o.city}</td>
              <td>PKR {o.total.toLocaleString()}</td>
              <td><span className={styles[`status--${o.status}`]}>{o.status}</span></td>
              <td>{new Date(o.createdAt).toLocaleDateString("en-PK")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`${styles.statCard} ${highlight ? styles["statCard--highlight"] : ""}`}>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/admin/ImageUpload.tsx`**

```tsx
"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import styles from "./ImageUpload.module.css";

interface Props { images: string[]; onChange: (urls: string[]) => void; }

export default function ImageUpload({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const { url } = await res.json();
      onChange([...images, url]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.thumbs}>
        {images.map((url, i) => (
          <div key={i} className={styles.thumb}>
            <Image src={url} alt={`Image ${i + 1}`} width={80} height={80} className={styles.thumbImg} />
            <button type="button" className={styles.remove} onClick={() => onChange(images.filter((_, j) => j !== i))}>
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={styles.uploadBtn} onClick={() => inputRef.current?.click()} disabled={uploading}>
        <Upload size={16} /> {uploading ? "Uploading…" : "Upload Image"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}
```

- [ ] **Step 3: Write `components/admin/ProductForm.tsx`**

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import type { Product, Category, BadgeType } from "@/types";
import styles from "./ProductForm.module.css";

interface Props { product?: Product; categories: Category[]; }

export default function ProductForm({ product, categories }: Props) {
  const router = useRouter();
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name ?? "",
    categoryId: product?.categoryId ?? "",
    price: product?.price?.toString() ?? "",
    originalPrice: product?.originalPrice?.toString() ?? "",
    description: product?.description ?? "",
    material: product?.material ?? "",
    weight: product?.weight ?? "",
    size: product?.size ?? "",
    badge: (product?.badge ?? "") as BadgeType | "",
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
    image: product?.image ?? "",
    images: product?.images ?? [] as string[],
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const field = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) { setError("Please select a category"); return; }
    if (Number(form.price) <= 0) { setError("Price must be greater than 0"); return; }
    setSaving(true); setError("");
    try {
      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
          badge: form.badge || null,
          image: form.images[0] ?? form.image,
          images: form.images,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      router.push("/admin/products");
      router.refresh();
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.field}>
        <label className={styles.label}>Product Name *</label>
        <input required value={form.name} onChange={field("name")} className={styles.input} placeholder="e.g. Golden Cascade Drop Earrings" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Category *</label>
        <select required value={form.categoryId} onChange={field("categoryId")} className={styles.input}>
          <option value="">Select category…</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Price (PKR) *</label>
          <input required type="number" min="1" value={form.price} onChange={field("price")} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Original Price (PKR)</label>
          <input type="number" min="1" value={form.originalPrice} onChange={field("originalPrice")} className={styles.input} placeholder="Leave blank if no discount" />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description *</label>
        <textarea required value={form.description} onChange={field("description")} className={styles.textarea} rows={3} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}><label className={styles.label}>Material *</label><input required value={form.material} onChange={field("material")} className={styles.input} /></div>
        <div className={styles.field}><label className={styles.label}>Weight *</label><input required value={form.weight} onChange={field("weight")} className={styles.input} /></div>
        <div className={styles.field}><label className={styles.label}>Size *</label><input required value={form.size} onChange={field("size")} className={styles.input} /></div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Badge</label>
          <select value={form.badge} onChange={field("badge")} className={styles.input}>
            <option value="">None</option>
            <option value="Sale">Sale</option>
            <option value="New">New</option>
            <option value="Bestseller">Bestseller</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Toggles</label>
          <div className={styles.checkboxRow}>
            <label><input type="checkbox" checked={form.inStock} onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))} /> In Stock</label>
            <label><input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} /> Featured</label>
          </div>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Images *</label>
        <ImageUpload images={form.images} onChange={(urls) => setForm((f) => ({ ...f, images: urls, image: urls[0] ?? "" }))} />
        {form.images.length === 0 && <p className={styles.hint}>Upload at least one image. First image is the primary.</p>}
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>Cancel</button>
        <button type="submit" disabled={saving} className={styles.saveBtn}>{saving ? "Saving…" : isEdit ? "Update Product" : "Create Product"}</button>
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Write `app/admin/products/page.tsx`**

```tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductTable from "@/components/admin/ProductTable";
import styles from "../dashboard.module.css";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ archived: "asc" }, { sortOrder: "asc" }],
  });
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Products</h1>
        <Link href="/admin/products/new" className={styles.btn}>+ New Product</Link>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
```

- [ ] **Step 5: Write `app/admin/products/new/page.tsx`**

```tsx
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import styles from "../../dashboard.module.css";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
```

- [ ] **Step 6: Write `app/admin/products/[id]/page.tsx`**

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import styles from "../../../dashboard.module.css";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: Number(id) } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Edit Product</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add app/admin/ components/admin/
git commit -m "feat: admin dashboard, products list, and product form with image upload"
```

---

### Task 14: Admin Orders, Categories & Sections

**Files:**
- Create: `app/admin/orders/page.tsx`
- Create: `components/admin/OrdersTable.tsx`
- Create: `app/admin/categories/page.tsx`
- Create: `components/admin/CategoryForm.tsx`
- Create: `app/admin/sections/page.tsx`
- Create: `components/admin/SectionsManager.tsx`

- [ ] **Step 1: Write `app/admin/orders/page.tsx`**

```tsx
import { prisma } from "@/lib/prisma";
import OrdersTable from "@/components/admin/OrdersTable";
import styles from "../dashboard.module.css";

const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

interface Props { searchParams: Promise<{ status?: string }> }

export default async function OrdersPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const orders = await prisma.order.findMany({
    where: status && status !== "all" ? { status } : {},
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Orders</h1>
      <div className={styles.tabs}>
        {STATUSES.map((s) => (
          <a key={s} href={s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`}
            className={`${styles.tab} ${(status ?? "all") === s ? styles["tab--active"] : ""}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
```

- [ ] **Step 2: Write `components/admin/OrdersTable.tsx`**

```tsx
"use client";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/types";
import styles from "./OrdersTable.module.css";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();

  const updateStatus = async (id: number, status: OrderStatus) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr><th>#</th><th>Customer</th><th>Phone</th><th>City</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>#{o.id}</td>
            <td>{o.name}</td>
            <td>{o.phone}</td>
            <td>{o.city}</td>
            <td>{(o.items as Array<{qty: number}>).reduce((s, i) => s + i.qty, 0)} item(s)</td>
            <td>PKR {o.total.toLocaleString()}</td>
            <td>{o.payMethod === "bank" ? "Bank" : "Mobile"}</td>
            <td>
              <select
                value={o.status}
                onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                className={`${styles.statusSelect} ${styles[`status--${o.status}`]}`}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </td>
            <td>{new Date(o.createdAt).toLocaleDateString("en-PK")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 3: Write `app/admin/categories/page.tsx`**

```tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CategoryForm from "@/components/admin/CategoryForm";
import styles from "../dashboard.module.css";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: { where: { archived: false } } } } },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Categories</h1>
      <table className={styles.table}>
        <thead><tr><th>Name</th><th>Slug</th><th>Products</th><th>Actions</th></tr></thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>{c._count.products}</td>
              <td><Link href={`/admin/categories/${c.id}`} className={styles.editLink}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className={styles.subheading}>Add New Category</h2>
      <CategoryForm />
    </div>
  );
}
```

- [ ] **Step 4: Write `app/admin/sections/page.tsx`**

```tsx
import { prisma } from "@/lib/prisma";
import SectionsManager from "@/components/admin/SectionsManager";
import styles from "../dashboard.module.css";

export default async function SectionsPage() {
  const sections = await prisma.section.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Homepage Sections</h1>
      <p className={styles.hint}>Toggle, reorder, and edit the content of each homepage section.</p>
      <SectionsManager sections={sections} />
    </div>
  );
}
```

- [ ] **Step 5: Write `components/admin/SectionsManager.tsx`** — CC with full section editing UI. Accepts `sections: Section[]`. Manages local state, renders per-type config editors (Hero text inputs, Marquee item list add/remove, Trust perks add/remove), calls PUT `/api/sections` on "Save All".

- [ ] **Step 6: Commit**

```bash
git add app/admin/ components/admin/
git commit -m "feat: admin orders, categories, and sections management"
```

---

## Phase 7 — Bug Fixes

### Task 15: Remaining Bug Fixes

Priority: **P0** = business-critical | **P1** = broken UX | **P2** = polish

| # | Issue | File | Fix | Priority |
|---|-------|------|-----|----------|
| 1 | CategoryPage sort does nothing | `app/(store)/category/[slug]/page.tsx` | Read `sort` from URL `searchParams`, apply `orderBy` in Prisma query | P1 |
| 2 | Search never filters | `components/store/Navbar.tsx` | On Enter in search input: `router.push(\`/shop?q=${encodeURIComponent(q)}\`)` | P1 |
| 3 | Wishlist 404 | `app/(store)/wishlist/page.tsx` | Page now exists (Task 11) | P1 |
| 4 | Wishlist state local per-card | `context/WishlistContext.tsx` | Now shared via context (Task 8) | P1 |
| 5 | Checkout sends no notification | `app/api/orders/route.ts` | Returns `whatsappUrl`; client opens it (Task 7 + 9) | P0 |
| 6 | Footer dead links | `app/(store)/` | Create static pages below | P1 |
| 7 | Cart empties on refresh | `context/CartContext.tsx` | localStorage hydration (Task 8) | P1 |
| 8 | `package.json` name wrong | `package.json` | Changed to `diamond-loft` (Task 1) | P2 |
| 9 | Placeholder payment details | `components/store/CartDrawer.tsx` | Replace with real BANK/JazzCash/EasyPaisa details before going live | P0 |
| 10 | Discount calc duplicated | `lib/utils.ts` | Single `calcDiscount()` used everywhere (Task 3) | P2 |
| 11 | WA number sanitization repeated | `lib/utils.ts` | `STORE_INFO.whatsappClean` + `buildWhatsAppOrderUrl()` (Task 3) | P2 |
| 12 | Badge class breaks with spaces | `components/store/ProductCard.tsx` | `badgeSlug()` from utils: `.toLowerCase().replace(/\s+/g, "-")` (Task 3) | P2 |
| 13 | Fonts render-blocking | `app/layout.tsx` | `next/font/google` (Task 8) | P2 |
| 14 | No code splitting | Next.js App Router | Built-in per-route splitting — fixed by migration | P2 |
| 15 | No image dimensions | `components/store/*` | `next/image` requires explicit `width`/`height` — enforced everywhere | P2 |
| 16 | Cart drawer no focus trap | `components/store/CartDrawer.tsx` | Add `useEffect` that calls `document.getElementById("cart-drawer")?.focus()` on open; trap Tab with keydown handler | P2 |
| 17 | Wishlist aria-label static | `components/store/ProductCard.tsx` | `aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}` | P2 |
| 18 | Body scroll not locked | `components/store/CartDrawer.tsx` + `Navbar.tsx` | `useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : "" }, [isOpen])` | P2 |
| 19 | No phone validation | `components/store/CartDrawer.tsx` | `validatePakistaniPhone()` from utils called before form submission | P1 |
| 20 | No error boundary | `app/error.tsx` | Created in Task 11 | P1 |

**Static info pages** (all P1 — legally required or trust-critical):

```
app/(store)/faq/page.tsx           — Shipping times, product care, payment, returns
app/(store)/shipping/page.tsx      — Delivery areas, charges, timeframes
app/(store)/returns/page.tsx       — 30-day policy, condition requirements, process
app/(store)/size-guide/page.tsx    — Ring sizes, bracelet lengths, chain lengths
app/(store)/care-guide/page.tsx    — Gold plating care, storage, cleaning
app/(store)/privacy/page.tsx       — Data collected, usage, contact for deletion
app/(store)/terms/page.tsx         — Purchase terms, liability, jurisdiction (Pakistan)
```

Each is a Server Component with static content. No DB required. Commit all together:

```bash
git add app/\(store\)/faq app/\(store\)/shipping app/\(store\)/returns \
        app/\(store\)/size-guide app/\(store\)/care-guide \
        app/\(store\)/privacy app/\(store\)/terms
git commit -m "feat: add FAQ, shipping, returns, size guide, care guide, privacy, terms pages"
```

---

## Phase 8 — Final Verification

### Task 16: QA Checklist

- [ ] `npm run build` — zero TypeScript errors, zero warnings
- [ ] `npm run lint` — zero ESLint errors
- [ ] `npx prisma validate` — schema valid
- [ ] Run dev server: `npm run dev`
- [ ] Store golden path: Home → Category → Product → Add to Cart → Checkout → Order placed → WhatsApp link opens
- [ ] Admin golden path: Login → Create product with image → Verify on store → Update order status
- [ ] Cart persists across page refreshes
- [ ] Wishlist persists across page refreshes
- [ ] Search navigates to `/shop?q=` and filters results
- [ ] Category sort dropdown updates URL and re-sorts
- [ ] All footer links resolve to real pages
- [ ] `next/image` serves all images without console warnings
- [ ] No `any` types remain in codebase: `grep -r ": any" --include="*.ts" --include="*.tsx" .`
- [ ] Admin routes redirect to login when unauthenticated (test in incognito)
- [ ] Mobile: hamburger menu, cart drawer, product images all render correctly

- [ ] **Final commit**

```bash
git add .
git commit -m "feat: complete Next.js 15 + TypeScript migration with admin panel"
```

---

## Implementation Notes

**CSS Modules pattern** — for every migrated component:
```
// Before: Navbar.css + className="navbar"
// After: Navbar.module.css + import styles from "./Navbar.module.css" + className={styles.navbar}
// Dynamic: className={`${styles.navbar} ${scrolled ? styles["navbar--scrolled"] : ""}`}
```

**Server vs Client component rule** — default to Server Component. Add `"use client"` only when the component uses: `useState`, `useEffect`, `useContext`, browser APIs, event handlers, or third-party hooks.

**`params` in Next.js 15** — always `await` params: `const { id } = await params` (breaking change from Next.js 14).

**Admin password** — the seed creates `admin@diamondloft.pk / changeme123`. Change this immediately after first login by updating the DB directly or adding a change-password page.
