import Link from "next/link";
import Reveal from "@/components/motion/Reveal";

export default function InfoPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-[820px] mx-auto px-6 py-20 pb-28">
        {/* Breadcrumb */}
        <nav className="text-[12px] text-muted mb-6">
          <Link href="/" className="text-gold-dark hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>{title}</span>
        </nav>

        <Reveal>
          <h1 className="font-serif text-[clamp(2rem,5vw,2.8rem)] font-medium text-ink mb-2 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted text-[15px] mb-10">{subtitle}</p>
          )}
          {!subtitle && <div className="mb-10" />}
        </Reveal>

        {/* Hairline divider */}
        <div className="w-16 h-px bg-gold mb-10" />

        <div
          className={[
            /* h2 */
            "[&_h2]:font-serif [&_h2]:text-[1.6rem] [&_h2]:font-medium [&_h2]:text-ink [&_h2]:mt-9 [&_h2]:mb-3",
            /* h3 */
            "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-6 [&_h3]:mb-2",
            /* p & li */
            "[&_p]:text-muted [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:mb-3",
            "[&_li]:text-muted [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:mb-2",
            /* ul */
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4",
            /* strong */
            "[&_strong]:text-ink [&_strong]:font-semibold",
            /* a */
            "[&_a]:text-gold-dark [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-gold",
            /* table */
            "[&_table]:w-full [&_table]:border-collapse [&_table]:text-[14px] [&_table]:my-4",
            "[&_th]:text-left [&_th]:p-3 [&_th]:border [&_th]:border-line [&_th]:bg-soft [&_th]:font-semibold [&_th]:text-ink",
            "[&_td]:text-left [&_td]:p-3 [&_td]:border [&_td]:border-line [&_td]:text-ink",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
