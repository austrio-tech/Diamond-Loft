import { MessageCircle } from "lucide-react";
import { STORE_INFO } from "@/lib/utils";

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hi! I'm interested in your jewellery. Can you help me?"
  );
  const href = `https://wa.me/${STORE_INFO.whatsappClean}?text=${message}`;
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
