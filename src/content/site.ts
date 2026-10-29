// Single source of truth for every business fact on the site.
// Each block names its public source and the date it was checked (2026-10-29).
// Anything not confirmed lives in `pending` and is NOT rendered as fact.

export const checkedAt = "2026-10-29";

export const brand = {
  name: "UP Fitness",
  unitName: "UP Fitness Zona Sul",
  hashtag: "#DêumUP",
  // Source: Instagram @upfitness_lavras bio.
  tagline:
    "Academia de musculação na Zona Sul de Lavras, com dois andares climatizados e equipamentos importados.",
};

export const contact = {
  // Source: wa.link/sj2jz1 (link in @upfitness_lavras bio) and footer of upfitness.actuar.com.
  whatsappNumber: "5535998642278",
  phoneDisplay: "(35) 99864-2278",
  instagramUnit: "https://www.instagram.com/upfitness_lavras/",
  instagramUnitHandle: "@upfitness_lavras",
  instagramFranchise: "https://www.instagram.com/upfitnessacademias/",
  instagramFranchiseHandle: "@upfitnessacademias",
  // Official online sales page linked in the unit bio.
  salesUrl: "https://upfitness.actuar.com/",
};

export const address = {
  // Source: footer of upfitness.actuar.com; matches TotalPass listing (CEP and number).
  street: "Rua Kennedy Santos, 20",
  district: "Jardim Bela Vista",
  city: "Lavras",
  state: "MG",
  postalCode: "37205-210",
  region: "Zona Sul",
  reference: "Próximo ao Depaschol e à Justiça Federal",
};

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `UP Fitness, ${address.street}, ${address.district}, ${address.city} - ${address.state}, ${address.postalCode}`,
)}`;

export type DayHours = { label: string; days: number[]; open: string; close: string };

// Source: Instagram highlight "Horários e 📲" (@upfitness_lavras) and TotalPass listing; both agree.
// days uses JS getDay(): 0 = domingo. close "24:00" means midnight.
export const hours: DayHours[] = [
  { label: "Segunda a sexta", days: [1, 2, 3, 4, 5], open: "04:30", close: "24:00" },
  { label: "Sábado", days: [6], open: "07:00", close: "18:00" },
  { label: "Domingo", days: [0], open: "08:00", close: "13:00" },
];
// Source: Instagram highlight only.
export const holidayHours = { label: "Feriados", open: "08:00", close: "20:00" };

export type Plan = {
  name: string;
  months: number;
  price: string;
  installments: number;
  listPrice: string;
};

// Source: upfitness.actuar.com ("Planos recorrentes UP Fitness"), all with free schedule ("Horários livre").
export const plans: Plan[] = [
  { name: "Bimestral", months: 2, price: "179,90", installments: 2, listPrice: "199,90" },
  { name: "Trimestral", months: 3, price: "169,90", installments: 3, listPrice: "199,90" },
  { name: "Semestral", months: 6, price: "159,90", installments: 6, listPrice: "199,90" },
  { name: "Anual", months: 12, price: "149,90", installments: 12, listPrice: "199,90" },
];

// Sources: Instagram bio (2 andares, climatizado, equipamentos importados), highlight "Área kids",
// posts of 2025-07-20 and 2025-08-05 (Gympass), TotalPass listing (armários, bebedouro, TotalPass).
export const amenities = [
  { title: "Dois andares", text: "Área de treino distribuída em dois pisos, na Zona Sul de Lavras." },
  { title: "Ambiente climatizado", text: "Treino com temperatura controlada nos dias quentes de Minas." },
  { title: "Equipamentos importados", text: "Máquinas e pesos de alto padrão para musculação." },
  { title: "Abre às 4h30", text: "De segunda a sexta, para quem treina antes do trabalho ou da aula." },
  { title: "Área kids", text: "Um canto para as crianças enquanto você treina." },
  { title: "Armários e bebedouro", text: "Guarde suas coisas e se hidrate sem sair do treino." },
  { title: "Gympass e TotalPass", text: "Os dois benefícios corporativos são aceitos na unidade." },
  { title: "Horário livre", text: "Todos os planos liberam qualquer horário de funcionamento." },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Qual é o horário de funcionamento?",
    a: "Segunda a sexta, das 4h30 à meia-noite. Sábado, das 7h às 18h. Domingo, das 8h às 13h. Em feriados, das 8h às 20h.",
  },
  {
    q: "Onde fica a academia?",
    a: "Rua Kennedy Santos, 20, Jardim Bela Vista, Zona Sul de Lavras (MG), próximo ao Depaschol e à Justiça Federal.",
  },
  {
    q: "Quais planos existem e quanto custam?",
    a: "A página oficial de vendas mostra: bimestral em 2 × R$ 179,90; trimestral por R$ 169,90 em 3 parcelas; semestral por R$ 159,90 em 6 parcelas; anual por R$ 149,90 em 12 parcelas. Todos com horário livre. Valores sujeitos a mudança; confira as condições na hora de assinar.",
  },
  {
    q: "Posso assinar pela internet?",
    a: "Sim. A página oficial de vendas da unidade permite escolher o plano e preencher o cadastro online.",
  },
  {
    q: "A UP aceita Gympass e TotalPass?",
    a: "Sim, os dois são aceitos. Pelo Gympass, a academia informa dois check-ins por dia. Confira no aplicativo se o seu plano inclui a unidade.",
  },
  {
    q: "Posso levar meu filho?",
    a: "A unidade tem uma área kids para as crianças ficarem enquanto você treina. Pergunte as regras de uso pelo WhatsApp.",
  },
  {
    q: "Como tiro outras dúvidas?",
    a: "Pelo WhatsApp (35) 99864-2278 ou pelo Instagram @upfitness_lavras.",
  },
];

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  credit: string;
  license: string;
  page: string;
};

// Openly licensed pictures (Wikimedia Commons). None of them shows the UP Fitness unit;
// captions say what each one is. Replace with authorised photos of the unit when available.
export const photos = {
  barbell: {
    src: "/up-fitness-site/images/olympic-barbell.jpg",
    width: 1920,
    height: 1043,
    alt: "Anilhas vermelhas de 25 kg presas a uma barra olímpica sobre o piso emborrachado",
    caption: "Barra olímpica com anilhas. Imagem ilustrativa.",
    credit: "Tomáš Pilík",
    license: "CC BY-SA 3.0",
    page: "https://commons.wikimedia.org/wiki/File:Olympic_barbell.jpg",
  },
  plates: {
    src: "/up-fitness-site/images/weight-plates-in-gym-20180112.jpg",
    width: 1920,
    height: 1442,
    alt: "Anilhas coloridas enfileiradas em suportes no chão",
    caption: "Anilhas em suportes. Imagem ilustrativa.",
    credit: "Wikimedia Commons",
    license: "CC BY-SA 4.0",
    page: "https://commons.wikimedia.org/wiki/File:Weight_plates_in_gym_20180112.jpg",
  },
  dumbbells: {
    src: "/up-fitness-site/images/colorful-pile-of-dumbbells-at-the-gym.jpg",
    width: 1920,
    height: 1440,
    alt: "Halteres emborrachados laranja, verdes, azuis e pretos empilhados",
    caption: "Halteres. Imagem ilustrativa.",
    credit: "Ser Amantio di Nicolao",
    license: "CC BY-SA 4.0",
    page: "https://commons.wikimedia.org/wiki/File:Colorful_pile_of_dumbbells_at_the_gym.jpg",
  },
  church: {
    src: "/up-fitness-site/images/igreja-do-rosario-lavras-minas-gerais-31469695694.jpg",
    width: 1920,
    height: 1382,
    alt: "Igreja do Rosário, casarão branco com janelas verdes, no centro de Lavras",
    caption: "Igreja do Rosário, centro de Lavras.",
    credit: "Marinelson Almeida",
    license: "CC BY 2.0",
    page: "https://commons.wikimedia.org/wiki/File:Igreja_do_Ros%C3%A1rio_-_Lavras_-_Minas_Gerais_(31469695694).jpg",
  },
  fig: {
    src: "/up-fitness-site/images/figueira-centenaria-lavras-minas-gerais-31469706774.jpg",
    width: 1920,
    height: 2880,
    alt: "Figueira centenária de galhos largos em praça arborizada de Lavras",
    caption: "Figueira centenária, Lavras.",
    credit: "Marinelson Almeida",
    license: "CC BY 2.0",
    page: "https://commons.wikimedia.org/wiki/File:Figueira_Centen%C3%A1ria_-_Lavras_Minas_Gerais_(31469706774).jpg",
  },
} satisfies Record<string, Photo>;

// Open questions for the academy before publishing. Shown nowhere on the page.
export const pending = [
  "Fotos autorizadas da unidade (fachada, andares, área kids) para substituir as imagens ilustrativas.",
  "Logotipo oficial em vetor (SVG/PDF); o site usa uma recriação simplificada.",
  "Confirmar se R$ 169,90 / R$ 159,90 / R$ 149,90 são valores por parcela mensal (a página de vendas mostra só o valor e o número de parcelas); o site exibe assim, sem '/mês'.",
  "Calendário de feriados: o status 'aberta agora' segue o horário regular e avisa 'exceto feriados'.",
  "Taxa de adesão, multa de cancelamento e regras de fidelidade dos planos recorrentes.",
  "Telefone (35) 99963-9218 aparece no TotalPass; confirmar se ainda é usado.",
  "Post de jul/2025 fala em 'estrutura 24h', mas os horários publicados vão até a meia-noite; confirmar.",
  "Condições de estacionamento (o TotalPass lista grátis, conveniado e pago ao mesmo tempo).",
  "Modalidades além de musculação (aulas coletivas, avaliação física, personal) — nada confirmado.",
  "Domínio definitivo do site, para URL canônica, sitemap e robots.",
  "Regras de uso da área kids.",
];

