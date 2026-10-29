# UP Fitness Zona Sul — site institucional

## Problema e objetivo

A UP Fitness Zona Sul (Lavras/MG) depende do Instagram para apresentar estrutura, horários e planos. Quem procura academia na Zona Sul precisa de um lugar único, rápido no celular, com endereço, horários, preços e um jeito direto de falar com a equipe.

Objetivo: levar o visitante a **agendar uma visita pelo WhatsApp** ou **assinar um plano** na página oficial de vendas.

## Público

- Moradores e trabalhadores da Zona Sul de Lavras que procuram musculação.
- Quem treina cedo (a unidade abre às 4h30 nos dias úteis) ou tarde (fecha à meia-noite).
- Usuários de Gympass/Wellhub e TotalPass.
- Pais e mães que precisam da área kids.

## Fluxos da primeira versão

1. Entender o que é a UP em 5 segundos (abertura) e ver se está aberta agora.
2. Conferir estrutura, planos, horários e endereço.
3. Agendar visita: botão de WhatsApp com mensagem pronta, ou o formulário que monta a mensagem.
4. Assinar online: cada plano leva à página oficial de vendas (Actuar).
5. Abrir a rota no Google Maps.

## MVP

Página única com: cabeçalho e menu, abertura com status de funcionamento ao vivo, estrutura, planos, unidade (endereço, horários, mapa), dúvidas frequentes, contato via WhatsApp e rodapé com créditos.

## Fora do escopo

Painel administrativo, login, pagamentos próprios, banco de dados, blog, agendamento com calendário, analytics/rastreamento, múltiplas unidades.

## Requisitos

- Só informações verificadas em fontes públicas oficiais (Instagram da unidade, página de vendas, ficha TotalPass), centralizadas em `src/content/site.ts`.
- Nenhum envio simulado: o formulário só abre o WhatsApp com o texto montado.
- WCAG 2.2 AA, teclado completo, `prefers-reduced-motion`, sem overflow de 320 a 1920 px.
- LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms (meta; ver medições em `docs/quality.md`).

## Restrições e decisões técnicas

- **Sem persistência**: o produto não grava dados. Por isso o núcleo padrão do toolkit (Drizzle + PostgreSQL, Pino, `server-only`) foi omitido, e o lint usa o perfil leve. Ver `docs/architecture.md`.
- Imagens: sem fotos autorizadas da unidade. Usamos fotos com licença aberta (Wikimedia Commons), sempre com legenda "imagem ilustrativa" ou o local real (Lavras), e créditos no rodapé.
- Logo: recriação simplificada em SVG até receber o arquivo oficial.

## Suposições e pendências

Reversíveis:
- Os valores "R$ 169,90 / 159,90 / 149,90" da página de vendas são mensais (por parcela). Exibidos como "/mês".
- A unidade Zona Sul é a única unidade com dados públicos; a página de franquias fica só como link para o Instagram da rede.

Pendentes (dependem da academia) — lista completa em `pending` de `src/content/site.ts`:
- Fotos autorizadas, logo em vetor, taxa de adesão/fidelidade, estacionamento, outras modalidades, regras da área kids, telefone secundário, divergência "24h" × horários publicados, domínio definitivo.

## Critérios de aceite

- [x] Todas as seções com conteúdo verificável e fonte registrada.
- [x] Links de WhatsApp com o número confirmado; mapa com o endereço confirmado.
- [x] Testes E2E passam (overflow nas larguras pedidas, menu, FAQ, formulário, links, axe).
- [x] `pnpm check` passa.
- [ ] Fotos e logo oficiais aprovados pela academia.
- [ ] Domínio definido para canonical/sitemap/robots.

## Próxima entrega

Receber fotos autorizadas e o logo oficial, trocar as imagens ilustrativas e confirmar as pendências comerciais antes de publicar.

## Manutenção

Mudou preço, horário ou contato? Edite só `src/content/site.ts`, atualize `checkedAt` e rode `pnpm check`.
