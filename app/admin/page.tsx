import { prisma } from "@/lib/prisma";
import type { OrderItem } from "@/types";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";

export default async function AdminDashboardPage() {
  const [activeProducts, pendingOrders, totalOrders, categoriesCount, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { archived: false } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count(),
      prisma.category.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const recentRows = recentOrders.map((o) => {
    const items = JSON.parse(o.items as unknown as string) as OrderItem[];
    return {
      id: o.id,
      name: o.name,
      city: o.city,
      itemCount: items.reduce((sum, item) => sum + item.qty, 0),
      total: o.total,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    };
  });

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
        <RecentOrdersTable orders={recentRows} />
      </div>
    </div>
  );
}
