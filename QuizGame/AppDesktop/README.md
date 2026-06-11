# Módulo Software: Aplicativo Desktop (Electron)

Este diretório contém a estrutura do aplicativo desktop responsável por gerenciar a pontuação, carregar as perguntas, cronometrar as respostas e exibir a interface para os jogadores e o apresentador.

---

## 🎮 Funcionamento e Regras do Jogo

O fluxo do jogo é comandado pelo apresentador através da tela do aplicativo:

1. **Seleção de Tempo:** O apresentador define o tempo limite da rodada através do menu do jogo.
2. **Exibição da Pergunta:** A pergunta é carregada na tela.
3. **Disputa:** Os botões são liberados e o app aguarda o sinal serial do Arduino.
4. **Bloqueio:** O primeiro jogador a bater bloqueia a tela na sua respectiva cor (Vermelho ou Azul) e inicia a contagem de tempo regressiva (ex: 15 ou 30 segundos).
5. **Julgamento:** O apresentador seleciona se o jogador respondeu corretamente:
   * **Certo:** O jogador ganha o ponto e a rodada se encerra.
   * **Errado:** A tela muda para a cor do adversário, reiniciando o cronômetro para que o oponente tenha a chance de responder. Se o oponente errar também, ninguém pontua nesta rodada.
6. **Reinicialização:** Ao avançar para a próxima pergunta, o aplicativo envia automaticamente `"L\n"` para o Arduino e aguarda o sinal de `"PRONTO"` para reativar as disputas de botões físicos.
7. **Fim de Jogo:** O placar final é exibido em tela cheia com animação de confete para o vencedor.

---

## 📝 Formato do Arquivo de Perguntas (`perguntas.json`)

As perguntas e respostas são carregadas a partir de um arquivo chamado `perguntas.json`, localizado no mesmo diretório do executável principal do jogo.

O formato deve seguir rigorosamente a estrutura abaixo:

```json
[
  {
    "pergunta": "Qual é a capital do Brasil?",
    "respostas": [
      "São Paulo",
      "Rio de Janeiro",
      "Brasília",
      "Salvador"
    ],
    "respostaCorreta": 2
  }
]
```

### ⚠️ Regras Importantes para o Cadastro:
* A chave `respostaCorreta` utiliza **indexação base zero**. Ou seja:
  * `0` representa a primeira opção ("São Paulo")
  * `1` representa a segunda opção ("Rio de Janeiro")
  * `2` representa a terceira opção ("Brasília")
  * `3` representa a quarta opção ("Salvador")

---

## 🔌 Integração Serial com Node.js

Para ler as mensagens enviadas pelo Arduino no aplicativo desktop, utiliza-se a biblioteca `serialport` do Node.js:

1. **Conexão:** O aplicativo tenta escanear e conectar-se automaticamente a portas de comunicação válidas (ex: `COM3`, `COM4` no Windows, ou `/dev/ttyUSB0`, `/dev/ttyACM0` no Linux).
2. **Parser de Linha:** Como o Arduino finaliza suas mensagens com quebra de linha, o software lê os dados usando o `ReadLineParser`:
   ```javascript
   const { SerialPort } = require('serialport');
   const { ReadlineParser } = require('@serialport/parser-readline');

   const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
   const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

   parser.on('data', (data) => {
     if (data === 'AZUL') {
       // Ativa lógica do lado Azul
     } else if (data === 'VERMELHO') {
       // Ativa lógica do lado Vermelho
     }
   });
   ```

---

## 🎨 Protótipo e Layout (Pasta Gabarito)

A pasta [Gabarito](file:///home/rpb/Repositórios/TEI_4301_26/PeR_Game/AppDesktop/Gabarito) contém a estrutura base estática de layout do jogo com HTML5 e CSS3:
* **[index.html](file:///home/rpb/Repositórios/TEI_4301_26/PeR_Game/AppDesktop/Gabarito/index.html):** Contém os elementos de estrutura (pergunta, alternativas, cronômetro, placar).
* **[style.css](file:///home/rpb/Repositórios/TEI_4301_26/PeR_Game/AppDesktop/Gabarito/style.css):** Define o esquema de cores dinâmicas de fundo (classes `.padrao`, `.vermelho` e `.azul`) para sinalizar as ações no jogo.
