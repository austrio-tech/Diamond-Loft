import Link from "next/link";
import type { Category, CategoryGridConfig } from "@/types";

interface Props {
  categories: Category[];
  config?: CategoryGridConfig;
}

export default function CategoryGrid({ categories, config }: Props) {
  return (
    <section className="cat-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">{config?.label ?? "Browse by Category"}</p>
          <h2 className="section-title">{config?.title ?? "Shop Our Collections"}</h2>
        </div>
        <div className="cat-grid">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`cat-card${i === 0 ? " cat-card--wide" : ""}`}
            >
              <div className="cat-card__img-wrap">
                <img src={cat.image} alt={cat.name} className="cat-card__img" />
                <div
                  className="cat-card__overlay"
                  style={{ "--accent": cat.accent } as React.CSSProperties}
                />
              </div>
              <div className="cat-card__body">
                <h3 className="cat-card__name">{cat.name}</h3>
                <p className="cat-card__desc">{cat.description}</p>
                <span className="cat-card__cta">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
