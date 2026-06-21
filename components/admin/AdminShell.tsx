"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { overlay, drawerLeft } from "@/lib/motion";
import ThemeToggle from "@/components/ThemeToggle";
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

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "Products", href: "/admin/products", icon: <Package size={18} /> },
  { label: "Categories", href: "/admin/categories", icon: <Tag size={18} /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingCart size={18} /> },
  { label: "Sections", href: "/admin/sections", icon: <Layers size={18} /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
];

function NavLinks({
  isActive,
  onLinkClick,
}: {
  isActive: (href: string) => boolean;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="flex-1 flex flex-col gap-0.5 px-3 py-4">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={[
              "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors duration-150",
              active
                ? "bg-gold/10 text-gold"
                : "text-gold-light/60 hover:text-gold-light hover:bg-white/5",
            ].join(" ")}
          >
            <span className="flex items-center flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="px-3 pb-5 pt-4 border-t border-white/10 flex flex-col gap-1">
      <div className="flex items-center gap-2 px-3 py-2">
        <ThemeToggle className="text-gold-light/60 hover:text-gold-light transition-colors" />
        <span className="text-[11px] uppercase tracking-[0.15em] text-gold-light/40">
          Theme
        </span>
      </div>
      <button
        type="button"
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded text-sm font-medium text-gold-light/50 hover:text-gold-light hover:bg-white/5 transition-colors duration-150 text-left bg-transparent border-0 cursor-pointer"
        onClick={onSignOut}
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === href;
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
    <div className="flex min-h-screen">
      {/* Desktop sidebar — fixed, visible ≥901px */}
      <aside className="max-[900px]:hidden fixed left-0 top-0 w-60 h-screen bg-ink-deep flex flex-col z-[100] overflow-y-auto">
        <div className="px-6 py-7 border-b border-white/10">
          <span className="font-serif text-xl font-bold tracking-widest text-gold">
            Diamond Loft
          </span>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold-light/40 mt-0.5">
            Admin
          </p>
        </div>
        <NavLinks isActive={isActive} />
        <SidebarFooter onSignOut={() => signOut({ callbackUrl: "/admin/login" })} />
      </aside>

      {/* Mobile top bar — visible ≤900px */}
      <header className="min-[901px]:hidden flex items-center gap-3 fixed top-0 left-0 right-0 h-14 bg-ink-deep px-4 z-[200] border-b border-white/10">
        <button
          type="button"
          className="flex items-center justify-center bg-transparent border-0 text-gold-light/70 hover:text-gold-light cursor-pointer p-1 rounded transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
        <span className="font-serif text-lg font-bold tracking-widest text-gold">
          Diamond Loft
        </span>
      </header>

      {/* Mobile drawer + backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              variants={overlay}
              initial="hidden"
              animate="show"
              exit="exit"
              className="min-[901px]:hidden fixed inset-0 bg-black/50 z-[300]"
              onClick={closeSidebar}
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              variants={drawerLeft}
              initial="hidden"
              animate="show"
              exit="exit"
              className="min-[901px]:hidden fixed top-0 left-0 w-64 h-screen bg-ink-deep flex flex-col z-[400] overflow-y-auto"
              aria-hidden={!mobileOpen}
            >
              <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
                <span className="font-serif text-lg font-bold tracking-widest text-gold">
                  Diamond Loft
                </span>
                <button
                  type="button"
                  className="flex items-center justify-center bg-transparent border-0 text-gold-light/60 hover:text-gold-light cursor-pointer p-1 rounded transition-colors"
                  onClick={closeSidebar}
                  aria-label="Close navigation"
                >
                  <X size={20} />
                </button>
              </div>
              <NavLinks isActive={isActive} onLinkClick={closeSidebar} />
              <SidebarFooter
                onSignOut={() => {
                  closeSidebar();
                  signOut({ callbackUrl: "/admin/login" });
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 min-[901px]:ml-60 bg-page overflow-auto min-h-screen max-[900px]:pt-14">
        {children}
      </main>
    </div>
  );
}
