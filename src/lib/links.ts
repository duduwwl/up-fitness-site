import { contact } from "@/content/site";

export function whatsappUrl(text: string) {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const visitMessage = "Olá! Vi o site e quero conhecer a UP Fitness Zona Sul.";
