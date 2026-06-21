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
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25d366] text-white rounded-full px-4 py-3 shadow-card-hover hover:shadow-card transition-all duration-300"
    >
      <MessageCircle size={22} fill="currentColor" strokeWidth={0} />
      <span className="text-xs [font-variant:small-caps] tracking-wide font-medium hidden group-hover:inline transition-all">
        Chat with us
      </span>
    </a>
  );
}
