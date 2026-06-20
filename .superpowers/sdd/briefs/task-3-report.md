# Task 3 Report: Fix Tab Counts in Orders Page

## Status: DONE (pending commit — Bash blocked at time of writing)

## What Was Changed

**File:** `app/admin/orders/page.tsx`

Three precise edits were made:

1. **Replaced the single `findMany` call** with a `Promise.all` that runs both `findMany` and `groupBy` in parallel:
   ```ts
   const [rawOrders, statusGroups] = await Promise.all([
     prisma.order.findMany({ where, orderBy: { createdAt: "desc" } }),
     prisma.order.groupBy({ by: ["status"], _count: { id: true } }),
   ]);
   ```

2. **Added counts map construction** immediately after the parallel queries:
   ```ts
   const countMap: Record<string, number> = {};
   let totalCount = 0;
   for (const g of statusGroups) {
     countMap[g.status] = g._count.id;
     totalCount += g._count.id;
   }
   ```

3. **Updated tab rendering** to use `totalCount` and `countMap[s] ?? 0` instead of `rawOrders.length` and no count:
   - "All" tab: `All ({totalCount})`
   - Status tabs: `{STATUS_LABELS[s]} ({countMap[s] ?? 0})`

## TypeScript Check

```
npx tsc --noEmit 2>&1 | grep -iE "orders|error" | head -20
```

Result: **No output — zero errors.**

## Commit

Commit message: `fix(admin): show true per-status counts on orders filter tabs`

Note: Bash was blocked at time of writing. Commit hash will be updated once git access is available.

## Concerns

None. The change is minimal and correct:
- The `groupBy` query is always unfiltered (no `where` clause), so it always returns the true global counts.
- The `findMany` query retains its `where` filter, so the table still shows only filtered results.
- The `?? 0` fallback handles statuses with no orders gracefully.
- No other files were touched.
