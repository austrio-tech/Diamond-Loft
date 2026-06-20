import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { STORE_INFO } from "@/lib/utils";
import type { Category } from "@/types";
import DiamondLoftLogo from "./DiamondLoftLogo";

interface Props {
  categories: Category[];
}

export default function Footer({ categories }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top container">
        {/* Brand column */}
        <div className="footer__col footer__col--brand">
          <DiamondLoftLogo width={150} light />
          <p className="footer__tagline">{STORE_INFO.tagline}</p>
          <p className="footer__about">{STORE_INFO.description}</p>

          <div className="footer__socials">
            {/* Instagram */}
            <a
              href={STORE_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="footer__social-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={STORE_INFO.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="footer__social-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href={STORE_INFO.pinterest}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              className="footer__social-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Shop column */}
        <div className="footer__col">
          <h3 className="footer__col-heading">Shop</h3>
          <ul className="footer__col-links">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/category/${cat.slug}`} className="footer__link">
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className="footer__link">
                All Jewellery
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care column */}
        <div className="footer__col">
          <h3 className="footer__col-heading">Customer Care</h3>
          <ul className="footer__col-links">
            <li>
              <Link href="/faq" className="footer__link">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="footer__link">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/returns" className="footer__link">
                Returns
              </Link>
            </li>
            <li>
              <Link href="/size-guide" className="footer__link">
                Size Guide
              </Link>
            </li>
            <li>
              <Link href="/care-guide" className="footer__link">
                Care Guide
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact column */}
        <div className="footer__col">
          <h3 className="footer__col-heading">Get in Touch</h3>
          <ul className="footer__col-links">
            <li>
              <a
                href={`mailto:${STORE_INFO.email}`}
                className="footer__link footer__contact-link"
              >
                <Mail size={15} />
                {STORE_INFO.email}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${STORE_INFO.whatsappClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link footer__contact-link"
              >
                <Phone size={15} />
                {STORE_INFO.whatsapp}
              </a>
            </li>
            <li className="footer__hours">
              Mon – Sat: 10 AM – 8 PM
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p className="footer__copyright">
          &copy; {year} Diamond Loft. All rights reserved.
        </p>
        <div className="footer__bottom-links">
          <Link href="/privacy" className="footer__bottom-link">
            Privacy Policy
          </Link>
          <Link href="/terms" className="footer__bottom-link">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
