import "./Marquee.css";

const items = [
  "Free Shipping on orders above PKR 3,000",
  "Handcrafted with Love",
  "30-Day Easy Returns",
  "Authentic Gemstones & Metals",
  "Gift Wrapping Available",
  "New Arrivals Every Week",
];

export default function Marquee() {
  return (
    <div className="marquee-bar">
      <div className="marquee-track">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" /> {text}
          </span>
        ))}
      </div>
    </div>
  );
}
