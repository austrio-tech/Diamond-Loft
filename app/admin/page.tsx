import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { OrderItem } from "@/types";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

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

  const statusClasses: Record<string, string> = {
    pending:   "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    shipped:   "bg-violet-500/15 text-violet-700 dark:text-violet-400",
    delivered: "bg-green-600/15 text-green-700 dark:text-green-500",
    cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
  };

  const stats = [
    { value: activeProducts, label: "Active Products" },
    { value: pendingOrders, label: "Pending Orders" },
    { value: totalOrders, label: "Total Orders" },
    { value: categoriesCount, label: "Categories" },
  ];

  return (
    <div className="bg-page min-h-screen p-8">
      <h1 className="font-serif text-3xl text-ink mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ value, label }) => (
          <StaggerItem key={label}>
            <div className="bg-surface border border-line rounded-card shadow-card p-6">
              <div className="font-serif text-4xl text-gold-dark mb-1">{value}</div>
              <div className="text-muted text-xs uppercase tracking-[0.2em]">{label}</div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Recent Orders */}
      <div>
        <h2 className="font-serif text-xl text-ink border-b border-line pb-2 mb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Order #", "Customer", "City", "Items", "Total", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedOrders.map((order) => (
                <tr key={order.id} className="border-b border-line hover:bg-soft transition-colors">
                  <td className="py-3 px-3 text-sm text-ink">#{order.id}</td>
                  <td className="py-3 px-3 text-sm text-ink">{order.name}</td>
                  <td className="py-3 px-3 text-sm text-muted">{order.city}</td>
                  <td className="py-3 px-3 text-sm text-muted">
                    {order.items.reduce((sum, item) => sum + item.qty, 0)}
                  </td>
                  <td className="py-3 px-3 text-sm text-ink">{formatPrice(order.total)}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        statusClasses[order.status] ?? "bg-soft text-muted"
                      }`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-sm text-muted">
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
                  <td colSpan={7} className="py-8 text-center text-muted text-sm">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
