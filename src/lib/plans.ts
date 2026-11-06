import { plans } from "@/content/site";

export function planSlug(name: string): string {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
export function getPlanBySlug(slug: string | null) {
  return plans.find((plan) => planSlug(plan.name) === slug);
}
