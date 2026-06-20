import { MessageCircle } from "lucide-react";
import { STORE_INFO } from "../data/db";
import "./WhatsAppButton.css";

export default function WhatsAppButton() {
  const number = STORE_INFO.whatsapp.replace(/\D/g, "");
  const message = encodeURIComponent(
    "Hi! I'm interested in your jewellery. Can you help me?"
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-btn"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} fill="currentColor" />
      <span className="wa-btn__tooltip">Chat with us</span>
    </a>
  );
}
