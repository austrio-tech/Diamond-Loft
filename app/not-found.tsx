import Link from "next/link";

export default function NotFound() {
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
      <p
        style={{
          fontSize: "5rem",
          fontFamily: "var(--font-serif)",
          fontWeight: 300,
          lineHeight: 1,
          color: "var(--color-gold, #b8963e)",
          opacity: 0.35,
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "1.75rem",
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
        }}
      >
        Page not found
      </h1>
      <p style={{ opacity: 0.6, maxWidth: "36ch" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          padding: "0.75rem 2rem",
          background: "var(--color-gold, #b8963e)",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "2px",
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
