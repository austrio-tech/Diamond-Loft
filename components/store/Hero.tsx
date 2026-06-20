import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroConfig } from "@/types";

interface Props {
  config: HeroConfig;
}

export default function Hero({ config }: Props) {
  return (
    <section className="hero">
      <div className="hero__bg">
        <img
          src={config.bgImage}
          alt=""
          className="hero__bg-img"
          aria-hidden="true"
        />
        <div className="hero__overlay" />
      </div>

      <div className="hero__content container">
        <p className="hero__label">{config.label}</p>
        <h1 className="hero__title">{config.tagline}</h1>
        <p className="hero__subtitle">{config.subtitle}</p>

        <div className="hero__actions">
          <Link href={config.primaryCtaHref} className="btn btn--primary">
            {config.primaryCtaText}
            <ArrowRight size={16} />
          </Link>
          <Link href={config.secondaryCtaHref} className="btn btn--outline">
            {config.secondaryCtaText}
          </Link>
        </div>
      </div>

      <div className="hero__scroll-hint">
        <span />
      </div>
    </section>
  );
}
