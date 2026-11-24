export const navItems = [
  { href: "#estrutura", label: "Estrutura" },
  { href: "#areas", label: "Áreas" },
  { href: "#equipamentos", label: "Equipamentos" },
  { href: "#atendimento", label: "Atendimento" },
  { href: "#estacionamento", label: "Estacionamento" },
  { href: "#planos", label: "Planos" },
  { href: "#unidade", label: "Unidade" },
  { href: "#avaliacoes", label: "Feedbacks" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
];

// Header shows a shorter list; the footer keeps every section.
const headerHrefs = new Set(["#estrutura", "#equipamentos", "#planos", "#duvidas"]);
export const headerNavItems = navItems.filter((item) => headerHrefs.has(item.href));
