import { Truck, RefreshCw, Shield, Gift, type LucideIcon } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { TrustConfig } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = { Truck, RefreshCw, Shield, Gift };

interface Props {
  config: TrustConfig;
}

export default function TrustBar({ config }: Props) {
  return (
    <section className="bg-soft border-y border-line py-10">
      <div className="container-site">
        <Stagger className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.perks.map(({ icon, title, desc }) => {
            const Icon = ICON_MAP[icon] ?? Truck;
            return (
              <StaggerItem key={title}>
                <div className="flex items-start gap-4">
                  <span className="text-gold mt-0.5 flex-shrink-0">
                    <Icon size={20} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-ink text-sm [font-variant:small-caps] tracking-wide mb-0.5 font-medium">
                      {title}
                    </p>
                    <p className="text-muted text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
