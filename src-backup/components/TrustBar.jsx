import { Truck, RefreshCw, Shield, Gift } from "lucide-react";
import "./TrustBar.css";

const perks = [
  { Icon: Truck,     title: "Free Shipping",   desc: "On orders above PKR 3,000" },
  { Icon: RefreshCw, title: "Easy Returns",    desc: "30-day hassle-free returns" },
  { Icon: Shield,    title: "100% Authentic",  desc: "Genuine gemstones & metals" },
  { Icon: Gift,      title: "Gift Wrapping",   desc: "Complimentary on every order" },
];

export default function TrustBar() {
  return (
    <section className="trust-bar">
      <div className="container">
        <div className="trust-grid">
          {perks.map(({ Icon, title, desc }) => (
            <div key={title} className="trust-item">
              <span className="trust-icon">
                <Icon size={22} />
              </span>
              <div>
                <p className="trust-title">{title}</p>
                <p className="trust-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
