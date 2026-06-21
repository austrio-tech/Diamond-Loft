import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { Product, FeaturedConfig } from "@/types";

interface Props {
  products: Product[];
  config: FeaturedConfig;
}

export default function FeaturedProducts({ products, config }: Props) {
  return (
    <section className="bg-page py-20">
      <div className="container-site">
        {/* Ornament divider */}
        <div className="ornament mb-10">❦</div>

        {/* Section header */}
        <Reveal className="text-center mb-12">
          <p className="text-gold text-[11px] [font-variant:small-caps] tracking-[0.3em] mb-2">
            {config.label}
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-ink font-medium">
            {config.title}
          </h2>
        </Reveal>

        {/* Products grid */}
        <Stagger
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          stagger={0.08}
        >
          {products.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>

        {/* Footer CTA */}
        <Reveal className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-block border border-ink text-ink px-8 py-3 text-[12px] [font-variant:small-caps] tracking-[0.2em] hover:bg-ink hover:text-surface transition-colors"
          >
            View All Jewellery
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
