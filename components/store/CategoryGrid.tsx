import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { Category, CategoryGridConfig } from "@/types";

interface Props {
  categories: Category[];
  config?: CategoryGridConfig;
}

export default function CategoryGrid({ categories, config }: Props) {
  return (
    <section className="bg-surface py-20 border-y border-line">
      <div className="container-site">
        {/* Section header */}
        <Reveal className="text-center mb-12">
          <p className="text-gold text-[11px] [font-variant:small-caps] tracking-[0.3em] mb-2">
            {config?.label ?? "Browse by Category"}
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-ink font-medium">
            {config?.title ?? "Shop Our Collections"}
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <StaggerItem key={cat.id}>
              <Link
                href={`/category/${cat.slug}`}
                className={[
                  "group relative overflow-hidden block border border-line rounded-card",
                  i === 0 ? "lg:col-span-2 lg:row-span-2" : "",
                ].join(" ")}
              >
                <div
                  className={[
                    "overflow-hidden",
                    i === 0 ? "aspect-[4/3]" : "aspect-[3/4]",
                  ].join(" ")}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover sepia-img transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent"
                    style={{ "--accent": cat.accent } as React.CSSProperties}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-[#f1e6cf]">
                  <h3 className="font-serif text-xl leading-tight mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] [font-variant:small-caps] tracking-[0.2em] text-[#e9dec8] opacity-80">
                    {cat.description}
                  </p>
                  <span className="mt-2 inline-block text-gold text-[11px] [font-variant:small-caps] tracking-widest group-hover:text-[#e4cfa3] transition-colors">
                    Shop Now →
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
