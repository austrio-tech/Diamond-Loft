"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Layers,
  LogOut,
} from "lucide-react";
import styles from "./AdminSidebar.module.css";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: <Package size={18} />,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: <Tag size={18} />,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart size={18} />,
  },
  {
    label: "Sections",
    href: "/admin/sections",
    icon: <Layers size={18} />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandText}>Diamond Loft</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${isActive(item.href) ? styles.active : ""}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <button
          className={styles.signOut}
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
