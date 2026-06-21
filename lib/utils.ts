import type { StoreInfo } from "@/types";

export const STORE_INFO: StoreInfo = {
  name: "Diamond Loft",
  tagline: "Elegance Crafted for You",
  description:
    "Handcrafted fine jewellery — earrings, pendants, bracelets & ear tops.",
  whatsapp: "+92 322 6329793",
  whatsappClean: "923226329793",
  email: "Diamondloft.pk@gmail.com",
  instagram: "https://instagram.com/diamondloft.pk",
  facebook: "https://facebook.com/diamondloft.pk",
};

export function calcDiscount(
  price: number,
  originalPrice: number | null
): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function formatPrice(amount: number): string {
  return `PKR ${amount.toLocaleString()}`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function buildWhatsAppOrderUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function buildOrderWhatsAppMessage(order: {
  name: string;
  phone: string;
  address: string;
  city: string;
  items: Array<{ name: string; qty: number; price: number }>;
  total: number;
  payMethod: string;
}): string {
  const itemLines = order.items
    .map(
      (i) =>
        `• ${i.name} × ${i.qty} — PKR ${(i.price * i.qty).toLocaleString()}`
    )
    .join("\n");

  const payLabel = paymentMethodLabel(order.payMethod);

  return `🛍️ New Order — Diamond Loft

Customer: ${order.name}
Phone: ${order.phone}
Address: ${order.address}, ${order.city}

Items:
${itemLines}

Total: PKR ${order.total.toLocaleString()}
Payment: ${payLabel}

Please confirm this order.`;
}

export function paymentMethodLabel(method: string): string {
  switch (method) {
    case "cod":
      return "Cash on Delivery";
    case "bank":
      return "Bank Transfer";
    case "jazzcash":
      return "JazzCash";
    case "easypaisa":
      return "EasyPaisa";
    default:
      return method;
  }
}

export function validatePakistaniPhone(phone: string): boolean {
  return /^03[0-9]{2}-?[0-9]{7}$/.test(phone.trim());
}

export function badgeSlug(badge: string): string {
  return badge.toLowerCase().replace(/\s+/g, "-");
}
