// Áreas da academia — fotos publicadas pela unidade (enviadas pelo cliente / @upfitness_lavras).
// Área sem foto confirmada fica com photos: [] e é renderizada só com texto (nada é inventado).

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
    id: "recepcao",
    label: "Recepção",
    title: "Recepção",
    intro:
      "A sua chegada na UP começa aqui: a recepção é onde você faz o check-in, tira dúvidas sobre planos e é recebido pela equipe antes de subir para o treino.",
    points: [
      { title: "Atendimento da equipe", text: "A equipe recebe você na entrada para check-in, informações e orientação sobre a estrutura." },
      { title: "Primeiro contato", text: "Ponto de partida para conhecer a academia e agendar a sua visita." },
      { title: "Ambiente climatizado", text: "Recepção climatizada, no mesmo padrão do restante da unidade." },
    ],
    photos: [],
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
