# Task 1: Order Detail Page + Client Controls

## Context
Project: Next.js 15 + TypeScript admin panel at `/Users/stellteck/Desktop/DEV/Diamond-Loft`.
This is Task 1 of 3 for an admin Orders section improvement.

## Goal
Create a server-rendered order detail page at `app/admin/orders/[id]/page.tsx` plus a small client component `components/admin/OrderDetailControls.tsx` for interactive status/payment controls.

## DO NOT TOUCH
- `app/admin/dashboard.module.css`
- `app/admin/layout.tsx`
- `components/admin/AdminSidebar*`
- `app/admin/admin.module.css`
- `components/store/**`
- `components/admin/StatusDropdown.*` (use as-is)
- `app/api/**`
- `lib/**`
- `prisma/**`

## Files to Create

### 1. `app/admin/orders/[id]/page.tsx` — Server Component

- Params: `params: Promise<{ id: string }>` (Next.js 15 async params pattern)
- Fetch: `prisma.order.findUnique({ where: { id: Number(id) } })` — call `notFound()` if missing
- Parse items: `JSON.parse(o.items as unknown as string) as OrderItem[]`
- Cast: `payMethod as PaymentMethod`, `paymentStatus as PaymentStatus`, `status as OrderStatus`, `createdAt.toISOString()`
- `generateMetadata` function returning `{ title: \`Order #\${id}\` }`

**Layout structure:**
- Back link: `← Back to Orders` linking to `/admin/orders`
- Order header: `Order #<id>` (serif heading) + placed date (`new Date(order.createdAt).toLocaleDateString('en-PK', { dateStyle: 'long' })`)
- Two-column grid (left wider ~60%, right ~40%):

**Left column:**
1. "Items" card — table with columns: Item | Qty | Unit Price | Total. Each `OrderItem` renders: `item.name`, `item.qty`, `formatPrice(item.price)`, `formatPrice(item.price * item.qty)`. Footer row: "Grand Total" spanning 3 cols + `formatPrice(order.total)`.
2. "Customer & Delivery" card — two-row grid: Name + Phone top, Address + City below (labels + values).

**Right column:**
1. "Payment" card:
   - Method: `paymentMethodLabel(order.payMethod)` 
   - Payment status badge (use same color mapping as OrdersTable: unpaid=#fdf0f0/c0392b, paid=#e9f7ef/1a7a40, cod=#fff8e7/856404)
   - Receipt: if `order.receiptUrl?.startsWith("/uploads/receipts/")` → show `<img>` (plain, not Next/Image) inside an `<a>` linking to `order.receiptUrl` with `target="_blank"`. Otherwise show `—`.
2. "Fulfilment" card — render `<OrderDetailControls orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />`

### 2. `components/admin/OrderDetailControls.tsx` — Client Component (`"use client"`)

Props: `{ orderId: number; status: OrderStatus; paymentStatus: PaymentStatus }`

- Uses `useRouter()` from `next/navigation`
- Uses `useState` for `busy` boolean (for StatusDropdown's `busy` prop)
- Renders `StatusDropdown` (import from `"./StatusDropdown"`) — on `onChange`: PUT `/api/orders/${orderId}` with `{ status }`, then `router.refresh()`
- Renders "Confirm Payment" button only when `paymentStatus === "unpaid"` — on click: PUT `{ paymentStatus: "paid" }`, then `router.refresh()`
- Both actions: set busy=true before fetch, set busy=false after (in finally)

### 3. `components/admin/OrderDetailControls.module.css`

Simple styles for the controls layout — status section, confirm button (gold background, white text, matches project's button style).

### 4. `app/admin/orders/[id]/order-detail.module.css`

CSS for the detail page layout. Requirements:
- Use CSS custom properties: `var(--border)`, `var(--radius)`, `var(--gold)`, `var(--charcoal)`, `var(--muted)`, `var(--white)`, `var(--cream)`, `var(--font-serif)`
- White cards with border + radius + padding
- Two-column grid (`.grid` class, 3fr 2fr columns with gap)
- `.backLink` — muted small link
- `.heading` — serif font, large, charcoal
- `.subtext` — small muted text
- `.card` — white bg, border, border-radius: var(--radius), padding: 20px 24px
- `.cardTitle` — serif font, slightly larger than body, charcoal, margin-bottom
- Items table styles (`.itemsTable`, full width, border-collapse, header row)
- `.totalRow` — bold total row
- `.badge` — inline pill (padding: 2px 8px, border-radius: 20px, font-size: 11px, font-weight: 600)
- `.receiptImg` — 80px × 80px, object-fit: cover, border-radius: var(--radius), border: 1px solid var(--border)

## Existing pieces to import/use
- `import { prisma } from "@/lib/prisma"` (server only)
- `import { formatPrice, paymentMethodLabel } from "@/lib/utils"`
- `import type { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from "@/types"`
- `import StatusDropdown from "@/components/admin/StatusDropdown"` (in OrderDetailControls)
- `import { notFound } from "next/navigation"` (in page.tsx)
- `import dashStyles from "@/app/admin/dashboard.module.css"` for `.page` wrapper (do not modify dashboard.module.css)

## Types reference
```ts
interface OrderItem { productId: number; name: string; price: number; qty: number }
interface Order { id: number; token: string; name: string; phone: string; address: string; city: string; items: OrderItem[]; total: number; payMethod: PaymentMethod; paymentStatus: PaymentStatus; receiptUrl: string | null; status: OrderStatus; notes: string | null; createdAt: string }
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
type PaymentStatus = "unpaid" | "paid" | "cod"
type PaymentMethod = "cod" | "bank" | "jazzcash" | "easypaisa"
```

## Verification
After implementing, run:
```
cd /Users/stellteck/Desktop/DEV/Diamond-Loft && npx tsc --noEmit 2>&1 | grep -iE "orders|OrderDetail" | head -20
```
Fix any type errors in your files. Report the tsc result.

## Commit
Commit all new files with message: `feat(admin): add order detail page and controls`

## Report
Write your full report to: `/Users/stellteck/Desktop/DEV/Diamond-Loft/.superpowers/sdd/briefs/task-1-report.md`
Return: status (DONE/BLOCKED/NEEDS_CONTEXT), commits created, one-line test summary, any concerns.
