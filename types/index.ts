// ── Primitives ────────────────────────────────────────────────
export type BadgeType = "Sale" | "New" | "Bestseller" | "Premium";
export type SortOption = "featured" | "price-asc" | "price-desc" | "rating";
export type PaymentMethod = "cod" | "bank" | "jazzcash" | "easypaisa";
export type PaymentStatus = "unpaid" | "paid" | "cod";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

// ── Store entities ─────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  accent: string;
  sortOrder: number;
  _count?: { products: number };
}

export interface Product {
  id: number;
  categoryId: string;
  category?: Category;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  badge: BadgeType | null;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  archived: boolean;
  description: string;
  material: string;
  weight: string;
  size: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ── Cart ───────────────────────────────────────────────────────
export interface CartItem extends Omit<Product, "createdAt" | "updatedAt"> {
  qty: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: "ADD"; product: Product; qty: number }
  | { type: "REMOVE"; id: number }
  | { type: "UPDATE"; id: number; qty: number }
  | { type: "CLEAR" }
  | { type: "SET_OPEN"; open: boolean }
  | { type: "HYDRATE"; items: CartItem[] };

// ── Orders ────────────────────────────────────────────────────
export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: number;
  token: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  total: number;
  payMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  receiptUrl: string | null;
  status: OrderStatus;
  notes: string | null;
  createdAt: string;
}

export interface CreateOrderPayload {
  name: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  total: number;
  payMethod: PaymentMethod;
  receiptUrl?: string | null;
}

export interface CreateOrderResponse {
  order: Order;
  whatsappUrl: string;
}

// ── Homepage Sections ─────────────────────────────────────────
export interface HeroConfig {
  label: string;
  tagline: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  bgImage: string;
}

export interface MarqueeConfig {
  items: string[];
}

export interface FeaturedConfig {
  label: string;
  title: string;
}

export interface CategoryGridConfig {
  label: string;
  title: string;
}

export interface TrustPerk {
  icon: string; // lucide icon name
  title: string;
  desc: string;
}

export interface TrustConfig {
  perks: TrustPerk[];
}

export interface TestimonialEntry {
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
  avatar: string;
}

export interface TestimonialsConfig {
  label: string;
  title: string;
  reviews: TestimonialEntry[];
}

export type SectionConfig =
  | HeroConfig
  | MarqueeConfig
  | FeaturedConfig
  | CategoryGridConfig
  | TrustConfig
  | TestimonialsConfig;

export type SectionType =
  | "hero"
  | "marquee"
  | "categoryGrid"
  | "featured"
  | "trust"
  | "testimonials";

export interface Section {
  id: string;
  type: SectionType;
  enabled: boolean;
  sortOrder: number;
  config: SectionConfig;
}

// ── Store Info ────────────────────────────────────────────────
export interface StoreInfo {
  name: string;
  tagline: string;
  description: string;
  whatsapp: string;
  whatsappClean: string; // digits only, e.g. "923226329793"
  email: string;
  instagram: string;
  facebook: string;
}

// ── API helpers ───────────────────────────────────────────────
export interface ApiError {
  error: string;
}
