# Task 2: OrdersTable — Clickable Rows + Read-Only Status Badge

## Context
Project: Next.js 15 + TypeScript admin panel at `/Users/stellteck/Desktop/DEV/Diamond-Loft`.
This is Task 2 of 3 for admin Orders improvements.

## Goal
Edit `components/admin/OrdersTable.tsx` to: (a) remove the in-table StatusDropdown and `handleStatusChange`, (b) show status as a read-only colored badge, (c) make rows clickable to navigate to `/admin/orders/${order.id}`, (d) remove "Confirm Payment" button from the table.

## DO NOT TOUCH
- `components/admin/StatusDropdown.*`
- `app/api/**`, `lib/**`, `prisma/**`
- `app/admin/dashboard.module.css`, `app/admin/layout.tsx`
- `components/admin/AdminSidebar*`, `app/admin/admin.module.css`

## Files to Edit

### `components/admin/OrdersTable.tsx`

**Remove:**
- The `StatusDropdown` import
- The `handleStatusChange` async function
- The `handleConfirmPayment` async function
- The `StatusDropdown` usage in the status `<td>`
- The "Confirm Payment" `<button>` in the Pay Status `<td>`

**Add — Status Badge:**
Replace the StatusDropdown with a read-only pill badge. Use this exact color mapping:
```ts
const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  pending:   { bg: "#fff3e0", color: "#c9a96e" },
  confirmed: { bg: "#e3f0ff", color: "#2f80ed" },
  shipped:   { bg: "#f0ebff", color: "#8e6fd6" },
  delivered: { bg: "#e4f9ec", color: "#1a7a40" },
  cancelled: { bg: "#fdecea", color: "#c0392b" },
};
```
The badge: an inline `<span>` with a colored dot (8×8px circle, same `color` as background is NOT right — use the `color` value for the dot) + the status label. Pill shape: `border-radius: 20px`, `padding: 3px 10px`, `font-size: 11px`, `font-weight: 600`.

**Pill structure (inline styles acceptable):**
```tsx
<span style={{
  display: "inline-flex", alignItems: "center", gap: "6px",
  background: scColors.bg, color: scColors.color,
  borderRadius: "20px", padding: "3px 10px",
  fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap"
}}>
  <span style={{ width: 8, height: 8, borderRadius: "50%", background: scColors.color, flexShrink: 0 }} />
  {STATUS_LABELS[order.status]}
</span>
```
Where `STATUS_LABELS` is:
```ts
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending", confirmed: "Confirmed", shipped: "Shipped",
  delivered: "Delivered", cancelled: "Cancelled",
};
```

**Add — Clickable Rows:**
- Add `onClick={() => router.push(\`/admin/orders/\${order.id}\`)}` to each `<tr>`
- Add `style={{ cursor: "pointer" }}` on the `<tr>`
- On the receipt `<a>` tag: add `onClick={(e) => e.stopPropagation()}` so clicking the receipt link does NOT trigger row navigation

**Keep unchanged:**
- All imports (remove StatusDropdown import, keep useRouter, formatPrice, paymentMethodLabel, Order/PaymentStatus types)
- `PAYMENT_STATUS_COLORS` and pay-status badge (the inline span)
- Receipt thumbnail logic
- Column headers (#, Customer, Phone, City, Items, Total, Payment, Pay Status, Receipt, Status, Date)
- The `"use client"` directive

### `components/admin/OrdersTable.module.css`

Add a row hover style that shows pointer cursor (the `tr:hover` already sets background; add `cursor: pointer` via a new class or directly):
```css
.clickableRow {
  cursor: pointer;
}
.clickableRow:hover td {
  background: var(--cream);
}
```
Remove the `.confirmBtn` styles (no longer used). Remove `.statusSelect` and its variant classes if present.

## Verification
After implementing, run:
```
cd /Users/stellteck/Desktop/DEV/Diamond-Loft && npx tsc --noEmit 2>&1 | grep -iE "orders|OrdersTable" | head -20
```
Report the tsc result.

## Commit
Commit with message: `feat(admin): make order rows clickable, replace status dropdown with badge`

## Report
Write your full report to: `/Users/stellteck/Desktop/DEV/Diamond-Loft/.superpowers/sdd/briefs/task-2-report.md`
Return: status (DONE/BLOCKED/NEEDS_CONTEXT), commits created, one-line test summary, any concerns.
