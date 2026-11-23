// Dados das prévias de serviços e promoções. Nada aqui é preço ou condição
// comercial real: valores ficam "Preço a definir" e a lista de promoções começa vazia.

export type Service = {
  title: string;
  description: string;
  featured: boolean;
};

export const SERVICES: Service[] = [
  {
    title: "Sites Profissionais",
    description:
      "Sites institucionais, landing pages e páginas de captação, com contato pelo WhatsApp, formulários e boa leitura em celular.",
    featured: false,
  },
  {
    title: "Sistemas SaaS",
    description:
      "Plataformas web multiusuário com painel de gestão, controle de acesso e banco de dados próprio para o seu negócio.",
    featured: true,
  },
  {
    title: "Automações com IA",
    description:
      "Fluxos que conectam sistemas, mensagens e APIs, com recursos de inteligência artificial para reduzir tarefas manuais.",
    featured: false,
  },
];

export type Promotion = {
  title: string;
  description: string;
  validUntil: string;
};

// Preencher apenas com promoções reais, aprovadas pelo responsável comercial.
export const PROMOTIONS: Promotion[] = [];
