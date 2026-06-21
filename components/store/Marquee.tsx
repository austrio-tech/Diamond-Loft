import type { MarqueeConfig } from "@/types";

interface Props {
  config: MarqueeConfig;
}

export default function Marquee({ config }: Props) {
  const doubled = [...config.items, ...config.items];

  return (
    <div className="bg-soft border-y border-line overflow-hidden py-3">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: flex;
          width: max-content;
          animation: marquee-scroll 32s linear infinite;
        }
      `}</style>
      <div className="marquee-inner">
        {doubled.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-4 px-8 text-[11px] [font-variant:small-caps] tracking-[0.25em] text-muted whitespace-nowrap"
          >
            <span className="text-gold text-[8px]">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
