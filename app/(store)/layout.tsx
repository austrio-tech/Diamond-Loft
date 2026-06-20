import type { ReactNode } from "react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import CartDrawer from "@/components/store/CartDrawer";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import { getCategories } from "@/lib/data";

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const categories = await getCategories();

  return (
    <>
      <Navbar />
      {children}
      <Footer categories={categories} />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
