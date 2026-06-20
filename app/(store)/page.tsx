import { getSections, getCategories, getProducts } from "@/lib/data";
import type {
  HeroConfig,
  MarqueeConfig,
  CategoryGridConfig,
  FeaturedConfig,
  TrustConfig,
  TestimonialsConfig,
} from "@/types";
import Hero from "@/components/store/Hero";
import Marquee from "@/components/store/Marquee";
import CategoryGrid from "@/components/store/CategoryGrid";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import TrustBar from "@/components/store/TrustBar";
import Testimonials from "@/components/store/Testimonials";

export default async function HomePage() {
  const [sections, categories, featuredProducts] = await Promise.all([
    getSections(true),
    getCategories(),
    getProducts({ featured: true }),
  ]);

  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return <Hero key={section.id} config={section.config as HeroConfig} />;
          case "marquee":
            return <Marquee key={section.id} config={section.config as MarqueeConfig} />;
          case "categoryGrid":
            return (
              <CategoryGrid
                key={section.id}
                categories={categories}
                config={section.config as CategoryGridConfig}
              />
            );
          case "featured":
            return (
              <FeaturedProducts
                key={section.id}
                products={featuredProducts}
                config={section.config as FeaturedConfig}
              />
            );
          case "trust":
            return <TrustBar key={section.id} config={section.config as TrustConfig} />;
          case "testimonials":
            return (
              <Testimonials key={section.id} config={section.config as TestimonialsConfig} />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
