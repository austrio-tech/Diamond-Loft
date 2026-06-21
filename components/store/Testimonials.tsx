import { Star } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { TestimonialsConfig } from "@/types";

interface Props {
  config: TestimonialsConfig;
}

export default function Testimonials({ config }: Props) {
  return (
    <section className="bg-page py-20">
      <div className="container-site">
        {/* Ornament */}
        <div className="ornament mb-10">❦</div>

        {/* Header */}
        <Reveal className="text-center mb-12">
          <p className="text-gold text-[11px] [font-variant:small-caps] tracking-[0.3em] mb-2">
            {config.label}
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-ink font-medium">
            {config.title}
          </h2>
        </Reveal>

        {/* Reviews grid */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.reviews.map((r, idx) => (
            <StaggerItem key={idx}>
              <div className="bg-surface border border-line rounded-card p-6 shadow-card flex flex-col gap-4">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      fill="currentColor"
                      className="text-gold"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-ink text-[15px] leading-relaxed font-serif italic">
                  &ldquo;{r.text}&rdquo;
                </p>

                {/* Footer */}
                <div className="flex items-center gap-3 pt-2 border-t border-line mt-auto">
                  <div className="w-8 h-8 rounded-full bg-soft border border-line flex items-center justify-center text-gold text-sm font-serif">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-ink text-sm font-medium leading-none">
                      {r.name}
                    </p>
                    <p className="text-muted text-[11px] mt-0.5">
                      {r.location} · {r.product}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
