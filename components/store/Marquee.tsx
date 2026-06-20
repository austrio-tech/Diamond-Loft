import type { MarqueeConfig } from "@/types";

interface Props {
  config: MarqueeConfig;
}

export default function Marquee({ config }: Props) {
  const doubled = [...config.items, ...config.items];

  return (
    <div className="marquee-bar">
      <div className="marquee-track">
        {doubled.map((item, index) => (
          <span key={index} className="marquee-item">
            <span className="marquee-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
