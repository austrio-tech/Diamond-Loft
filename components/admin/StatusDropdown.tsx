"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { OrderStatus } from "@/types";
import styles from "./StatusDropdown.module.css";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// dot color per status
const COLORS: Record<OrderStatus, string> = {
  pending: "#c9a96e",
  confirmed: "#2f80ed",
  shipped: "#8e6fd6",
  delivered: "#1a7a40",
  cancelled: "#c0392b",
};

interface Props {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
  busy?: boolean;
}

export default function StatusDropdown({ value, onChange, busy }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        style={{ borderColor: COLORS[value] }}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={busy}
        onClick={() => setOpen((p) => !p)}
      >
        <span className={styles.dot} style={{ background: COLORS[value] }} />
        <span className={styles.label}>{LABELS[value]}</span>
        <ChevronDown size={14} className={styles.chevron} />
      </button>
      {open && (
        <div className={styles.menu} role="listbox">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              role="option"
              aria-selected={s === value}
              className={styles.item}
              onClick={() => {
                setOpen(false);
                if (s !== value) onChange(s);
              }}
            >
              <span className={styles.dot} style={{ background: COLORS[s] }} />
              <span className={styles.label}>{LABELS[s]}</span>
              {s === value && <Check size={14} className={styles.check} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
