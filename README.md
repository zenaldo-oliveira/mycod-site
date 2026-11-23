# MyCod | Site comercial

A MyCod desenvolve sites, sistemas web e automações para pequenas e médias empresas. Neste site, o visitante pode conhecer as soluções, consultar planos e custos, explorar projetos reais e montar um pedido de orçamento para enviar pelo WhatsApp. O formulário de contato oferece um segundo canal de atendimento.

[Visitar mycod.com.br](https://mycod.com.br)

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Apresentação da MyCod, demonstração, projetos, etapas e contato |
| `/services` | Soluções por necessidade e segmento, incluindo serviços locais e barbearias |
| `/plans` | Planos, valores de implantação e mensalidade, adicionais e custos externos |
| `/how-it-works` | Etapas da contratação e perguntas frequentes |
| `/projects` | Portfólio de projetos reais |
| `/about` | Empresa, fundador e tecnologias utilizadas |
| `/build` | Configurador de orçamento com resumo para envio pelo WhatsApp |
| `/contact` | Formulário de contato e acesso ao WhatsApp |

As rotas antigas `/skills` e `/certificates` redirecionam permanentemente para `/about#tecnologias` e `/about`, respectivamente. Os redirecionamentos estão em `next.config.ts`.

## Desenvolvimento

O projeto usa **Next.js 16 com App Router, React 19 e TypeScript em modo estrito**. A interface usa Tailwind CSS v4, utilitários do shadcn/ui, Motion, Embla, Lucide e React Icons. O formulário registra contatos no Supabase. Os testes de ponta a ponta usam Playwright.

Com **Node.js 20 ou superior**, execute:

```bash
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Variáveis de ambiente

Crie um `.env.local` na raiz do projeto e mantenha-o fora do Git.

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase que recebe os contatos |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave opcional de uso exclusivo do servidor. Quando definida, é usada no lugar da chave pública no fluxo de contatos |
| `WHATSAPP_PROVIDER` | Seleção do provedor de notificações |
| `LEAD_NOTIFICATION_WHATSAPP` | Número da equipe que recebe as notificações de novos contatos |

**WhatsApp:** os links de orçamento abrem uma conversa para o visitante enviar a mensagem. Os avisos automáticos do formulário são outro fluxo e ainda funcionam em modo de simulação. A integração real com a Z-API está pendente em `lib/whatsapp/zApiWhatsAppService.ts`.

### Onde editar

| Caminho | O que editar |
| --- | --- |
| `lib/catalog/` | Ofertas, planos, adicionais e preços. Use `null` para exibir **Solicitar proposta** quando o preço ainda estiver pendente |
| `lib/i18n/dictionaries/commercial/` | Textos comerciais em português, inglês e espanhol, vinculados aos IDs do catálogo |
| `lib/projects/data.ts` | Dados dos projetos do portfólio |
| `public/projects/screenshots/` | Capturas dos projetos |
| `lib/site.ts` | Nome, domínio canônico e navegação compartilhada |
| `app/globals.css` | Tokens visuais e temas claro e escuro |
| `components/` | Componentes de páginas, layout e interface |
| `app/api/leads/` | Validação, registro de contatos e aviso à equipe |

### Build e testes

| Comando | Finalidade |
| --- | --- |
| `npm run build` | Gerar o build de produção |
| `npm run start` | Servir o build localmente |
| `npm run lint` | Executar o ESLint |
| `npx tsc --noEmit` | Verificar os tipos |
| `npm run test:e2e` | Rodar Playwright contra o build na porta `3920` |
| `npm run test:e2e:build` | Gerar o build e rodar os testes em sequência |

Os testes estão em `e2e/`. No Windows, usam o Microsoft Edge instalado. Nos demais sistemas, instale o Chromium com `npx playwright install chromium`. As pastas `playwright-report/` e `test-results/` ficam fora do Git.

## Publicação

O projeto de produção é `zenaldos-projects/mycod` na Vercel. O repositório da vitrine é [`zenaldo-oliveira/mycod-site`](https://github.com/zenaldo-oliveira/mycod-site).

- **Deploy manual:** em uma pasta vinculada ao projeto correto, execute `npx vercel@latest deploy --prod`.
- **Deploy automático:** vincule `mycod-site` ao projeto na Vercel e configure `main` como branch de produção.

O `SITE_URL` em `lib/site.ts` define o domínio usado no canonical, no sitemap e no `robots.txt`. Se ainda estiver apontando para `https://www.zenaldodev.com.br`, atualize-o para o endereço principal da MyCod antes de concluir a migração. Depois do deploy, confira o canonical da home, `/sitemap.xml` e `/robots.txt`.
