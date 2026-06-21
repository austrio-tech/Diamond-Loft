import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ThemeProvider, themeInitScript } from "@/context/ThemeProvider";
import { STORE_INFO } from "@/lib/utils";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-eb",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${STORE_INFO.name} — ${STORE_INFO.tagline}`,
    template: `%s — ${STORE_INFO.name}`,
  },
  description: STORE_INFO.description,
  openGraph: {
    title: `${STORE_INFO.name} — ${STORE_INFO.tagline}`,
    description: STORE_INFO.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${ebGaramond.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Set theme before paint to avoid a flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <CartProvider>
              <WishlistProvider>{children}</WishlistProvider>
            </CartProvider>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
