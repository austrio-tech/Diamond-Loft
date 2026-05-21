import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { STORE_INFO } from "../data/db";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg">
        <img
          src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=85"
          alt="Jewellery banner"
          className="hero__bg-img"
        />
        <div className="hero__overlay" />
      </div>

      <div className="hero__content container">
        <p className="hero__label">New Collection 2025</p>
        <h1 className="hero__title">{STORE_INFO.tagline}</h1>
        <p className="hero__subtitle">
          Discover handcrafted jewellery — earrings, pendants, bracelets & ear tops
          designed to make every moment shine.
        </p>
        <div className="hero__actions">
          <Link to="/shop" className="btn btn--primary">
            Shop Now <ArrowRight size={16} />
          </Link>
          <Link to="/category/earrings" className="btn btn--outline">
            Explore Earrings
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-hint">
        <span />
      </div>
    </section>
  );
}
