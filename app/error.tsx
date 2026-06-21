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
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center bg-page text-ink">
      <h1 className="font-serif text-3xl font-normal text-gold">
        Something went wrong
      </h1>
      <p className="opacity-60 max-w-[36ch]">
        We ran into an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-8 py-3 bg-gold text-white text-sm uppercase tracking-[0.12em] hover:bg-gold-dark transition"
      >
        Try Again
      </button>
    </div>
  );
}
