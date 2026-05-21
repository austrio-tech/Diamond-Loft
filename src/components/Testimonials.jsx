import { Star } from "lucide-react";
import "./Testimonials.css";

const reviews = [
  {
    id: 1,
    name: "Ayesha R.",
    location: "Lahore",
    rating: 5,
    text: "Absolutely stunning earrings! The quality is way better than I expected. Will definitely order again.",
    product: "Golden Cascade Drop Earrings",
    avatar: "A",
  },
  {
    id: 2,
    name: "Sara M.",
    location: "Karachi",
    rating: 5,
    text: "The Crescent Moon Pendant is exactly what I wanted. Delicate, beautiful, and arrived perfectly packaged.",
    product: "Crescent Moon Pendant",
    avatar: "S",
  },
  {
    id: 3,
    name: "Hira K.",
    location: "Islamabad",
    rating: 5,
    text: "Gifted the pearl studs to my sister and she was over the moon! Fast delivery, gorgeous piece.",
    product: "Pearl & Gold Studs",
    avatar: "H",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Happy Customers</p>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        <div className="testimonials__grid">
          {reviews.map((r) => (
            <div key={r.id} className="testimonial-card">
              <div className="testimonial-card__stars">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" className="tstar" />
                ))}
              </div>
              <p className="testimonial-card__text">"{r.text}"</p>
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
