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
import Reveal from "@/components/motion/Reveal";

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
            return (
              <Reveal key={section.id}>
                <Hero config={section.config as HeroConfig} />
              </Reveal>
            );
          case "marquee":
            return (
              <Reveal key={section.id}>
                <Marquee config={section.config as MarqueeConfig} />
              </Reveal>
            );
          case "categoryGrid":
            return (
              <Reveal key={section.id}>
                <CategoryGrid
                  categories={categories}
                  config={section.config as CategoryGridConfig}
                />
              </Reveal>
            );
          case "featured":
            return (
              <Reveal key={section.id}>
                <FeaturedProducts
                  products={featuredProducts}
                  config={section.config as FeaturedConfig}
                />
              </Reveal>
            );
          case "trust":
            return (
              <Reveal key={section.id}>
                <TrustBar config={section.config as TrustConfig} />
              </Reveal>
            );
          case "testimonials":
            return (
              <Reveal key={section.id}>
                <Testimonials config={section.config as TestimonialsConfig} />
              </Reveal>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
