import { Truck, RefreshCw, Shield, Gift, type LucideIcon } from "lucide-react";
import type { TrustConfig } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = { Truck, RefreshCw, Shield, Gift };

interface Props {
  config: TrustConfig;
}

export default function TrustBar({ config }: Props) {
  return (
    <section className="trust-bar">
      <div className="container">
        <div className="trust-grid">
          {config.perks.map(({ icon, title, desc }) => {
            const Icon = ICON_MAP[icon] ?? Truck;
            return (
              <div key={title} className="trust-item">
                <span className="trust-icon">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="trust-title">{title}</p>
                  <p className="trust-desc">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
