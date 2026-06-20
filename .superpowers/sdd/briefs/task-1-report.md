# Task 1 Report: Order Detail Page + Client Controls

## Status
DONE (pending git commit — requires Bash permission for `git commit`)

## Files Created

1. `app/admin/orders/[id]/page.tsx` — Server component with Next.js 15 async params, prisma fetch, `notFound()` guard, `generateMetadata`, two-column grid layout with Items table, Customer & Delivery card, Payment card, and Fulfilment card.

2. `app/admin/orders/[id]/order-detail.module.css` — All required CSS classes: `.backLink`, `.heading`, `.subtext`, `.grid` (3fr 2fr), `.column`, `.card`, `.cardTitle`, `.itemsTable`, `.totalRow`, `.badge`, `.receiptImg`, `.infoGrid`, `.infoField`, `.payRow`, `.payLabel`, `.payValue`. Uses all required CSS custom properties. Responsive breakpoint at 900px stacks to single column.

3. `components/admin/OrderDetailControls.tsx` — Client component (`"use client"`). Props: `orderId`, `status`, `paymentStatus`. Uses `useState` for `busy`, `useRouter` for `router.refresh()`. Renders `StatusDropdown` with `onChange` → PUT `/api/orders/${orderId}` with `{ status }`. Conditionally renders "Confirm Payment" button when `paymentStatus === "unpaid"` → PUT `{ paymentStatus: "paid" }`. Both actions set busy=true before fetch and busy=false in finally.

4. `components/admin/OrderDetailControls.module.css` — Styles for controls layout: `.controls` (flex column), `.statusSection`, `.fieldLabel` (muted uppercase label), `.confirmBtn` (gold background, white text, full-width, disabled state).

## TypeScript Result

`npx tsc --noEmit 2>&1 | grep -iE "orders|OrderDetail|error" | head -30` produced **no output** — zero errors.

Full `npx tsc --noEmit` also produced no output — clean compilation.

## Commit

Files staged (`git add` completed). Commit message: `feat(admin): add order detail page and controls`. Awaiting `git commit` permission (Bash was denied for the commit step).

## Notes / Concerns

- Used `eslint-disable-next-line @next/next/no-img-element` comment on the receipt `<img>` as required (plain HTML img, not next/image).
- The `totalRow` uses `<tfoot>` with `colSpan={3}` as specified.
- No existing files were modified — all DO NOT TOUCH constraints respected.
- The `paymentStatus` prop is passed through to `OrderDetailControls` so the server-rendered page always starts with the correct initial state; `router.refresh()` keeps it in sync after mutations.
