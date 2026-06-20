import Link from "next/link";
import styles from "./InfoPage.module.css";

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
    <div className={styles.wrap}>
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link> / {title}
      </nav>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.body}>{children}</div>
    </div>
  );
}

export { styles as infoStyles };
