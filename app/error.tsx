"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
        background: "var(--color-bg, #faf9f7)",
        color: "var(--color-text, #2c2c2c)",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          color: "var(--color-gold, #b8963e)",
        }}
      >
        Something went wrong
      </h1>
      <p style={{ opacity: 0.6, maxWidth: "36ch" }}>
        We ran into an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "0.75rem 2rem",
          background: "var(--color-gold, #b8963e)",
          color: "#fff",
          border: "none",
          borderRadius: "2px",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
