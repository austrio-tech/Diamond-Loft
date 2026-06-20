"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Layers,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import styles from "./AdminShell.module.css";

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
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings size={18} />,
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  const closeSidebar = useCallback(() => setMobileOpen(false), []);

  // Lock body scroll when the mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close drawer when route changes (nav link tapped)
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <div className={styles.shell}>
      {/* Desktop sidebar — always visible ≥901px */}
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

      {/* Mobile top bar — only visible ≤900px */}
      <header className={styles.topBar}>
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
        <span className={styles.topBarBrand}>Diamond Loft</span>
      </header>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className={styles.backdrop}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`${styles.drawer} ${mobileOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.brandText}>Diamond Loft</span>
          <button
            className={styles.closeBtn}
            onClick={closeSidebar}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
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
            onClick={() => {
              closeSidebar();
              signOut({ callbackUrl: "/admin/login" });
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
