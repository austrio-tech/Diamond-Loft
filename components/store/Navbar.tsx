"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import DiamondLoftLogo from "./DiamondLoftLogo";

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
      <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar__inner container">
        {/* Hamburger */}
        <button
          className="navbar__icon-btn navbar__hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link href="/" className="navbar__logo" aria-label="Diamond Loft home">
          <DiamondLoftLogo width={140} />
        </Link>

        {/* Desktop nav links */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar__link${pathname === link.href ? " navbar__link--active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <button
            className="navbar__icon-btn"
            aria-label="Search"
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <Search size={20} />
          </button>

          <Link
            href="/wishlist"
            className="navbar__icon-btn"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>

          <button
            className="navbar__icon-btn navbar__cart"
            aria-label={`Cart (${totalItems} items)`}
            onClick={openCart}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="navbar__badge">{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="navbar__search container">
          <form onSubmit={handleSearchSubmit} role="search">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jewellery..."
              autoFocus
              aria-label="Search jewellery"
            />
            <button type="submit" aria-label="Submit search">
              <Search size={18} />
            </button>
          </form>
        </div>
      )}
      </header>

      {/* Mobile drawer overlay — rendered OUTSIDE <header> because the navbar's
          backdrop-filter creates a containing block that would clip fixed children */}
      {menuOpen && (
        <div
          className="mobile-nav__overlay"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <nav
        className={`mobile-nav${menuOpen ? " mobile-nav--open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-nav__links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav__link${pathname === link.href ? " mobile-nav__link--active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
