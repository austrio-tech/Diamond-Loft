"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, transition } from "@/lib/motion";
import type { HeroConfig } from "@/types";

interface Props {
  config: HeroConfig;
}

export default function Hero({ config }: Props) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center text-center overflow-hidden">
      {/* Background image + sepia veil */}
      <img
        src={config.bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover sepia-img"
        style={{ filter: "sepia(0.35) contrast(0.95) brightness(0.88)" }}
      />
      <div className="absolute inset-0 bg-[rgba(30,24,16,0.44)]" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-5 flex flex-col items-center">
        {/* Gold hairline rule */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ ...transition.base, delay: 0.1 }}
          className="w-14 h-px bg-gold mb-6"
        />

        {/* Small-caps eyebrow */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ ...transition.base, delay: 0.2 }}
          className="text-[#e4cfa3] text-[12px] [font-variant:small-caps] tracking-[0.35em] mb-5"
        >
          {config.label}
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ ...transition.base, delay: 0.32 }}
          className="font-serif text-[clamp(2.6rem,7vw,4.2rem)] font-normal leading-[1.08] text-[#f7efe0]"
        >
          {config.tagline}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ ...transition.base, delay: 0.44 }}
          className="mt-5 mb-8 max-w-md text-[17px] text-[#eaded0] leading-relaxed"
        >
          {config.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ ...transition.base, delay: 0.56 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href={config.primaryCtaHref}
            className="inline-block border border-[#e4cfa3] text-[#f7efe0] px-8 py-3 text-[12px] [font-variant:small-caps] tracking-[0.2em] hover:bg-[#e4cfa3] hover:text-ink transition-colors"
          >
            {config.primaryCtaText}
          </Link>
          <Link
            href={config.secondaryCtaHref}
            className="inline-block border border-[rgba(228,207,163,0.45)] text-[#e4cfa3] px-8 py-3 text-[12px] [font-variant:small-caps] tracking-[0.2em] hover:border-[#e4cfa3] transition-colors"
          >
            {config.secondaryCtaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
