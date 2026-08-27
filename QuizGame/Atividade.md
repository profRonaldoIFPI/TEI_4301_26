# 📚 Guia de Tecnologias e Conceitos Aplicados — QuizGame

Este documento apresenta a fundamentação teórica, tecnologias e conceitos da engenharia de software e sistemas embarcados aplicados no projeto **QuizGame**. Ele serve como base para a elaboração de **atividades teóricas, roteiros de aula e avaliações em sala de aula**.

---

## 📑 Sumário de Conteúdos

1. [Módulo Hardware: Sistemas Embarcados & C++ (Arduino)](#1-módulo-hardware-sistemas-embarcados--c-arduino)
   - [1.1. Interrupções de Hardware (External Interrupts & ISR)](#11-interrupções-de-hardware-external-interrupts--isr)
   - [1.2. Qualificador de Tipo `volatile` e Concorrência](#12-qualificador-de-tipo-volatile-e-concorrência)
   - [1.3. Comunicação Serial Asíncrona (UART / Serial)](#13-comunicação-serial-asíncrona-uart--serial)
   - [1.4. Resistor Pull-up Interno (`INPUT_PULLUP`) e Debounce](#14-resistor-pull-up-interno-input_pullup-e-debounce)
   - [1.5. Modulação por Largura de Pulso (PWM) e Espaço de Cores RGB](#15-modulação-por-largura-de-pulso-pwm-e-espaço-de-cores-rgb)
   - [1.6. Temporização sem Bloqueio com `millis()` e Síntese Sonora (`tone`)](#16-temporização-sem-bloqueio-com-millis-e-síntese-sonora-tone)
2. [Módulo Software: Aplicação Desktop & Web (Electron / Node.js)](#2-módulo-software-aplicação-desktop--web-electron--nodejs)
   - [2.1. Arquitetura do Electron (Main Process e Renderer Process)](#21-arquitetura-do-electron-main-process-e-renderer-process)
   - [2.2. Menus Nativos e Teclas de Atalho (`accelerator`)](#22-menus-nativos-e-teclas-de-atalho-accelerator)
   - [2.3. Comunicação I/O Assíncrona e Stream Parser Serial](#23-comunicação-io-assíncrona-e-stream-parser-serial)
   - [2.4. Estruturação de Dados com JSON](#24-estruturação-de-dados-com-json)
   - [2.5. Layout Responsivo com CSS Grid e Unidades de Viewport (`vmin`)](#25-layout-responsivo-com-css-grid-e-unidades-de-viewport-vmin)
   - [2.6. Semântica HTML5](#26-semântica-html5)
3. [📝 Banco de Questões Teóricas para Sala de Aula](#3--banco-de-questões-teóricas-para-sala-de-aula)

---

## 1. Módulo Hardware: Sistemas Embarcados & C++ (Arduino)

### 1.1. Interrupções de Hardware (External Interrupts & ISR)

* **Conceito Teórico:** Em sistemas de tempo real ou jogos de reflexo rápido, a técnica tradicional de *polling* (leitura repetitiva do estado do pino dentro de um loop principal) é ineficiente e pode causar atrasos (*latency*) se o processador estiver ocupado executando outras rotinas. A **Interrupção de Hardware** paralisa temporariamente o fluxo normal de execução do microcontrolador imediatamente após a detecção de um sinal elétrico no pino configurado, executando uma **ISR (Interrupt Service Routine)**.
- **Borda de Descida (`FALLING`):** O disparo ocorre no momento exato em que o pino passa do nível lógico ALTO (`5V`) para BAIXO (`0V`).
- **Exemplo no Projeto ([main.cpp](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/Arduino/src/main.cpp#L28-L62)):**

```cpp
// Rotina de Interrupção do Jogador Azul
void ISR_azul() {
  if (!jogo_travado) {
    vencedor_azul = true;
    jogo_travado = true; // Trava imediata para impedir que o oponente pontue
  }
}

// Rotina de Interrupção do Jogador Vermelho
void ISR_vermelho() {
  if (!jogo_travado) {
    vencedor_vermelho = true;
    jogo_travado = true;
  }
}

void setup() {
  // Associa os pinos de interrupção 2 (INT0) e 3 (INT1) às suas ISRs no evento FALLING
  attachInterrupt(digitalPinToInterrupt(btn_azul), ISR_azul, FALLING);
  attachInterrupt(digitalPinToInterrupt(btn_vermelho), ISR_vermelho, FALLING);
}
```

---

### 1.2. Qualificador de Tipo `volatile` e Concorrência

* **Conceito Teórico:** O compilador C++ tenta otimizar acessos a variáveis armazenando seus valores em registradores do processador. No entanto, variáveis que são modificadas assincronamente por uma interrupção (ISR) fora do fluxo normal do `loop()` podem ter seus valores desatualizados se lidas de registradores otimizados. O qualificador `volatile` instrui o compilador a sempre ler e escrever a variável diretamente na memória RAM principal.
- **Exemplo no Projeto ([main.cpp](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/Arduino/src/main.cpp#L19-L23)):**

```cpp
// Variáveis voláteis: alteradas dentro da ISR e lidas no loop()
volatile bool vencedor_azul = false;
volatile bool vencedor_vermelho = false;
volatile bool jogo_travado = false; // Evita que um jogador aperte após o outro já ter ganhado
```

---

### 1.3. Comunicação Serial Asíncrona (UART / Serial)

* **Conceito Teórico:** A comunicação UART transmite dados bit a bit de forma assíncrona entre o microcontrolador e o computador. No projeto, define-se um **protocolo de aplicação baseado em caracteres ASCII**:
  - **Arduino $\rightarrow$ PC:** Transmite `"AZUL\r\n"` ou `"VERMELHO\r\n"` quando um jogador pressiona o botão primeiro.
  - **PC $\rightarrow$ Arduino:** Envia o comando `"LIBERAR\n"` ou `"L\n"` para resetar o estado dos LEDs e destravar o jogo.
- **Exemplo no Projeto ([main.cpp](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/Arduino/src/main.cpp#L65-L87)):**

```cpp
void loop() {
  // Verifica se há dados recebidos pela porta Serial
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim(); // Remove caracteres de controle (\r, \n e espaços)

    // Comando enviado pelo software Desktop para liberar nova rodada
    if (input.equalsIgnoreCase("L") || input.equalsIgnoreCase("LIBERAR")) {
      digitalWrite(led_azul, LOW);
      digitalWrite(led_vermelho, LOW);

      vencedor_azul = false;
      vencedor_vermelho = false;
      jogo_travado = false;

      Serial.println("PRONTO"); // Confirmação de recebimento para o computador
    }
  }
}
```

---

### 1.4. Resistor Pull-up Interno (`INPUT_PULLUP`) e Debounce

* **Conceito Teórico:**
  - **Floating Pin:** Um pino de entrada digital sem referência definida flutua entre `0V` e `5V` devido a ruídos eletromagnéticos.
  - **Pull-up Interno:** O modo `INPUT_PULLUP` ativa o resistor interno conectado a `$V_{CC}$` (`5V`), mantendo o pino em nível lógico `HIGH` por padrão. Ao pressionar o botão (conectado ao `$GND$`), o nível lógico cai para `LOW` (*Active-Low*).
  - **Debouncing:** Botões mecânicos geram ruídos elétricos (trepidações) durante os milissegundos da pressão. O código aguarda a estabilização e a soltura do botão.
- **Exemplo no Projeto ([main.cpp](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/Arduino/src/main.cpp#L47-L48) e [main.cpp](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/Arduino/src/main.cpp#L94-L98)):**

```cpp
// Configuração no setup()
pinMode(btn_azul, INPUT_PULLUP);
pinMode(btn_vermelho, INPUT_PULLUP);

// Tratamento de soltura e debounce no loop()
while (digitalRead(btn_azul) == LOW) {
  delay(10); // Aguarda o jogador soltar o botão
}
delay(100); // Retardo de estabilização do sinal (debounce)
```

---

### 1.5. Modulação por Largura de Pulso (PWM) e Espaço de Cores RGB

* **Conceito Teórico:** Pinos digitais só fornecem `$0V$` ou `$5V$`. A técnica de **PWM (Pulse Width Modulation)** varia a razão cíclica (*duty cycle*) do sinal em alta frequência para simular tensões intermediárias. O projeto converte um valor angular de matiz (*Hue* de 0 a 255) em intensidades dos canais **Red, Green e Blue (RGB)** enviadas via `analogWrite()`.
- **Exemplo no Projeto ([main.cpp](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/Arduino/src/main.cpp#L148-L176)):**

```cpp
void transicaoSuave() {
  static int hue = 0;
  int r, g, b;

  // Conversão da roda de cores (0-255) em componentes RGB
  if (hue < 85) {
    r = 255 - hue * 3; g = 0; b = hue * 3;
  } else if (hue < 170) {
    int pos = hue - 85;
    r = 0; g = pos * 3; b = 255 - pos * 3;
  } else {
    int pos = hue - 170;
    r = pos * 3; g = 255 - pos * 3; b = 0;
  }

  // Escrita do valor PWM (0 a 255) nos pinos do LED RGB
  analogWrite(rgb_vermelho, r);
  analogWrite(rgb_verde, g);
  analogWrite(rgb_azul, b);

  hue = (hue + 1) % 256;
}
```

---

### 1.6. Temporização sem Bloqueio com `millis()` e Síntese Sonora (`tone`)

* **Conceito Teórico:** A função `millis()` retorna o tempo em milissegundos desde o início da execução do programa. Em vez de usar `delay()` bloqueante, calcula-se o tempo decorrido ($T_{atual} - T_{inicio} < T_{desejado}$). A função `tone()` gera ondas quadradas de frequência ajustável no pino do buzzer para criar o efeito sonoro de alarme.
- **Exemplo no Projeto ([main.cpp](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/Arduino/src/main.cpp#L130-L145)):**

```cpp
void tocarSirene(int tempoTotalMs) {
  long inicio = millis(); // Guarda o momento inicial
  while (millis() - inicio < tempoTotalMs) {
    // Sobe a frequência sonora de 440Hz até 1000Hz
    for (int freq = 440; freq < 1000; freq += 5) {
      tone(buzzer, freq);
      delay(1);
    }
    // Desce a frequência de 1000Hz a 440Hz
    for (int freq = 1000; freq > 440; freq -= 5) {
      tone(buzzer, freq);
      delay(1);
    }
  }
  noTone(buzzer); // Interrompe o som
}
```

---

## 2. Módulo Software: Aplicação Desktop & Web (Electron / Node.js)

### 2.1. Arquitetura do Electron (Main Process e Renderer Process)

* **Conceito Teórico:** O **Electron** combina o motor de renderização **Chromium** com o ambiente de execução **Node.js**. A arquitetura divide-se em:
  - **Processo Principal (*Main Process*):** Gerencia o ciclo de vida do aplicativo, cria janelas do sistema operacional (`BrowserWindow`) e interage com APIs nativas.
  - **Processo Renderizador (*Renderer Process*):** Executa o HTML, CSS e JavaScript da interface gráfica.
- **Exemplo no Projeto ([index.js](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/AppDesktop/index.js#L1-L20)):**

```javascript
const { app, BrowserWindow, Menu } = require("electron");

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,   // Permite utilizar APIs do Node.js na página web
      contextIsolation: false, // Desabilita o isolamento de contexto
    },
  });
  win.loadFile("inicio.html"); // Carrega o documento HTML de apresentação
}
```

---

### 2.2. Menus Nativos e Teclas de Atalho (`accelerator`)

* **Conceito Teórico:** O Electron permite construir a barra de menus do aplicativo desktop integrada ao sistema operacional a partir de um modelo de array de objetos (*Template*). Cada item especifica seu rótulo (`label`), atalho de teclado (`accelerator`) e a função callback (`click`) acionada no evento.
- **Exemplo no Projeto ([index.js](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/AppDesktop/index.js#L23-L77)):**

```javascript
const menuTemplate = [
  {
    label: "Opções",
    submenu: [
      {
        label: "Conectar botões",
        accelerator: "F2",
        click: () => { portaConectada = true; },
      },
      {
        label: "Iniciar jogo",
        accelerator: "F5",
        click: () => { win.loadFile("index.html"); },
      },
      {
        label: "Tela cheia",
        accelerator: "F11",
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.setFullScreen(!win.isFullScreen());
        },
      },
      {
        label: "Sair",
        accelerator: "F12",
        click: () => app.quit(),
      },
    ],
  },
];

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  createWindow();
});
```

---

### 2.3. Comunicação I/O Assíncrona e Stream Parser Serial

* **Conceito Teórico:** Em plataformas orientadas a eventos (Node.js), operações de I/O (Input/Output) não devem bloquear a *Event Loop*. A comunicação serial utiliza a arquitetura de **Streams** e **EventEmitter**. O `ReadlineParser` acumula os bytes recebidos da porta serial e dispara o evento `'data'` apenas quando encontra o caractere delimitador de quebra de linha (`\r\n`).
- **Exemplo no Projeto ([README.md](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/AppDesktop/README.md#L59-L73)):**

```javascript
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Abre a conexão serial com baudRate 9600
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Listener assíncrono para os dados recebidos do Arduino
parser.on('data', (data) => {
  if (data === 'AZUL') {
    // Ativa lógica e temporizador do jogador Azul
  } else if (data === 'VERMELHO') {
    // Ativa lógica e temporizador do jogador Vermelho
  }
});
```

---

### 2.4. Estruturação de Dados com JSON

* **Conceito Teórico:** O formato **JSON (JavaScript Object Notation)** é um padrão leve de intercâmbio de dados estruturado em pares de chave-valor e listas (arrays).
- **Indexação Base Zero:** A propriedade `respostaCorreta` armazena o índice numérico da resposta certa dentro da lista `respostas`, seguindo a regra de indexação iniciada em zero (`0 = 1ª opção`, `1 = 2ª opção`, etc.).
- **Exemplo no Projeto ([README.md](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/AppDesktop/README.md#L29-L41)):**

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

---

### 2.5. Layout Responsivo com CSS Grid e Unidades de Viewport (`vmin`)

* **Conceito Teórico:**
  - **CSS Grid Layout:** Modelo de layout bidimensional (linhas e colunas). Propriedades como `grid-template-areas` permitem mapear nomes amigáveis às regiões do container.
  - **Unidades Fracionárias (`fr`):** `grid-template-columns: 2fr 1fr` divide a largura da tela em 3 partes proporcionais ($2/3$ para a esquerda e $1/3$ para a direita).
  - **Unidade `vmin`:** Equivale a 1% da menor dimensão atual da viewport (`width` ou `height`), garantindo que o texto e os botões se redimensionem proporcionalmente em qualquer resolução de tela (monitores, projetores ou TVs).
- **Exemplo no Projeto ([style.css](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/AppDesktop/style.css#L35-L64)):**

```css
main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
    "pergunta pergunta"
    "respostas tempo"
    "respostas botoes";
  height: 97vh;
}

main div {
  padding: 10px;
  margin: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  font-size: 4vmin; /* Dimensionamento dinâmico baseado na viewport */
  display: flex;
  justify-content: center;
  align-items: center;
}

.pergunta { grid-area: pergunta; }
.respostas { grid-area: respostas; }
.tempo     { grid-area: tempo; font-size: 16vmin; }
.botoes    { grid-area: botoes; }
```

---

### 2.6. Semântica HTML5

* **Conceito Teórico:** Tags semânticas fornecem significado ao conteúdo, melhorando a estrutura do documento DOM, acessibilidade e facilidade de manutenção.
  - `<main>`: Conteúdo principal único do documento.
  - `<footer>`: Rodapé contendo informações de placar e tempo de jogo.
  - `<ol>`: Lista ordenada usada para representar as alternativas de respostas (A, B, C, D).
- **Exemplo no Projeto ([index.html](file:///home/rpb/Repositórios/TEI_4301_26/QuizGame/AppDesktop/index.html#L10-L41)):**

```html
<main>
  <div class="pergunta">
    <p>Texto da pergunta</p>
  </div>
  <div class="respostas">
    <ol>
      <li><a>Resposta A</a></li>
      <li><a>Resposta B</a></li>
      <li><a>Resposta C</a></li>
      <li><a>Resposta D</a></li>
    </ol>
  </div>
  <div class="tempo"><p>30</p></div>
  <div class="botoes">
    <button>Confirmar</button>
    <button>Próxima</button>
  </div>
</main>
<footer>
  <div class="placar">
    <p>Placar:</p>
    <p class="pontos pontos-vermelho">0</p>
    <p>X</p>
    <p class="pontos pontos-azul">0</p>
  </div>
</footer>
```

---

## 3. 📝 Banco de Questões Teóricas para Sala de Aula

Esta seção contém uma sugestão de **10 questões teóricas** elaboradas com base nos conceitos e trechos de código do projeto.

### Questão 1 (Hardware — Interrupções vs Polling)

No arquivo `main.cpp`, a leitura dos botões do Quiz Game foi implementada utilizando a função `attachInterrupt()` em vez de ler o estado dos pinos repetidamente dentro do `loop()`.
Explique qual é a principal vantagem teórica da utilização de **Interrupções de Hardware (ISR)** em relação à técnica de **Polling** neste tipo de jogo, citando o impacto na imparcialidade do resultado.

### Questão 2 (Hardware — Qualificador `volatile`)

Analise as declarações no trecho de código abaixo retirado do projeto:

```cpp
volatile bool vencedor_azul = false;
volatile bool vencedor_vermelho = false;
volatile bool jogo_travado = false;
```

Por que a palavra-chave `volatile` é indispensável quando uma variável é modificada dentro de uma rotina de interrupção (ISR) e acessada no fluxo normal do programa (`loop()`)? O que pode ocorrer se essa palavra-chave for omitida pelo programador?

### Questão 3 (Hardware — Resistores Pull-up)

Ao configurar os botões no `setup()`, utilizou-se a instrução `pinMode(btn_azul, INPUT_PULLUP)`.
a) Qual é a diferença entre a configuração `INPUT` e `INPUT_PULLUP`?
b) Desenhe ou descreva qual é o nível lógico do pino quando o botão **não está pressionado** e quando o botão **está pressionado**.

### Questão 4 (Hardware — Protocolos de Comunicação)

O microcontrolador comunica-se com o computador enviando strings como `"AZUL\r\n"` e `"VERMELHO\r\n"`.
Qual é a taxa de transmissão (*baud rate*) utilizada na inicialização `Serial.begin(9600)` e o que ela significa em termos de transferência de bits por segundo? Por que é necessário utilizar o caractere de terminação `\n` ou `\r\n` nas mensagens da comunicação serial?

### Questão 5 (Hardware — Modulação PWM e LED RGB)

A função `transicaoSuave()` realiza a alteração de cores do LED RGB ajustando os valores enviados por `analogWrite(pino, valor)`.
Dado que a resolução do PWM no Arduino Uno é de 8 bits:
a) Qual é o intervalo de valores inteiros aceito pelo parâmetro `valor` da função `analogWrite`?
b) Como o PWM simula uma variação de tensão em um pino digital que fisicamente só é capaz de fornecer 0V ou 5V?

---

### Questão 6 (Software — Arquitetura Electron)

O aplicativo desktop foi desenvolvido com o framework Electron.
Explique a divisão entre o **Main Process (Processo Principal)** e o **Renderer Process (Processo Renderizador)**. Qual dessas partes é responsável por criar a janela da aplicação via `new BrowserWindow()` e qual executa os scripts da interface Web (`index.html`)?

### Questão 7 (Software — Manipulação de JSON)

Considere o seguinte arquivo de perguntas `perguntas.json`:

```json
[
  {
    "pergunta": "Qual linguagem é utilizada no microcontrolador Arduino?",
    "respostas": ["Python", "C++", "Java", "PHP"],
    "respostaCorreta": 1
  }
]
```

Considerando que a chave `respostaCorreta` utiliza **indexação base zero**, responda:
a) Qual é o texto da alternativa apontada por `"respostaCorreta": 1`?
b) Se a resposta correta fosse "Python", qual valor numérico deveria ser gravado na propriedade `respostaCorreta`?

### Questão 8 (Software — CSS Grid Layout)

Dado o trecho de CSS extraído do arquivo `style.css`:

```css
main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
    "pergunta pergunta"
    "respostas tempo"
    "respostas botoes";
}
```

a) Em quantia de frações (`fr`) a largura da tela foi dividida e qual porcentagem da tela é ocupada pela primeira coluna?
b) Qual elemento ocupará toda a largura superior da grade de acordo com o mapeamento em `grid-template-areas`?

### Questão 9 (Software — Unidades Responsivas `vmin`)

No CSS do projeto, o tamanho da fonte do cronômetro foi definido com a unidade `16vmin` (`font-size: 16vmin`).
Explique como funciona o cálculo da unidade `vmin` em relação às dimensões da janela do navegador/aplicativo e qual a vantagem do seu uso para exibição em telas com resoluções e proporções variadas (como monitores 16:9 ou projetores).

### Questão 10 (Software — Streams e Processamento Assíncrono)

No Node.js, para ler a comunicação serial sem travar a interface gráfica do jogo, foi utilizado o módulo `@serialport/parser-readline` com o listener `parser.on('data', callback)`.
Qual é a importância da arquitetura orientada a eventos (*Event-Driven Architecture*) do Node.js ao lidar com entrada e saída de dados (*I/O*) simultaneamente à execução da animação e cronômetro da página web?
  