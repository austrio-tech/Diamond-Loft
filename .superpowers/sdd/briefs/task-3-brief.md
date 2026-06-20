# Task 3: Fix Tab Counts in Orders Page

## Context
Project: Next.js 15 + TypeScript admin panel at `/Users/stellteck/Desktop/DEV/Diamond-Loft`.
This is Task 3 of 3. File to edit: `app/admin/orders/page.tsx`.

## Problem
Currently the tab counts use `rawOrders.length` which reflects the FILTERED result (e.g. only pending orders). So "All (1)" when filtered to pending, and other tabs show no count at all.

## Goal
Compute TRUE per-status counts independent of the active filter, and show them on every tab.

## File to Edit: `app/admin/orders/page.tsx`

### Current code (for reference):
```tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OrdersTable from "@/components/admin/OrdersTable";
import type { Order, OrderStatus, OrderItem, PaymentMethod, PaymentStatus } from "@/types";
import styles from "./orders.module.css";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending", confirmed: "Confirmed", shipped: "Shipped",
  delivered: "Delivered", cancelled: "Cancelled",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where = status && STATUSES.includes(status as OrderStatus)
    ? { status: status as OrderStatus }
    : {};

  const rawOrders = await prisma.order.findMany({ where, orderBy: { createdAt: "desc" } });

  const orders: Order[] = rawOrders.map((o) => ({
    ...o,
    items: JSON.parse(o.items as unknown as string) as OrderItem[],
    payMethod: o.payMethod as PaymentMethod,
    paymentStatus: o.paymentStatus as PaymentStatus,
    status: o.status as OrderStatus,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Orders</h1>
      <nav className={styles.tabs}>
        <Link href="/admin/orders" className={`${styles.tab} ${!status ? styles.tabActive : ""}`}>
          All ({rawOrders.length})
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`}
            className={`${styles.tab} ${status === s ? styles.tabActive : ""}`}>
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </nav>
      <OrdersTable orders={orders} />
    </div>
  );
}
```

### Required change:

**Add a parallel query for true counts** using `prisma.order.groupBy`:

```ts
const [rawOrders, statusGroups] = await Promise.all([
  prisma.order.findMany({ where, orderBy: { createdAt: "desc" } }),
  prisma.order.groupBy({ by: ["status"], _count: { id: true } }),
]);

// Build counts map
const countMap: Record<string, number> = {};
let totalCount = 0;
for (const g of statusGroups) {
  countMap[g.status] = g._count.id;
  totalCount += g._count.id;
}
```

**Update tab rendering** to use `totalCount` and `countMap[s]`:

```tsx
<Link href="/admin/orders" ...>
  All ({totalCount})
</Link>
{STATUSES.map((s) => (
  <Link key={s} href={`/admin/orders?status=${s}`} ...>
    {STATUS_LABELS[s]} ({countMap[s] ?? 0})
  </Link>
))}
```

**Do not change** anything else — keep the `where` filter for `findMany`, keep all imports, keep the `orders` mapping logic, keep the OrdersTable usage.

## Verification
After implementing, run:
```
cd /Users/stellteck/Desktop/DEV/Diamond-Loft && npx tsc --noEmit 2>&1 | grep -iE "orders" | head -20
```
Report the tsc result.

## Commit
Commit with message: `fix(admin): show true per-status counts on orders filter tabs`

## Report
Write your full report to: `/Users/stellteck/Desktop/DEV/Diamond-Loft/.superpowers/sdd/briefs/task-3-report.md`
Return: status (DONE/BLOCKED/NEEDS_CONTEXT), commits created, one-line test summary, any concerns.
