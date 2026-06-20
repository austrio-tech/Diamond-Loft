import { Star } from "lucide-react";
import type { TestimonialsConfig } from "@/types";

interface Props {
  config: TestimonialsConfig;
}

export default function Testimonials({ config }: Props) {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <p className="section-label">{config.label}</p>
          <h2 className="section-title">{config.title}</h2>
        </div>
        <div className="testimonials__grid">
          {config.reviews.map((r, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-card__stars">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="currentColor"
                    className="tstar"
                  />
                ))}
              </div>
              <p className="testimonial-card__text">&ldquo;{r.text}&rdquo;</p>
              <div className="testimonial-card__footer">
                <div className="testimonial-card__avatar">{r.avatar}</div>
                <div>
                  <p className="testimonial-card__name">{r.name}</p>
                  <p className="testimonial-card__meta">
                    {r.location} · {r.product}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
