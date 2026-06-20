import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import type { Product, FeaturedConfig } from "@/types";

interface Props {
  products: Product[];
  config: FeaturedConfig;
}

export default function FeaturedProducts({ products, config }: Props) {
  return (
    <section className="featured">
      <div className="container">
        <div className="section-header">
          <p className="section-label">{config.label}</p>
          <h2 className="section-title">{config.title}</h2>
        </div>
        <div className="featured__grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="featured__footer">
          <Link href="/shop" className="btn btn--dark">
            View All Jewellery
          </Link>
        </div>
      </div>
    </section>
  );
}
