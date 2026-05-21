import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ShopPage from "./pages/ShopPage";
import ProductDetail from "./pages/ProductDetail";

function AppShell() {
  const { isOpen, closeCart } = useCart();

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/shop"               element={<ShopPage />} />
          <Route path="/category/:slug"     element={<CategoryPage />} />
          <Route path="/product/:id"        element={<ProductDetail />} />
          <Route path="*"                   element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      {isOpen && <CartDrawer onClose={closeCart} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "120px 24px" }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "48px", marginBottom: "16px" }}>
        Page not found
      </h2>
      <a href="/" style={{ color: "var(--gold-dark)", fontSize: "15px" }}>
        ← Go back home
      </a>
    </div>
  );
}
