"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import ThemeToggle from "@/components/ThemeToggle";
import { overlay, drawerLeft } from "@/lib/motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Earrings", href: "/category/earrings" },
  { label: "Pendants", href: "/category/pendants" },
  { label: "Bracelets", href: "/category/bracelets" },
  { label: "Ear Tops", href: "/category/ear-tops" },
  { label: "All Jewellery", href: "/shop" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu and search on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [pathname]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push("/shop?q=" + encodeURIComponent(query.trim()));
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <>
      {/* Sticky header */}
      <header
        className={[
          "sticky top-0 z-40 bg-surface border-b border-line transition-shadow duration-300",
          scrolled ? "shadow-card" : "",
        ].join(" ")}
      >
        {/* Top bar */}
        <div className="bg-ink-deep text-center py-2 px-4">
          <span className="text-[#e9dec8] text-[11px] [font-variant:small-caps] tracking-[0.2em]">
            Complimentary Gift Wrapping on Every Order
          </span>
        </div>

        {/* Brand row */}
        <div className="flex flex-col items-center pt-6 pb-3 border-b border-line">
          <Link href="/" aria-label="Diamond Loft home" className="flex flex-col items-center">
            {/* Black logo: blend onto the light brand row; invert for dark theme */}
            <img
              src="/diamond-loft.jpeg"
              alt="Diamond Loft"
              className="h-12 md:h-14 w-auto mix-blend-multiply dark:mix-blend-screen dark:invert"
            />
            <div className="text-gold text-[11px] [font-variant:small-caps] tracking-[0.35em] mt-1.5">
              Fine Jewellery · Est. 2025
            </div>
          </Link>
        </div>

        {/* Nav row */}
        <div className="relative flex items-center justify-between px-6 py-3">
          {/* Hamburger — left */}
          <button
            className="md:hidden text-ink hover:text-gold transition-colors p-1"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop nav links — center */}
          <nav
            className="hidden md:flex items-center justify-center gap-9 absolute left-1/2 -translate-x-1/2"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "text-[13px] [font-variant:small-caps] tracking-[0.12em] transition-colors",
                  pathname === link.href
                    ? "text-gold"
                    : "text-muted hover:text-gold",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions — right */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              className="text-ink hover:text-gold transition-colors p-1"
              aria-label="Search"
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <Search size={18} />
            </button>

            <Link
              href="/wishlist"
              className="text-ink hover:text-gold transition-colors p-1"
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </Link>

            <button
              className="relative text-ink hover:text-gold transition-colors p-1"
              aria-label={`Cart (${totalItems} items)`}
              onClick={openCart}
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-surface text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </button>

            <ThemeToggle className="text-ink hover:text-gold transition-colors p-1" />
          </div>
        </div>

        {/* Search bar — 70% centered */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="border-t border-line py-4 px-6"
            >
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                className="relative mx-auto"
                style={{ width: "70%" }}
              >
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search jewellery…"
                  autoFocus
                  aria-label="Search jewellery"
                  className="w-full pl-9 pr-24 py-2.5 bg-page border border-line rounded-card text-ink text-sm placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 text-xs [font-variant:small-caps] tracking-wide text-gold hover:text-gold-dark transition-colors"
                  aria-label="Submit search"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer overlay + drawer — OUTSIDE header to avoid backdrop-filter clip */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="mob-overlay"
              variants={overlay}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 z-50 bg-ink/60"
              aria-hidden="true"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.nav
              key="mob-drawer"
              variants={drawerLeft}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed top-0 left-0 z-50 h-full w-72 bg-surface border-r border-line flex flex-col"
              aria-label="Mobile navigation"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-line">
                <span className="font-serif text-xl text-ink tracking-widest">
                  DIAMOND LOFT
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="text-muted hover:text-gold transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-1 py-6 px-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "py-2.5 text-sm [font-variant:small-caps] tracking-[0.15em] border-b border-line transition-colors",
                      pathname === link.href
                        ? "text-gold"
                        : "text-muted hover:text-gold",
                    ].join(" ")}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
