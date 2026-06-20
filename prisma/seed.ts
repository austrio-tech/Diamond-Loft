import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    id: "earrings",
    name: "Earrings",
    slug: "earrings",
    description: "Statement drops, hoops & studs for every occasion.",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    accent: "#c9a96e",
    sortOrder: 0,
  },
  {
    id: "pendants",
    name: "Pendants",
    slug: "pendants",
    description: "Delicate charms and bold statement necklaces.",
    image:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80",
    accent: "#b5838d",
    sortOrder: 1,
  },
  {
    id: "bracelets",
    name: "Bracelets",
    slug: "bracelets",
    description: "Stack them up or wear solo — pure elegance.",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    accent: "#6d6875",
    sortOrder: 2,
  },
  {
    id: "ear-tops",
    name: "Ear Tops",
    slug: "ear-tops",
    description: "Minimalist studs that speak volumes.",
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
    accent: "#a8927a",
    sortOrder: 3,
  },
];

const products = [
  {
    id: 1,
    categoryId: "earrings",
    name: "Golden Cascade Drop Earrings",
    price: 2499,
    originalPrice: 3200,
    image:
      "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    ],
    badge: "Sale",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    description:
      "Handcrafted 18k gold-plated cascade drops that catch the light beautifully. Lightweight and comfortable for all-day wear.",
    material: "18K Gold Plated Brass",
    weight: "6g",
    size: "6 cm drop",
  },
  {
    id: 2,
    categoryId: "earrings",
    name: "Pearl Halo Hoops",
    price: 1899,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80",
    ],
    badge: "New",
    rating: 4.6,
    reviews: 58,
    inStock: true,
    featured: true,
    description:
      "Classic pearl-encrusted hoops with a modern twist — the perfect everyday luxury.",
    material: "Sterling Silver, Freshwater Pearls",
    weight: "5g",
    size: "3 cm diameter",
  },
  {
    id: 3,
    categoryId: "earrings",
    name: "Rose Quartz Dangle Earrings",
    price: 1599,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    ],
    badge: null,
    rating: 4.7,
    reviews: 89,
    inStock: true,
    featured: false,
    description:
      "Natural rose quartz paired with gold-fill findings. Each stone is unique.",
    material: "Gold-Fill, Natural Rose Quartz",
    weight: "4g",
    size: "5 cm drop",
  },
  {
    id: 4,
    categoryId: "earrings",
    name: "Celestial Star Drops",
    price: 2199,
    originalPrice: 2800,
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    ],
    badge: "Sale",
    rating: 4.9,
    reviews: 201,
    inStock: true,
    featured: false,
    description:
      "CZ-studded star motif drops that bring a night-sky vibe to any outfit.",
    material: "925 Sterling Silver, Cubic Zirconia",
    weight: "7g",
    size: "4.5 cm drop",
  },
  {
    id: 5,
    categoryId: "pendants",
    name: "Crescent Moon Pendant",
    price: 1799,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80",
    ],
    badge: "Bestseller",
    rating: 4.9,
    reviews: 312,
    inStock: true,
    featured: true,
    description:
      'A dainty crescent moon on a 16" gold chain. Minimalist and timeless.',
    material: "18K Gold Plated 925 Silver",
    weight: "3g",
    size: '1.5 cm charm, 16" chain',
  },
  {
    id: 6,
    categoryId: "pendants",
    name: "Solitaire Diamond Pendant",
    price: 5999,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=800&q=80",
    ],
    badge: "Premium",
    rating: 5.0,
    reviews: 45,
    inStock: true,
    featured: true,
    description:
      "A 0.25ct lab-grown diamond solitaire set in 18k white gold. Arrives gift-boxed.",
    material: "18K White Gold, Lab Diamond",
    weight: "2.5g",
    size: '0.8 cm pendant, 18" chain',
  },
  {
    id: 7,
    categoryId: "pendants",
    name: "Floral Enamel Locket",
    price: 2299,
    originalPrice: 2800,
    image:
      "https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=800&q=80",
    ],
    badge: "Sale",
    rating: 4.5,
    reviews: 67,
    inStock: true,
    featured: false,
    description:
      "Vintage-inspired enamel locket with a secret compartment. Holds two photos.",
    material: "Gold Plated Brass, Enamel",
    weight: "8g",
    size: '2 cm locket, 18" chain',
  },
  {
    id: 8,
    categoryId: "pendants",
    name: "Heart Birthstone Pendant",
    price: 1999,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    ],
    badge: "New",
    rating: 4.7,
    reviews: 93,
    inStock: false,
    featured: false,
    description:
      "Personalized heart pendant set with your choice of birthstone. A perfect gift.",
    material: "Sterling Silver, Semi-precious Stone",
    weight: "4g",
    size: '1.8 cm pendant, 16" chain',
  },
  {
    id: 9,
    categoryId: "bracelets",
    name: "Gold Tennis Bracelet",
    price: 4999,
    originalPrice: 6500,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    ],
    badge: "Sale",
    rating: 4.9,
    reviews: 178,
    inStock: true,
    featured: true,
    description:
      "Classic CZ tennis bracelet in 18k gold plating. Secure lobster clasp, 18cm.",
    material: "18K Gold Plated Brass, CZ",
    weight: "12g",
    size: "18 cm (adjustable)",
  },
  {
    id: 10,
    categoryId: "bracelets",
    name: "Charm & Pearl Stack Set",
    price: 2799,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=800&q=80",
    ],
    badge: "New",
    rating: 4.6,
    reviews: 54,
    inStock: true,
    featured: true,
    description:
      "Set of 3 stackable bracelets — pearl strand, gold chain, and CZ charm band.",
    material: "Sterling Silver, Freshwater Pearls",
    weight: "10g",
    size: "17–20 cm (adjustable)",
  },
  {
    id: 11,
    categoryId: "bracelets",
    name: "Delicate Infinity Bangle",
    price: 1499,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    ],
    badge: null,
    rating: 4.5,
    reviews: 112,
    inStock: true,
    featured: false,
    description:
      "A sleek open bangle with an infinity symbol — wear alone or layered.",
    material: "925 Sterling Silver",
    weight: "5g",
    size: "6 cm inner diameter (open)",
  },
  {
    id: 12,
    categoryId: "bracelets",
    name: "Evil Eye Beaded Bracelet",
    price: 999,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80",
    ],
    badge: "Bestseller",
    rating: 4.8,
    reviews: 287,
    inStock: true,
    featured: false,
    description:
      "Handstrung blue evil eye and crystal bead bracelet. Adjustable cord closure.",
    material: "Glass Beads, Crystal, Cord",
    weight: "6g",
    size: "Adjustable 15–20 cm",
  },
  {
    id: 13,
    categoryId: "ear-tops",
    name: "Classic Diamond Studs",
    price: 3499,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    ],
    badge: "Bestseller",
    rating: 5.0,
    reviews: 432,
    inStock: true,
    featured: true,
    description:
      "0.5ct each lab-grown diamond studs in platinum-plated silver. Timeless everyday studs.",
    material: "Platinum Plated Silver, Lab Diamond",
    weight: "1.5g per stud",
    size: "5 mm",
  },
  {
    id: 14,
    categoryId: "ear-tops",
    name: "Pearl & Gold Studs",
    price: 1299,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80",
    ],
    badge: "New",
    rating: 4.7,
    reviews: 76,
    inStock: true,
    featured: true,
    description:
      "Lustrous 7mm freshwater pearl studs in 18k gold. A wardrobe staple.",
    material: "18K Gold, Freshwater Pearl",
    weight: "1g per stud",
    size: "7 mm pearl",
  },
  {
    id: 15,
    categoryId: "ear-tops",
    name: "Tiny Heart Studs",
    price: 799,
    originalPrice: 1200,
    image:
      "https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1573408301185-9519eb23f93f?w=800&q=80",
    ],
    badge: "Sale",
    rating: 4.6,
    reviews: 198,
    inStock: true,
    featured: false,
    description:
      "Mini heart studs with a brushed gold finish. Cute and understated.",
    material: "18K Gold Plated 925 Silver",
    weight: "0.8g per stud",
    size: "6 mm",
  },
  {
    id: 16,
    categoryId: "ear-tops",
    name: "Moonstone Cabochon Studs",
    price: 1799,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    ],
    badge: null,
    rating: 4.8,
    reviews: 143,
    inStock: true,
    featured: false,
    description:
      "Adularescent moonstone cabochons set in a bezel of sterling silver. Ethereal glow.",
    material: "925 Sterling Silver, Natural Moonstone",
    weight: "1.5g per stud",
    size: "8 mm",
  },
];

