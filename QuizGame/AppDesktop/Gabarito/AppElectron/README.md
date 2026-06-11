# PeR Game - Jogo de Perguntas e Respostas

Este é o projeto de um jogo de perguntas e respostas (estilo "Passa ou Repassa") feito para dois competidores ou equipes (Azul e Vermelho). O sistema combina um aplicativo para computador com um conjunto de botões físicos conectados via Arduino para garantir uma disputa justa e dinâmica.

---
**Qual nome dar ao jogo? **

- **Jo**go de **Pe**rguntas e **Re**spostas - **JoPeRe**
- **Qu**estios and **A**nsewer **G**ame - **QuAG**
- Outro?
---

## Como o jogo funciona?

1. **Apresentação da Pergunta**: A pergunta aparece na tela do computador para ambos os jogadores.
2. **Liberação dos Botões**: O apresentador libera o momento para o aperto dos botões. A luz indicadora verde acende para mostrar que a disputa começou.
3. **Quem Bater Primeiro Responde**: O jogador que apertar seu botão físico primeiro aciona um alarme sonoro (buzzer), acende sua luz indicadora e bloqueia temporariamente a resposta do adversário. A tela do computador muda para a sua cor e o cronômetro inicia.
4. **Decisão do Apresentador**:
   - **Acertou**: O apresentador clica em `Certo` no aplicativo. O jogador pontua e o jogo segue para a próxima pergunta.
   - **Errou**: O apresentador clica em `Errado`. A vez de responder passa para o adversário (o fundo da tela muda para a cor do adversário e o tempo é reiniciado).
     - **Se o adversário acertar**: Ganha os pontos da rodada.
     - **Se o adversário errar**: Ninguém ganha pontos e o apresentador exibe a resposta correta antes de avançar.
5. **Placar e Fim de Jogo**: A pontuação atual de cada jogador/time é mostrada na tela. Ao final da última pergunta, o placar final é exibido em tela cheia com animações e efeitos visuais na cor do vencedor.

---

## Onde encontrar mais informações técnicas?

Se você é programador, técnico de hardware ou quer configurar o sistema e entender como a comunicação serial funciona, consulte a **[Especificação Técnica (spec.md)](docs/spec.md)**. Lá você encontrará:
- Esquema de pinagem e lógica do Arduino.
- Protocolo de comunicação serial.
- Formato do arquivo `perguntas.json` para carregar suas próprias perguntas.