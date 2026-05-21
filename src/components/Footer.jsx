import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { STORE_INFO, CATEGORIES } from "../data/db";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top container">
        {/* Brand */}
        <div className="footer__col footer__col--brand">
          <h3 className="footer__logo">{STORE_INFO.name}</h3>
          <p className="footer__tagline">{STORE_INFO.tagline}</p>
          <p className="footer__about">
            Handcrafted fine jewellery designed to celebrate every moment.
            Each piece is made with care and shipped with love.
          </p>
          <div className="footer__socials">
            <a href={STORE_INFO.instagram} target="_blank" rel="noopener noreferrer"
              className="footer__social" aria-label="Instagram">
              {/* Instagram */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href={STORE_INFO.facebook} target="_blank" rel="noopener noreferrer"
              className="footer__social" aria-label="Facebook">
              {/* Facebook */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href={STORE_INFO.pinterest} target="_blank" rel="noopener noreferrer"
              className="footer__social" aria-label="Pinterest">
              {/* Pinterest */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.772 0 3.135-1.866 3.135-4.561 0-2.385-1.715-4.052-4.163-4.052-2.836 0-4.5 2.126-4.5 4.323 0 .856.33 1.773.741 2.273a.3.3 0 0 1 .069.286c-.076.312-.243.995-.276 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.522 0 10-4.478 10-10S17.522 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Shop */}
        <div className="footer__col">
          <h4 className="footer__heading">Shop</h4>
          <ul className="footer__list">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link to={`/category/${cat.slug}`} className="footer__link">
                  {cat.name}
                </Link>
              </li>
            ))}
            <li><Link to="/shop" className="footer__link">All Jewellery</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div className="footer__col">
          <h4 className="footer__heading">Customer Care</h4>
          <ul className="footer__list">
            <li><Link to="/faq" className="footer__link">FAQ</Link></li>
            <li><Link to="/shipping" className="footer__link">Shipping Info</Link></li>
            <li><Link to="/returns" className="footer__link">Returns & Exchanges</Link></li>
            <li><Link to="/size-guide" className="footer__link">Size Guide</Link></li>
            <li><Link to="/care-guide" className="footer__link">Jewellery Care</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h4 className="footer__heading">Get in Touch</h4>
          <ul className="footer__contact">
            <li>
              <a href={`mailto:${STORE_INFO.email}`} className="footer__contact-item">
                <Mail size={15} />
                <span>{STORE_INFO.email}</span>
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__contact-item footer__contact-item--wa"
              >
                <Phone size={15} />
                <span>WhatsApp: {STORE_INFO.whatsapp}</span>
              </a>
            </li>
          </ul>
          <p className="footer__hours">
            Mon – Sat, 10am – 7pm PKT
          </p>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {year} {STORE_INFO.name}. All rights reserved.</p>
          <div className="footer__bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
