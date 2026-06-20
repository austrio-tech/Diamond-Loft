import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { OrderItem } from "@/types";
import styles from "./dashboard.module.css";

export default async function AdminDashboardPage() {
  const [activeProducts, pendingOrders, totalOrders, categoriesCount, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { archived: false } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count(),
      prisma.category.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const parsedOrders = recentOrders.map((o) => ({
    ...o,
    items: JSON.parse(o.items as unknown as string) as OrderItem[],
    createdAt: o.createdAt.toISOString(),
  }));

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Dashboard</h1>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{activeProducts}</div>
          <div className={styles.statLabel}>Active Products</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{pendingOrders}</div>
          <div className={styles.statLabel}>Pending Orders</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalOrders}</div>
          <div className={styles.statLabel}>Total Orders</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{categoriesCount}</div>
          <div className={styles.statLabel}>Categories</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Orders</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>City</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {parsedOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.name}</td>
                <td>{order.city}</td>
                <td>{order.items.reduce((sum, item) => sum + item.qty, 0)}</td>
                <td>{formatPrice(order.total)}</td>
                <td>
                  <span className={`${styles.badge} ${styles[order.status as keyof typeof styles] ?? ""}`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {parsedOrders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)" }}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
