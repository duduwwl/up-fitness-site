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
  price: string;
  commitment: string;
  schedule: string;
  features: string[];
  badge?: string;
  /** Official Actuar sign-up page; plans without it keep the on-site checkout. */
  signupUrl?: string;
};

// Sign-up links sent by the client (2026-11-19); Instagram utm/fbclid params removed.
const actuarSignup = (planId: string) =>
  `https://upfitness.actuar.com/#/cadastro/d65cf624-d853-4a9d-878f-3ae3f577c26b/${planId}/6b2e8466-81a7-47d4-a85a-339aff1df529`;

// Sources: upfitness.actuar.com and the academy's published economic offer.
export const plans: Plan[] = [
  {
    name: "Econômico",
    price: "89,90",
    commitment: "Mensal",
    schedule: "Treino das 12h às 16h",
    features: ["Acesso das 12h às 16h", "Musculação nos dois andares", "Ambiente climatizado", "Equipamentos importados"],
    badge: "Menor mensalidade",
  },
  {
    name: "Bimestral",
    price: "179,90",
    commitment: "2 parcelas, 2 meses",
    schedule: "Horário livre",
    features: ["Acesso em todo o horário", "Musculação nos dois andares", "Equipamentos importados", "Ambiente climatizado"],
    signupUrl: actuarSignup("019b6a9e-84bf-7228-80c3-0006221dd287"),
  },
  {
    name: "Trimestral",
    price: "169,90",
    commitment: "3 parcelas, 3 meses",
    schedule: "Horário livre",
    features: ["Acesso em todo o horário", "Musculação nos dois andares", "Equipamentos importados", "Ambiente climatizado"],
    signupUrl: actuarSignup("84455694-9a87-43de-ad17-4fd604d7e7c1"),
  },
  {
    name: "Semestral",
    price: "159,90",
    commitment: "6 parcelas, 6 meses",
    schedule: "Horário livre",
    features: ["Acesso em todo o horário", "Musculação nos dois andares", "Equipamentos importados", "Ambiente climatizado"],
    signupUrl: actuarSignup("bbf6092c-dd9d-47a7-9cba-d8d0f33e264e"),
  },
  {
    name: "Anual",
    price: "149,90",
    commitment: "12 parcelas, 12 meses",
    schedule: "Horário livre",
    features: ["Acesso em todo o horário", "Musculação nos dois andares", "Equipamentos importados", "Ambiente climatizado"],
    badge: "Melhor custo-benefício",
    signupUrl: actuarSignup("21e8367f-4470-488a-b79d-77404e790853"),
  },
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
  { title: "Seu horário", text: "Econômico das 12h às 16h. Demais planos com horário livre." },
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
    a: "O plano econômico custa R$ 89,90 por mês para treinar das 12h às 16h. Os planos com horário livre são: bimestral por R$ 179,90, trimestral por R$ 169,90, semestral por R$ 159,90 e anual por R$ 149,90. Valores sujeitos a mudança; confira as condições na hora de assinar.",
  },
  {
    q: "Posso assinar pela internet?",
    a: "Você pode experimentar a escolha do plano e o cadastro aqui no site. O pagamento é demonstrativo: nenhuma matrícula ou cobrança será realizada. Para contratar de verdade, fale com a unidade.",
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

// Photos published by the official @upfitness_lavras profile.
export const photos = {
  dayUse: {
    src: "/up-fitness-site/images/instagram-day-use-clean.webp",
    width: 1121,
    height: 1403,
    alt: "Aluna se alongando entre os equipamentos da UP Fitness Zona Sul",
    caption: "Área de musculação da UP Fitness Zona Sul.",
    credit: "UP Fitness Lavras",
    license: "Instagram oficial; arte sobreposta removida para uso no site",
    page: "https://www.instagram.com/p/Dd4sZpCSoQU/",
  },
  tour: {
    src: "/up-fitness-site/images/instagram-tour.webp",
    width: 1080,
    height: 1917,
    alt: "Fachada da UP Fitness Zona Sul e aluna em frente à unidade",
    caption: "Tour pela UP Fitness Zona Sul.",
    credit: "UP Fitness Lavras",
    license: "Instagram oficial",
    page: "https://www.instagram.com/reel/DdRS6LAx-dT/",
  },
  parking: {
    src: "/up-fitness-site/images/up-facade-clean.webp",
    width: 1672,
    height: 941,
    alt: "Fachada e estacionamento da UP Fitness Zona Sul",
    caption: "Fachada e estacionamento da unidade.",
    credit: "UP Fitness Lavras",
    license: "Instagram oficial; edição assistida por IA para remover arte promocional",
    page: "https://www.instagram.com/p/DfFEsozRnQF/",
  },
  // Floor photos sent by the client (2026-11-19).
  upperFloor: {
    src: "/up-fitness-site/images/piso-superior.jpg",
    width: 960,
    height: 1280,
    alt: "Piso de musculação com halteres, bancos e máquinas sob teto alto na UP Fitness Zona Sul",
    caption: "Piso de treino da UP Fitness Zona Sul.",
    credit: "UP Fitness Lavras",
    license: "Foto fornecida pela academia",
    page: "https://www.instagram.com/upfitness_lavras/",
  },
  lowerFloor: {
    src: "/up-fitness-site/images/piso-inferior.jpg",
    width: 960,
    height: 1280,
    alt: "Piso com pista vermelha, gramado sintético e máquinas na UP Fitness Zona Sul",
    caption: "Pista, gramado e máquinas da UP Fitness Zona Sul.",
    credit: "UP Fitness Lavras",
    license: "Foto fornecida pela academia",
    page: "https://www.instagram.com/upfitness_lavras/",
  },
  training: {
    src: "/up-fitness-site/images/instagram-treino.webp",
    width: 720,
    height: 1280,
    alt: "Aluna treinando na esteira dentro da UP Fitness Zona Sul",
    caption: "Área de cardio da UP Fitness Zona Sul.",
    credit: "UP Fitness Lavras",
    license: "Instagram oficial",
    page: "https://www.instagram.com/reel/De2Sp1Xy_Ij/",
  },
  team: {
    src: "/up-fitness-site/images/instagram-estrutura.webp",
    width: 1080,
    height: 1918,
    alt: "Equipe da UP Fitness dentro da academia Zona Sul",
    caption: "Equipe e estrutura da UP Fitness Zona Sul.",
    credit: "UP Fitness Lavras",
    license: "Instagram oficial",
    page: "https://www.instagram.com/reel/DezRqgoR_Sc/",
  },
} satisfies Record<string, Photo>;


// Áreas da academia — fotos publicadas pela unidade (enviadas pelo cliente, 2026-11-17).
export type AreaPhoto = { src: string; width: number; height: number; alt: string };

export type Area = {
  id: string;
  label: string;
  title: string;
  intro: string;
  points: { title: string; text: string }[];
  photos: AreaPhoto[];
};

export const areas: Area[] = [
  {
    id: "kids",
    label: "Área Kids",
    title: "Área Kids",
    intro:
      "Um espaço pensado para as crianças enquanto você treina: brinquedos, mesas para atividades e um ambiente colorido e seguro, dentro da unidade.",
    points: [
      { title: "Sempre acompanhada", text: "A área fica dentro da academia, de vista do piso de treino — pergunte as regras de uso pelo WhatsApp." },
      { title: "Feita para brincar", text: "Tenda, jogos de chão, mesas e cadeiras no tamanho deles e paredes ilustradas para entreter enquanto você treina." },
      { title: "Piso emborrachado", text: "Piso de borracha preta, macio e antiderrapante, pensado para o movimento das crianças." },
    ],
    photos: [
      { src: "/up-fitness-site/images/area-kids.jpg", width: 960, height: 1280, alt: "Área kids da UP Fitness com tenda, mesas infantis e mural colorido" },
    ],
  },
  {
    id: "convivencia",
    label: "Área de Convivência",
    title: "Área de Convivência",
    intro:
      "Antes ou depois do treino, um espaço para respirar: sofás e poltronas, mesas para sentar, café e um ambiente climatizado para conversar ou esperar.",
    points: [
      { title: "Sofás e mesas", text: "Poltronas, sofás e mesas para sentar com calma antes ou depois do treino." },
      { title: "Cantinho do café", text: "Espaço com dispensador e xícaras para se servir enquanto conversa." },
      { title: "Sala de avaliação", text: "Sala reservada para avaliações e atendimento, ao lado da convivência." },
    ],
    photos: [
      { src: "/up-fitness-site/images/convivencia-1.jpg", width: 900, height: 1600, alt: "Poltronas e tapete da área de convivência da UP Fitness" },
      { src: "/up-fitness-site/images/convivencia-2.jpg", width: 900, height: 1600, alt: "Mesas com cadeiras e sofás da área de convivência, com parede verde UP ao fundo" },
      { src: "/up-fitness-site/images/convivencia-3.jpg", width: 901, height: 1600, alt: "Aparador com dispenser de café e quadros na área de convivência" },
    ],
  },
];

// Estacionamento — foto oficial da fachada (Instagram @upfitness_lavras, arte promocional removida).
export const parkingInfo = {
  title: "Estacionamento próprio",
  intro:
    "A UP Fitness Zona Sul tem estacionamento próprio, gratuito para alunos. Você chega, estaciona na frente da unidade e entra direto para o treino — sem procurar vaga na rua e sem pagar nada a mais por isso.",
  points: [
    { title: "Gratuito para alunos", text: "Vaga reservada para quem treina na UP, sem custo adicional em nenhum plano." },
    { title: "Na porta da academia", text: "Estacionamento próprio em frente à fachada da unidade, na Zona Sul de Lavras." },
    { title: "Sem estresse", text: "Chegue perto do horário do seu treino: vaga garantida dentro do pátio da academia." },
  ],
  photo: {
    src: "/up-fitness-site/images/up-facade-clean.webp",
    width: 1672,
    height: 941,
    alt: "Estacionamento próprio da UP Fitness Zona Sul, em frente à fachada da academia",
  } as AreaPhoto,
};

// Equipamentos — importados, fato confirmado na bio oficial e nos planos.
export const equipmentInfo = {
  title: "Equipamentos importados",
  intro:
    "O piso de musculação da UP é montado com equipamentos importados de alto padrão: máquinas de linha, pesos organizados por faixa e cartões explicativos em cada estação — nos dois andares.",
  points: [
    { title: "Importados", text: "Máquinas e pesos de alto padrão, importados, em todo o piso de musculação." },
    { title: "Dois andares de treino", text: "A musculação se distribui em dois pisos climatizados, sem espera por aparelho." },
    { title: "Cardio completo", text: "Esteiras e área de cardio para aquecer ou fechar o treino." },
  ],
  photos: [
    { src: "/up-fitness-site/images/equip-1.jpg", width: 965, height: 891, alt: "Máquinas de musculação importadas na UP Fitness" },
    { src: "/up-fitness-site/images/equip-2.jpg", width: 960, height: 1280, alt: "Piso de treino com equipamentos importados na UP Fitness" },
    { src: "/up-fitness-site/images/equip-3.jpg", width: 1254, height: 891, alt: "Vista ampla do piso de musculação com equipamentos importados" },
    { src: "/up-fitness-site/images/equip-4.jpg", width: 960, height: 1280, alt: "Equipamentos de musculação importados em detalhe" },
    { src: "/up-fitness-site/images/equip-5.jpg", width: 1254, height: 891, alt: "Sala de musculação da UP Fitness com máquinas importadas e pista vermelha" },
  ] as AreaPhoto[],
};

// Open questions for the academy before publishing. Shown nowhere on the page.
export const pending = [
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