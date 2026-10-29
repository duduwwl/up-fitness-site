# Design e acessibilidade

## Direção

- **Ideia:** a seta do logo UP vira o único formato do site: abas das pastas da abertura, máscara das fotos, marcador das listas, recorte da faixa de fotos e o bloco final do rodapé.
- **Direção sorteada:** "One motif" (skill design-taste-frontend, seed 486314971), com paleta e tipografia da marca mantidas.
- **Abertura:** "Dê um UP" (hashtag da academia) em caixa alta condensada amarela, frase que diz o que é a academia, e uma pilha de pastas que leva às seções; a pasta da frente traz a ação principal (agendar visita) e o status "aberta agora".
- **Planos:** blocos que sobem conforme o compromisso (bimestral → anual), ou seja, quanto mais tempo, maior o bloco e menor a mensalidade.
- **O elemento vivo:** status de funcionamento calculado no fuso de São Paulo, atualizado a cada 30 s.

## Sistema

| Papel | Valor |
|---|---|
| Fundo | `#0e0e0e`, degraus `#1c1c1c`, `#2c2c2c` |
| Claros | `#ecebe6`, `#d9d8d1` |
| Acento (marca) | `#ffcb05`, escuro `#e0aa00` |
| Títulos | Barlow Condensed 800, caixa alta, entrelinha 0,92 |
| Texto | Barlow 400/600, 18 px, entrelinha 1,55 |
| Escala | hero `clamp(72px, 14vw, 184px)`, h2 `clamp(44px, 6.4vw, 92px)`, h3 28 px, corpo 18 px, pequeno 15 px |
| Margem | `clamp(16px, 4vw, 56px)`, largura máx. 1520 px |
| Botões | quadrados, cor chapada, retorno ao toque (`scale 0.98`) |

Proibido aqui: degradês, vidro/blur, sombras em repouso (exceto o menu sobreposto), rótulos acima de títulos, numeração 01/02, cards com ícone, fios finos.

## Fotos

Não há fotos autorizadas da unidade. As cinco fotos são da Wikimedia Commons (CC BY / CC BY-SA), em cores, com legenda dizendo o que são ("Imagem ilustrativa" ou o local em Lavras) e créditos no rodapé. Nenhuma é apresentada como a academia. Trocar por fotos próprias assim que a academia enviar (mesmo tratamento e máscara em seta).

## Interação

- Menu mobile: abre e fecha pelo botão ou Escape, devolve o foco ao botão e fecha ao escolher um link.
- FAQ: `<details name="faq">`, ou seja, uma resposta aberta por vez, funciona com teclado e toque; altura animada onde o navegador suporta `interpolate-size`.
- Formulário: rótulos visíveis, erro ao lado do campo, foco no primeiro erro, `aria-invalid`/`aria-describedby`; o envio abre o WhatsApp e informa isso em `role="status"`.
- Movimento: entradas escalonadas (opacidade + 24 px) uma vez por seção; `prefers-reduced-motion` remove o deslocamento; sem JS tudo fica visível.

## Layout e revisão

Testado em 320, 375, 390, 768, 1024, 1440, 1920 e 844×390 (paisagem), sem rolagem horizontal. Alvos de toque ≥ 44 px. Área segura via `env(safe-area-inset-*)`. Foco visível amarelo no escuro e preto no claro/amarelo.

## Manutenção

Novo componente segue os tokens de `globals.css` e o motivo da seta. Rode `pnpm test:e2e` e o inspetor da skill após mudanças visuais.
