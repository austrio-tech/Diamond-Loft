import nodemailer from "nodemailer";

const ORDERS_EMAIL = process.env.ORDERS_EMAIL ?? "orders@diamondloft.pk";

/**
 * Sends an email via SMTP if SMTP_* env vars are configured.
 * If not configured, it logs the message instead of failing — so order
 * creation never breaks just because email isn't set up yet.
 */
export async function sendOrderNotification(opts: {
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;

  if (!host || !user || !pass) {
    console.log(
      `[email] SMTP not configured — skipping email to ${ORDERS_EMAIL}.\n` +
        `Subject: ${opts.subject}\n${opts.text}`
    );
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from,
      to: ORDERS_EMAIL,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
  } catch (err) {
    // Never let email failure break the order flow.
    console.error("[email] Failed to send order notification:", err);
  }
}
