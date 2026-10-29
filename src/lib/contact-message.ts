export const interests = [
  "Conhecer a academia",
  "Planos e valores",
  "Gympass ou TotalPass",
  "Outro assunto",
] as const;

export const periods = ["Manhã", "Tarde", "Noite", "Tanto faz"] as const;

export type ContactInput = { name: string; interest: string; period: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const NAME_MAX = 60;
export const MESSAGE_MAX = 300;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  if (name.length < 2) errors.name = "Escreva seu nome (mínimo de 2 letras).";
  else if (name.length > NAME_MAX) errors.name = `Use até ${NAME_MAX} caracteres.`;
  if (!(interests as readonly string[]).includes(input.interest)) errors.interest = "Escolha um assunto.";
  if (!(periods as readonly string[]).includes(input.period)) errors.period = "Escolha um período.";
  if (input.message.trim().length > MESSAGE_MAX) errors.message = `Use até ${MESSAGE_MAX} caracteres.`;
  return errors;
}

/** Text that pre-fills the WhatsApp chat. Nothing is sent or stored by the site. */
export function buildContactMessage(input: ContactInput) {
  const lines = [
    `Olá! Meu nome é ${input.name.trim()}.`,
    `Assunto: ${input.interest}.`,
    `Melhor período para visitar: ${input.period.toLowerCase()}.`,
  ];
  const message = input.message.trim();
  if (message) lines.push(message);
  return lines.join("\n");
}
