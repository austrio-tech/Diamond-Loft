"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SectionsManager.module.css";
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
    <div className={styles.configGrid}>
      {fields.map(({ key, label }) => (
        <div className={styles.configField} key={key}>
          <label className={styles.configLabel}>{label}</label>
          <input
            className={styles.configInput}
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
        <div className={styles.listItem} key={idx}>
          <input
            className={styles.listItemInput}
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
            className={styles.removeBtn}
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
        className={styles.addBtn}
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
    <div className={styles.configGrid}>
      <div className={styles.configField}>
        <label className={styles.configLabel}>Label</label>
        <input
          className={styles.configInput}
          type="text"
          value={config.label}
          onChange={(e) => {
            const value = e.target.value;
            onChange((cfg) => ({ ...cfg, label: value }));
          }}
        />
      </div>
      <div className={styles.configField}>
        <label className={styles.configLabel}>Title</label>
        <input
          className={styles.configInput}
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
  const updatePerk = (
    perkIdx: number,
    key: keyof TrustPerk,
    value: string
  ) => {
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
        <div className={styles.perkCard} key={idx}>
          <div className={styles.configGrid}>
            <div className={styles.configField}>
              <label className={styles.configLabel}>Icon</label>
              <input
                className={styles.configInput}
                type="text"
                value={perk.icon}
                onChange={(e) => updatePerk(idx, "icon", e.target.value)}
              />
            </div>
            <div className={styles.configField}>
              <label className={styles.configLabel}>Title</label>
              <input
                className={styles.configInput}
                type="text"
                value={perk.title}
                onChange={(e) => updatePerk(idx, "title", e.target.value)}
              />
            </div>
            <div className={styles.configField} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.configLabel}>Description</label>
              <input
                className={styles.configInput}
                type="text"
                value={perk.desc}
                onChange={(e) => updatePerk(idx, "desc", e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: "8px" }}>
            <button
              className={styles.removeBtn}
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
        className={styles.addBtn}
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
      <div className={styles.configGrid} style={{ marginBottom: "16px" }}>
        <div className={styles.configField}>
          <label className={styles.configLabel}>Label</label>
          <input
            className={styles.configInput}
            type="text"
            value={config.label}
            onChange={(e) => {
              const value = e.target.value;
              onChange((cfg) => ({ ...cfg, label: value }));
            }}
          />
        </div>
        <div className={styles.configField}>
          <label className={styles.configLabel}>Title</label>
          <input
            className={styles.configInput}
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
        <div className={styles.reviewCard} key={idx}>
          <div className={styles.configGrid}>
            <div className={styles.configField}>
              <label className={styles.configLabel}>Name</label>
              <input
                className={styles.configInput}
                type="text"
                value={review.name}
                onChange={(e) => updateReview(idx, "name", e.target.value)}
              />
            </div>
            <div className={styles.configField}>
              <label className={styles.configLabel}>Location</label>
              <input
                className={styles.configInput}
                type="text"
                value={review.location}
                onChange={(e) => updateReview(idx, "location", e.target.value)}
              />
            </div>
            <div className={styles.configField}>
              <label className={styles.configLabel}>Rating</label>
              <input
                className={styles.configInput}
                type="number"
                min={1}
                max={5}
                value={review.rating}
                onChange={(e) =>
                  updateReview(idx, "rating", Number(e.target.value))
                }
              />
            </div>
            <div className={styles.configField}>
              <label className={styles.configLabel}>Product</label>
              <input
                className={styles.configInput}
                type="text"
                value={review.product}
                onChange={(e) => updateReview(idx, "product", e.target.value)}
              />
            </div>
            <div className={styles.configField}>
              <label className={styles.configLabel}>Avatar URL</label>
              <input
                className={styles.configInput}
                type="text"
                value={review.avatar}
                onChange={(e) => updateReview(idx, "avatar", e.target.value)}
              />
            </div>
            <div className={styles.configField} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.configLabel}>Review Text</label>
              <textarea
                className={styles.configTextarea}
                rows={3}
                value={review.text}
                onChange={(e) => updateReview(idx, "text", e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: "8px" }}>
            <button
              className={styles.removeBtn}
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
        className={styles.addBtn}
        type="button"
        onClick={() =>
          onChange((cfg) => ({
            ...cfg,
            reviews: [
              ...cfg.reviews,
              {
                name: "",
                location: "",
                rating: 5,
                text: "",
                product: "",
                avatar: "",
              },
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
            onChange={(updater) =>
              onConfigChange<MarqueeConfig>(index, updater)
            }
          />
        );
      case "featured":
        return (
          <LabelTitleEditor<FeaturedConfig>
            config={section.config as FeaturedConfig}
            onChange={(updater) =>
              onConfigChange<FeaturedConfig>(index, updater)
            }
          />
        );
      case "categoryGrid":
        return (
          <LabelTitleEditor<CategoryGridConfig>
            config={section.config as CategoryGridConfig}
            onChange={(updater) =>
              onConfigChange<CategoryGridConfig>(index, updater)
            }
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
            onChange={(updater) =>
              onConfigChange<TestimonialsConfig>(index, updater)
            }
          />
        );
    }
  };

  return (
    <div className={styles.sectionCard}>
      <div
        className={styles.sectionHeader}
        onClick={() => setExpanded((v) => !v)}
      >
        <span className={styles.sectionTitle}>{section.type}</span>
        <div className={styles.toggleRow} onClick={(e) => e.stopPropagation()}>
          <label className={styles.configLabel} style={{ margin: 0 }}>
            {section.enabled ? "Enabled" : "Disabled"}
          </label>
          <input
            className={styles.enableToggle}
            type="checkbox"
            checked={section.enabled}
            onChange={() => onToggle(index)}
          />
          <button
            className={styles.addBtn}
            type="button"
            onClick={() => setExpanded((v) => !v)}
            style={{ marginLeft: "8px" }}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>
      {expanded && (
        <div className={styles.sectionBody}>{renderEditor()}</div>
      )}
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Sections</h1>
        <button
          className={styles.saveBtn}
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
