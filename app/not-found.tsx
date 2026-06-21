import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center bg-page text-ink">
      <span className="font-serif text-[5rem] font-light leading-none text-gold opacity-35">
        404
      </span>
      <h1 className="font-serif text-[1.75rem] font-normal text-ink">
        Page not found
      </h1>
      <p className="opacity-60 max-w-[36ch]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-gold text-white text-sm uppercase tracking-[0.12em] hover:bg-gold-dark transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
