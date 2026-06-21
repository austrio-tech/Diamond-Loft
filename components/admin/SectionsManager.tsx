"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Section,
  SectionConfig,
  HeroConfig,
  MarqueeConfig,
  FeaturedConfig,
  CategoryGridConfig,
  TrustConfig,
  TrustPerk,
  TestimonialsConfig,
  TestimonialEntry,
} from "@/types";

interface Props {
  sections: Section[];
}

function updateSection<T extends SectionConfig>(
  prev: Section[],
  index: number,
  updater: (cfg: T) => T
): Section[] {
  return prev.map((s, i) =>
    i === index ? { ...s, config: updater(s.config as T) } : s
  );
}

const inputCls =
  "w-full border border-line rounded px-3 py-2 text-sm text-ink bg-page focus:outline-none focus:border-gold transition-colors";
const labelCls = "text-xs uppercase tracking-[0.2em] text-muted mb-1 block";

// ── Hero Editor ───────────────────────────────────────────────────────────────

function HeroEditor({
  config,
  onChange,
}: {
  config: HeroConfig;
  onChange: (updater: (cfg: HeroConfig) => HeroConfig) => void;
}) {
  const fields: { key: keyof HeroConfig; label: string }[] = [
    { key: "label", label: "Label" },
    { key: "tagline", label: "Tagline" },
    { key: "subtitle", label: "Subtitle" },
    { key: "primaryCtaText", label: "Primary CTA Text" },
    { key: "primaryCtaHref", label: "Primary CTA Href" },
    { key: "secondaryCtaText", label: "Secondary CTA Text" },
    { key: "secondaryCtaHref", label: "Secondary CTA Href" },
    { key: "bgImage", label: "Background Image" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map(({ key, label }) => (
        <div className="flex flex-col" key={key}>
          <label className={labelCls}>{label}</label>
          <input
            className={inputCls}
            type="text"
            value={config[key]}
            onChange={(e) => {
              const value = e.target.value;
              onChange((cfg) => ({ ...cfg, [key]: value }));
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Marquee Editor ────────────────────────────────────────────────────────────

function MarqueeEditor({
  config,
  onChange,
}: {
  config: MarqueeConfig;
  onChange: (updater: (cfg: MarqueeConfig) => MarqueeConfig) => void;
}) {
  return (
    <div>
      {config.items.map((item, idx) => (
        <div className="flex gap-2 mb-2" key={idx}>
          <input
            className={`${inputCls} flex-1`}
            type="text"
            value={item}
            onChange={(e) => {
              const value = e.target.value;
              onChange((cfg) => {
                const items = [...cfg.items];
                items[idx] = value;
                return { ...cfg, items };
              });
            }}
          />
          <button
            className="px-3 py-1.5 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            type="button"
            onClick={() =>
              onChange((cfg) => ({
                ...cfg,
                items: cfg.items.filter((_, i) => i !== idx),
              }))
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="px-3 py-1.5 text-xs border border-line rounded text-muted hover:bg-soft mt-1 transition-colors"
        type="button"
        onClick={() =>
          onChange((cfg) => ({ ...cfg, items: [...cfg.items, ""] }))
        }
      >
        + Add Item
      </button>
    </div>
  );
}

// ── Featured / CategoryGrid Editor ───────────────────────────────────────────

function LabelTitleEditor<T extends FeaturedConfig | CategoryGridConfig>({
  config,
  onChange,
}: {
  config: T;
  onChange: (updater: (cfg: T) => T) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col">
        <label className={labelCls}>Label</label>
        <input
          className={inputCls}
          type="text"
          value={config.label}
          onChange={(e) => {
            const value = e.target.value;
            onChange((cfg) => ({ ...cfg, label: value }));
          }}
        />
      </div>
      <div className="flex flex-col">
        <label className={labelCls}>Title</label>
        <input
          className={inputCls}
          type="text"
          value={config.title}
          onChange={(e) => {
            const value = e.target.value;
            onChange((cfg) => ({ ...cfg, title: value }));
          }}
        />
      </div>
    </div>
  );
}

// ── Trust Editor ──────────────────────────────────────────────────────────────

function TrustEditor({
  config,
  onChange,
}: {
  config: TrustConfig;
  onChange: (updater: (cfg: TrustConfig) => TrustConfig) => void;
}) {
  const updatePerk = (perkIdx: number, key: keyof TrustPerk, value: string) => {
    onChange((cfg) => {
      const perks = cfg.perks.map((p, i) =>
        i === perkIdx ? { ...p, [key]: value } : p
      );
      return { ...cfg, perks };
    });
  };

  return (
    <div>
      {config.perks.map((perk, idx) => (
        <div className="bg-soft rounded p-3 mb-3 border border-line" key={idx}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className={labelCls}>Icon</label>
              <input
                className={inputCls}
                type="text"
                value={perk.icon}
                onChange={(e) => updatePerk(idx, "icon", e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className={labelCls}>Title</label>
              <input
                className={inputCls}
                type="text"
                value={perk.title}
                onChange={(e) => updatePerk(idx, "title", e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className={labelCls}>Description</label>
              <input
                className={inputCls}
                type="text"
                value={perk.desc}
                onChange={(e) => updatePerk(idx, "desc", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-2">
            <button
              className="px-3 py-1.5 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              type="button"
              onClick={() =>
                onChange((cfg) => ({
                  ...cfg,
                  perks: cfg.perks.filter((_, i) => i !== idx),
                }))
              }
            >
              Remove Perk
            </button>
          </div>
        </div>
      ))}
      <button
        className="px-3 py-1.5 text-xs border border-line rounded text-muted hover:bg-soft mt-1 transition-colors"
        type="button"
        onClick={() =>
          onChange((cfg) => ({
            ...cfg,
            perks: [...cfg.perks, { icon: "", title: "", desc: "" }],
          }))
        }
      >
        + Add Perk
      </button>
    </div>
  );
}

// ── Testimonials Editor ───────────────────────────────────────────────────────

function TestimonialsEditor({
  config,
  onChange,
}: {
  config: TestimonialsConfig;
  onChange: (updater: (cfg: TestimonialsConfig) => TestimonialsConfig) => void;
}) {
  const updateReview = (
    reviewIdx: number,
    key: keyof TestimonialEntry,
    value: string | number
  ) => {
    onChange((cfg) => {
      const reviews = cfg.reviews.map((r, i) =>
        i === reviewIdx ? { ...r, [key]: value } : r
      );
      return { ...cfg, reviews };
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label className={labelCls}>Label</label>
          <input
            className={inputCls}
            type="text"
            value={config.label}
            onChange={(e) => {
              const value = e.target.value;
              onChange((cfg) => ({ ...cfg, label: value }));
            }}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelCls}>Title</label>
          <input
            className={inputCls}
            type="text"
            value={config.title}
            onChange={(e) => {
              const value = e.target.value;
              onChange((cfg) => ({ ...cfg, title: value }));
            }}
          />
        </div>
      </div>

      {config.reviews.map((review, idx) => (
        <div className="bg-soft rounded p-3 mb-3 border border-line" key={idx}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className={labelCls}>Name</label>
              <input
                className={inputCls}
                type="text"
                value={review.name}
                onChange={(e) => updateReview(idx, "name", e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className={labelCls}>Location</label>
              <input
                className={inputCls}
                type="text"
                value={review.location}
                onChange={(e) => updateReview(idx, "location", e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className={labelCls}>Rating</label>
              <input
                className={inputCls}
                type="number"
                min={1}
                max={5}
                value={review.rating}
                onChange={(e) => updateReview(idx, "rating", Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label className={labelCls}>Product</label>
              <input
                className={inputCls}
                type="text"
                value={review.product}
                onChange={(e) => updateReview(idx, "product", e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className={labelCls}>Avatar URL</label>
              <input
                className={inputCls}
                type="text"
                value={review.avatar}
                onChange={(e) => updateReview(idx, "avatar", e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className={labelCls}>Review Text</label>
              <textarea
                className={`${inputCls} resize-y`}
                rows={3}
                value={review.text}
                onChange={(e) => updateReview(idx, "text", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-2">
            <button
              className="px-3 py-1.5 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              type="button"
              onClick={() =>
                onChange((cfg) => ({
                  ...cfg,
                  reviews: cfg.reviews.filter((_, i) => i !== idx),
                }))
              }
            >
              Remove Review
            </button>
          </div>
        </div>
      ))}

      <button
        className="px-3 py-1.5 text-xs border border-line rounded text-muted hover:bg-soft mt-1 transition-colors"
        type="button"
        onClick={() =>
          onChange((cfg) => ({
            ...cfg,
            reviews: [
              ...cfg.reviews,
              { name: "", location: "", rating: 5, text: "", product: "", avatar: "" },
            ],
          }))
        }
      >
        + Add Review
      </button>
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({
  section,
  index,
  onToggle,
  onConfigChange,
}: {
  section: Section;
  index: number;
  onToggle: (index: number) => void;
  onConfigChange: <T extends SectionConfig>(
    index: number,
    updater: (cfg: T) => T
  ) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const renderEditor = () => {
    switch (section.type) {
      case "hero":
        return (
          <HeroEditor
            config={section.config as HeroConfig}
            onChange={(updater) => onConfigChange<HeroConfig>(index, updater)}
          />
        );
      case "marquee":
        return (
          <MarqueeEditor
            config={section.config as MarqueeConfig}
            onChange={(updater) => onConfigChange<MarqueeConfig>(index, updater)}
          />
        );
      case "featured":
        return (
          <LabelTitleEditor<FeaturedConfig>
            config={section.config as FeaturedConfig}
            onChange={(updater) => onConfigChange<FeaturedConfig>(index, updater)}
          />
        );
      case "categoryGrid":
        return (
          <LabelTitleEditor<CategoryGridConfig>
            config={section.config as CategoryGridConfig}
            onChange={(updater) => onConfigChange<CategoryGridConfig>(index, updater)}
          />
        );
      case "trust":
        return (
          <TrustEditor
            config={section.config as TrustConfig}
            onChange={(updater) => onConfigChange<TrustConfig>(index, updater)}
          />
        );
      case "testimonials":
        return (
          <TestimonialsEditor
            config={section.config as TestimonialsConfig}
            onChange={(updater) => onConfigChange<TestimonialsConfig>(index, updater)}
          />
        );
    }
  };

  return (
    <div className="bg-surface border border-line rounded-card mb-4 overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-soft border-b border-line transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="font-medium text-ink uppercase tracking-[0.1em] text-sm">
          {section.type}
        </span>
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="text-xs uppercase tracking-[0.1em] text-muted cursor-pointer">
            {section.enabled ? "Enabled" : "Disabled"}
          </label>
          <input
            className="w-4 h-4 accent-amber-600"
            type="checkbox"
            checked={section.enabled}
            onChange={() => onToggle(index)}
          />
          <button
            className="ml-2 px-3 py-1 text-xs border border-line rounded text-muted hover:bg-soft transition-colors"
            type="button"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>
      {expanded && <div className="p-4">{renderEditor()}</div>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SectionsManager({ sections }: Props) {
  const router = useRouter();
  const [localSections, setLocalSections] = useState<Section[]>(sections);
  const [saving, setSaving] = useState(false);

  const handleToggle = (index: number) => {
    setLocalSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleConfigChange = <T extends SectionConfig>(
    index: number,
    updater: (cfg: T) => T
  ) => {
    setLocalSections((prev) => updateSection<T>(prev, index, updater));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          localSections.map((s) => ({
            id: s.id,
            enabled: s.enabled,
            sortOrder: s.sortOrder,
            config: s.config,
          }))
        ),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-ink">Sections</h1>
        <button
          className="px-5 py-2 bg-ink-deep text-gold text-sm rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
          type="button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save All Changes"}
        </button>
      </div>

      {localSections.map((section, index) => (
        <SectionCard
          key={section.id}
          section={section}
          index={index}
          onToggle={handleToggle}
          onConfigChange={handleConfigChange}
        />
      ))}
    </div>
  );
}
