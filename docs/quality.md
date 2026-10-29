# Qualidade

## Comandos e o que provam

| Comando | Prova | Não prova |
|---|---|---|
| `pnpm lint` | presets Next/TypeScript + limite de 350 linhas | comportamento |
| `pnpm lint:typed` | promessas sem `await`/mal usadas (erro) | — |
| `pnpm lint:rules` | as regras locais do ESLint funcionam (autoteste) | — |
| `pnpm typecheck` | `next typegen` + `tsc --noEmit` | — |
| `pnpm test` | horário aberto/fechado (fuso SP, meia-noite, sáb/dom), validação e texto do WhatsApp | navegador |
| `pnpm build` | build estático de produção | integrações externas |
| `pnpm check` | todos os acima, em sequência | E2E |
| `pnpm test:e2e` | no Edge: overflow em 320/375/390/768/1024/1440/1920 e 844×390; links (sem `#`, âncoras existem, externos com `noopener` e aviso de nova aba, WhatsApp com o número confirmado); âncora abaixo do cabeçalho fixo; menu mobile por teclado + Escape + retorno de foco; FAQ por teclado, um por vez; formulário (erro, foco, `aria-invalid`, URL do WhatsApp); movimento reduzido sem conteúdo oculto; status ao vivo; axe WCAG 2.2 AA em 390 e 1440 | Firefox, WebKit, aparelhos físicos |

O formulário não envia nada a servidor: o teste substitui `window.open` e confere a URL `wa.me` gerada.

## Resultados em 2026-10-29

- `pnpm check`: aprovado (8 testes unitários).
- `pnpm test:e2e`: 18/18 em 3 execuções seguidas. Uma execução logo após o build teve 5 falhas por tempo esgotado e passou ao repetir sem mudanças; se voltar a acontecer, investigar a partida a frio do servidor.
- Lighthouse 12 (laboratório, Edge headless, servidor local de produção):
  - mobile (4G simulado): desempenho 98–99, acessibilidade 100, boas práticas 100, SEO 100; LCP 2,2–2,3 s, CLS 0, TBT 30–40 ms (3 execuções).
  - desktop: 100/100/100/100; LCP 0,7 s, CLS 0.
  - INP não é medido em laboratório; TBT baixo é o indicativo. Nenhuma métrica de usuários reais (CrUX/RUM) existe ainda: site não publicado.
- Inspetor da skill design-taste-frontend (1440/768/390): 0 FAIL, 3 WARN justificados:
  - `size-count` (10 tamanhos): inclui o bloco gráfico do rodapé e o título da abertura;
  - `no-footage`: nenhum vídeo honesto da unidade; vídeo genérico de academia seria lido como da UP;
  - `off-centre`: mede o fim das linhas de texto alinhado à esquerda; o quadro (`.wrap`) é simétrico.
- Revisão independente (subagente Code Reviewer): 11 achados, todos corrigidos. Os principais: `window.open` com `noopener` sempre retornava `null` e ativava o plano B; o "/mês" afirmava algo não confirmado; borda dos campos sem contraste 3:1.
- Revisão `web-design-guidelines`: aplicados `text-wrap: balance`, `touch-action`, `color-scheme`, `translate="no"` e `autocomplete`.

## Não verificado

- Firefox e WebKit: navegadores do Playwright não instalados (a versão 1.64 pede downloads novos). Para rodar: `npx playwright install firefox webkit` e projetos extras no `playwright.config.ts`.
- Aparelhos físicos, leitores de tela reais (NVDA/VoiceOver) e zoom de navegador manual a 200% (o refluxo é coberto pelo teste de 320 px, equivalente a 400% em 1280 px).
- Links externos abertos de verdade (wa.me, Maps, Actuar, Instagram) não são seguidos pelos testes.

## Revisão de segurança

Prompt reutilizável: `docs/prompts/13-security-review.md` do Vibe Coding Toolkit, revisão `790a895304e0c08b70a5b215c9d334f1c86b816c` (https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/790a895304e0c08b70a5b215c9d334f1c86b816c/docs/prompts/13-security-review.md). Uso: colar o bloco "Prompt" no agente, na raiz deste projeto; revisão somente leitura, relatório privado. Atualizar trocando a revisão no link. Superfície atual: sem servidor, sem segredos, sem coleta de dados; o JSON-LD escapa `<`.

`pnpm audit` (2026-10-29): ver `docs/setup.md`.

## Avaliação do harness

Modo: adaptação nativa (sem CLI oficial do Harness2). Caso executado: agente em contexto limpo encontrou, só pelas instruções, o comando de verificação, a fonte de dados e a regra de pendências (resultado em `docs/setup.md`). Repetir quando `AGENTS.md` mudar: pedir a um subagente novo as mesmas três respostas.
