import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { STORE_INFO } from "@/lib/utils";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
}

export default function Footer({ categories }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-deep text-[#cdbfa6]">
      {/* Main grid */}
      <div className="container-site pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div className="font-serif text-2xl tracking-[0.15em] text-[#f1e6cf]">
              DIAMOND LOFT
            </div>
            <div className="w-12 h-px bg-gold" />
            <p className="text-sm leading-relaxed text-[#a89c86]">
              {STORE_INFO.tagline}
            </p>
            <p className="text-sm leading-relaxed text-[#a89c86]">
              {STORE_INFO.description}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-2">
              {/* Instagram */}
              <a
                href={STORE_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#a89c86] hover:text-gold transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
                className="text-[#a89c86] hover:text-gold transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
                className="text-[#a89c86] hover:text-gold transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
          <div>
            <h3 className="[font-variant:small-caps] tracking-[0.2em] text-sm text-[#e9dec8] mb-5">
              Shop
            </h3>
            <ul className="flex flex-col gap-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-[#a89c86] hover:text-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-[#a89c86] hover:text-gold transition-colors"
                >
                  All Jewellery
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care column */}
          <div>
            <h3 className="[font-variant:small-caps] tracking-[0.2em] text-sm text-[#e9dec8] mb-5">
              Customer Care
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Shipping", href: "/shipping" },
                { label: "Returns", href: "/returns" },
                { label: "Size Guide", href: "/size-guide" },
                { label: "Care Guide", href: "/care-guide" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#a89c86] hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="[font-variant:small-caps] tracking-[0.2em] text-sm text-[#e9dec8] mb-5">
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${STORE_INFO.email}`}
                  className="flex items-center gap-2 text-sm text-[#a89c86] hover:text-gold transition-colors"
                >
                  <Mail size={14} />
                  {STORE_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappClean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#a89c86] hover:text-gold transition-colors"
                >
                  <Phone size={14} />
                  {STORE_INFO.whatsapp}
                </a>
              </li>
              <li className="text-sm text-[#6b6257]">Mon – Sat: 10 AM – 8 PM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#3a3328]">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#6b6257] tracking-wide">
            &copy; {year} Diamond Loft. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-[#6b6257] hover:text-gold transition-colors tracking-wide"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[#6b6257] hover:text-gold transition-colors tracking-wide"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