const sections = [
  {
    id: "hero",
    type: "hero",
    enabled: true,
    sortOrder: 0,
    config: {
      label: "New Collection 2025",
      tagline: "Elegance Crafted for You",
      subtitle:
        "Discover handcrafted jewellery — earrings, pendants, bracelets & ear tops designed to make every moment shine.",
      primaryCtaText: "Shop Now",
      primaryCtaHref: "/shop",
      secondaryCtaText: "Explore Earrings",
      secondaryCtaHref: "/category/earrings",
      bgImage:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=85",
    },
  },
  {
    id: "marquee",
    type: "marquee",
    enabled: true,
    sortOrder: 1,
    config: {
      items: [
        "Free Shipping on orders above PKR 3,000",
        "Handcrafted with Love",
        "30-Day Easy Returns",
        "Authentic Gemstones & Metals",
        "Gift Wrapping Available",
        "New Arrivals Every Week",
      ],
    },
  },
  {
    id: "categoryGrid",
    type: "categoryGrid",
    enabled: true,
    sortOrder: 2,
    config: {
      label: "Browse by Category",
      title: "Shop Our Collections",
    },
  },
  {
    id: "featured",
    type: "featured",
    enabled: true,
    sortOrder: 3,
    config: {
      label: "Handpicked for You",
      title: "Featured Pieces",
    },
  },
  {
    id: "trust",
    type: "trust",
    enabled: true,
    sortOrder: 4,
    config: {
      perks: [
        { icon: "Truck", title: "Free Shipping", desc: "On orders above PKR 3,000" },
        { icon: "RefreshCw", title: "Easy Returns", desc: "30-day hassle-free returns" },
        { icon: "Shield", title: "100% Authentic", desc: "Genuine gemstones & metals" },
        { icon: "Gift", title: "Gift Wrapping", desc: "Complimentary on every order" },
      ],
    },
  },
  {
    id: "testimonials",
    type: "testimonials",
    enabled: true,
    sortOrder: 5,
    config: {
      label: "Happy Customers",
      title: "What Our Customers Say",
      reviews: [
        {
          name: "Ayesha R.",
          location: "Lahore",
          rating: 5,
          text: "Absolutely stunning earrings! The quality is way better than I expected. Will definitely order again.",
          product: "Golden Cascade Drop Earrings",
          avatar: "A",
        },
        {
          name: "Sara M.",
          location: "Karachi",
          rating: 5,
          text: "The Crescent Moon Pendant is exactly what I wanted. Delicate, beautiful, and arrived perfectly packaged.",
          product: "Crescent Moon Pendant",
          avatar: "S",
        },
        {
          name: "Hira K.",
          location: "Islamabad",
          rating: 5,
          text: "Gifted the pearl studs to my sister and she was over the moon! Fast delivery, gorgeous piece.",
          product: "Pearl & Gold Studs",
          avatar: "H",
        },
      ],
    },
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }
  console.log(`✓ ${categories.length} categories`);

  // Products
  for (const p of products) {
    const { images, ...rest } = p;
    const data = { ...rest, images: JSON.stringify(images) };
    await prisma.product.upsert({
      where: { id: p.id },
      update: data,
      create: data,
    });
  }
  console.log(`✓ ${products.length} products`);

  // Sections
  for (const s of sections) {
    const data = {
      id: s.id,
      type: s.type,
      enabled: s.enabled,
      sortOrder: s.sortOrder,
      config: JSON.stringify(s.config),
    };
    await prisma.section.upsert({
      where: { id: s.id },
      update: data,
      create: data,
    });
  }
  console.log(`✓ ${sections.length} sections`);

  // Admin user — credentials come from env. In dev, a default is used and a
  // loud warning is printed. The cleartext password is never logged.
  const email = process.env.ADMIN_EMAIL ?? "admin@diamondloft.pk";
  const rawPassword = process.env.ADMIN_PASSWORD;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && !rawPassword) {
    throw new Error(
      "ADMIN_PASSWORD env var is required when seeding in production."
    );
  }

  const password = rawPassword ?? "changeme123";
  const hash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, password: hash },
  });

  if (!rawPassword) {
    console.log(
      `⚠️  admin user seeded with DEV default password for ${email}.\n` +
        `    Set ADMIN_EMAIL / ADMIN_PASSWORD env vars for a custom credential,\n` +
        `    and change this password immediately after first login.`
    );
  } else {
    console.log(`✓ admin user: ${email} (password from ADMIN_PASSWORD)`);
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
