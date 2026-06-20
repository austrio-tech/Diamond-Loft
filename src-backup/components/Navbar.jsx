import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import DiamondLoftLogo from "./DiamondLoftLogo";
import "./Navbar.css";

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Home",          to: "/" },
    { label: "Earrings",      to: "/category/earrings" },
    { label: "Pendants",      to: "/category/pendants" },
    { label: "Bracelets",     to: "/category/bracelets" },
    { label: "Ear Tops",      to: "/category/ear-tops" },
    { label: "All Jewellery", to: "/shop" },
  ];

  return (
    <>
      <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <div className="navbar__inner container">
          {/* Hamburger (mobile) */}
          <button
            className="navbar__icon-btn navbar__hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="navbar__logo" aria-label="Diamond Loft — Home">
            <DiamondLoftLogo width={148} />
          </Link>

          {/* Desktop nav */}
          <nav className="navbar__links">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`navbar__link${location.pathname === l.to ? " navbar__link--active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="navbar__actions">
            <button
              className="navbar__icon-btn"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="navbar__icon-btn" aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            <button
              className="navbar__icon-btn navbar__cart"
              onClick={openCart}
              aria-label="Open cart"
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
            <input
              autoFocus
              type="text"
              placeholder="Search for earrings, pendants, bracelets…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar__search-input"
            />
            <button
              className="navbar__icon-btn"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-nav">
          <nav className="mobile-nav__links">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="mobile-nav__link">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {menuOpen && (
        <div className="mobile-nav__overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
