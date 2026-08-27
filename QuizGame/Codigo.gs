/**
 * Script para criação automatizada do Formulário Avaliativo: QuizGame
 * Para executar: cole no editor do Google Apps Script (script.google.com) e clique em "Executar".
 */
function criarFormularioQuizGame() {
  // 1. Cria o formulário
  const form = FormApp.create("Avaliação Teórica — QuizGame (Hardware & Software)");
  
  // 2. Configurações gerais
  form.setDescription(
    "Esta avaliação contempla os conceitos de Sistemas Embarcados (Arduino/C++) " +
    "e Desenvolvimento Desktop/Web (Electron/Node.js) aplicados no projeto QuizGame.\n\n" +
    "Leia atentamente os enunciados e trechos de código antes de responder."
  );
  form.setIsQuiz(true); // Configura como teste avaliativo
  form.setCollectEmail(true); // Coleta de e-mails
  form.setAllowResponseEdits(false);

  // ==========================================
  // SEÇÃO 0: IDENTIFICAÇÃO DO ESTUDANTE
  // ==========================================
  const itemNome = form.addTextItem();
  itemNome.setTitle("Nome Completo do Aluno");
  itemNome.setRequired(true);

  const itemMatricula = form.addTextItem();
  itemMatricula.setTitle("Matrícula / Turma");
  itemMatricula.setRequired(true);

  // ==========================================
  // SEÇÃO 1: MÓDULO HARDWARE (ARDUINO & C++)
  // ==========================================
  form.addPageBreakItem()
      .setTitle("Módulo 1: Sistemas Embarcados & C++ (Arduino)")
      .setHelpText("Questões referentes a interrupções, qualificador volatile, debounce, PWM e comunicação serial.");

  // Questão 1
  const q1 = form.addParagraphTextItem();
  q1.setTitle("Questão 1 — Interrupções de Hardware vs Polling");
  q1.setHelpText(
    "No arquivo main.cpp, a leitura dos botões foi implementada com attachInterrupt() em vez de ler os pinos no loop().\n\n" +
    "Explique qual é a principal vantagem teórica da utilização de Interrupções de Hardware (ISR) em relação à técnica de Polling neste jogo, citando o impacto na imparcialidade do resultado."
  );
  q1.setPoints(10);
  q1.setRequired(true);

  // Questão 2
  const q2 = form.addParagraphTextItem();
  q2.setTitle("Questão 2 — Qualificador volatile e Concorrência");
  q2.setHelpText(
    "Considere o trecho:\n" +
    "volatile bool vencedor_azul = false;\n" +
    "volatile bool vencedor_vermelho = false;\n" +
    "volatile bool jogo_travado = false;\n\n" +
    "Por que a palavra-chave volatile é indispensável quando uma variável é alterada dentro de uma ISR e lida no loop()? O que pode ocorrer se for omitida?"
  );
  q2.setPoints(10);
  q2.setRequired(true);

  // Questão 3
  const q3 = form.addParagraphTextItem();
  q3.setTitle("Questão 3 — Resistores Pull-up Internos (INPUT_PULLUP)");
  q3.setHelpText(
    "Ao configurar os botões no setup(), utilizou-se pinMode(btn_azul, INPUT_PULLUP).\n\n" +
    "a) Qual é a diferença elétrica/lógica entre a configuração INPUT e INPUT_PULLUP?\n" +
    "b) Descreva o nível lógico do pino quando o botão NÃO está pressionado e quando ESTÁ pressionado."
  );
  q3.setPoints(10);
  q3.setRequired(true);

  // Questão 4
  const q4 = form.addParagraphTextItem();
  q4.setTitle("Questão 4 — Protocolos de Comunicação Serial (UART)");
  q4.setHelpText(
    "O Arduino comunica-se com o computador enviando strings como \"AZUL\\r\\n\" e \"VERMELHO\\r\\n\".\n\n" +
    "Qual é a taxa de transmissão utilizada em Serial.begin(9600) e o que ela significa? Por que é necessário utilizar o delimitador de terminação (\\n ou \\r\\n) nas mensagens?"
  );
  q4.setPoints(10);
  q4.setRequired(true);

  // Questão 5
  const q5 = form.addParagraphTextItem();
  q5.setTitle("Questão 5 — Modulação PWM e Controle de LED RGB");
  q5.setHelpText(
    "A função transicaoSuave() altera as cores do LED RGB via analogWrite(pino, valor). Sabendo que o PWM do microcontrolador possui resolução de 8 bits:\n\n" +
    "a) Qual é o intervalo de valores inteiros aceito pelo parâmetro valor da função analogWrite?\n" +
    "b) Como o sinal PWM simula uma variação analógica de tensão em um pino digital que opera fisicamente em 0V ou 5V?"
  );
  q5.setPoints(10);
  q5.setRequired(true);

  // ==========================================
  // SEÇÃO 2: MÓDULO SOFTWARE (ELECTRON & WEB)
  // ==========================================
  form.addPageBreakItem()
      .setTitle("Módulo 2: Aplicação Desktop & Web (Electron / Node.js)")
      .setHelpText("Questões referentes à arquitetura do Electron, processamento assíncrono, CSS Grid e manipulação de JSON.");

  // Questão 6
  const q6 = form.addParagraphTextItem();
  q6.setTitle("Questão 6 — Arquitetura do Electron (Main vs Renderer)");
  q6.setHelpText(
    "Explique a divisão de responsabilidades entre o Main Process (Processo Principal) e o Renderer Process (Processo Renderizador) no Electron. " +
    "Qual dessas partes é responsável por instanciar a janela via new BrowserWindow() e qual executa os scripts da interface visual?"
  );
  q6.setPoints(10);
  q6.setRequired(true);

  // Questão 7
  const q7 = form.addParagraphTextItem();
  q7.setTitle("Questão 7 — Estrutura de Dados e Indexação em JSON");
  q7.setHelpText(
    "Considere o fragmento:\n" +
    "[\n" +
    "  {\n" +
    "    \"pergunta\": \"Qual linguagem é utilizada no microcontrolador Arduino?\",\n" +
    "    \"respostas\": [\"Python\", \"C++\", \"Java\", \"PHP\"],\n" +
    "    \"respostaCorreta\": 1\n" +
    "  }\n" +
    "]\n\n" +
    "Considerando a indexação base zero:\n" +
    "a) Qual é o texto da alternativa apontada por \"respostaCorreta\": 1?\n" +
    "b) Se a resposta correta fosse \"Python\", qual valor numérico deveria ser informado?"
  );
  q7.setPoints(10);
  q7.setRequired(true);

  // Questão 8
  const q8 = form.addParagraphTextItem();
  q8.setTitle("Questão 8 — Layout Responsivo com CSS Grid");
  q8.setHelpText(
    "Dado o CSS:\n" +
    "main {\n" +
    "  display: grid;\n" +
    "  grid-template-columns: 2fr 1fr;\n" +
    "  grid-template-areas:\n" +
    "    \"pergunta pergunta\"\n" +
    "    \"respostas tempo\"\n" +
    "    \"respostas botoes\";\n" +
    "}\n\n" +
    "a) Em quantas frações fr a largura total foi dividida e qual porcentagem é ocupada pela primeira coluna?\n" +
    "b) Qual elemento ocupará toda a largura superior da grade de acordo com o template?"
  );
  q8.setPoints(10);
  q8.setRequired(true);

  // Questão 9
  const q9 = form.addParagraphTextItem();
  q9.setTitle("Questão 9 — Dimensionamento com Unidades de Viewport (vmin)");
  q9.setHelpText(
    "No arquivo style.css, a fonte do cronômetro utiliza font-size: 16vmin.\n\n" +
    "Explique como funciona o cálculo da unidade vmin em relação às dimensões da tela e qual a vantagem prática do seu uso em aplicações projetadas para monitores de diferentes resoluções ou projetores."
  );
  q9.setPoints(10);
  q9.setRequired(true);

  // Questão 10
  const q10 = form.addParagraphTextItem();
  q10.setTitle("Questão 10 — Streams, SerialPort e Processamento Assíncrono");
  q10.setHelpText(
    "No Node.js, foi utilizado o módulo @serialport/parser-readline com parser.on('data', callback).\n\n" +
    "Qual é a importância da arquitetura orientada a eventos (Event-Driven) e não bloqueante do Node.js ao lidar com entrada/saída de dados (I/O) paralelamente às animações e contadores da interface gráfica?"
  );
  q10.setPoints(10);
  q10.setRequired(true);

  // ==========================================
  // LOGS COM OS LINKS GERADOS
  // ==========================================
  Logger.log("✅ Formulário criado com sucesso!");
  Logger.log("🔗 Link de Edição (Seu Drive): " + form.getEditUrl());
  Logger.log("🔗 Link de Envio para os Alunos: " + form.getPublishedUrl());
}