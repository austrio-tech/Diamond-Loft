import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";
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
            <Link href="/" aria-label="Diamond Loft home">
              {/* Footer is always dark — invert the black logo to white */}
              <img
                src="/diamond-loft.jpeg"
                alt="Diamond Loft"
                className="h-12 w-auto invert mix-blend-screen"
              />
            </Link>
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
                  href={`tel:+${STORE_INFO.whatsappClean}`}
                  className="flex items-center gap-2 text-sm text-[#a89c86] hover:text-gold transition-colors"
                >
                  <Phone size={14} />
                  {STORE_INFO.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappClean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#a89c86] hover:text-gold transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp
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
