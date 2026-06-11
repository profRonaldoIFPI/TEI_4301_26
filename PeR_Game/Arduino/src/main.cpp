#include <Arduino.h>
// lado azul
const int btn_azul = 3; // Pino 3 possui interrupção (INT1) no Arduino Uno
const int led_azul = 4;

// lado vermelho
//  IMPORTANTE: Mudei o pino do botão vermelho do 12 para o 2.
//  O Arduino Uno só suporta interrupções externas (attachInterrupt) nos pinos 2
//  e 3!
const int btn_vermelho = 2; // Pino 2 possui interrupção (INT0)
const int led_vermelho = 13;

// outros componentes
const int rgb_vermelho = 11;
const int rgb_verde = 9;
const int rgb_azul = 10;
const int buzzer = 8;

// Variáveis voláteis (necessárias pois são alteradas dentro da interrupção)
volatile bool vencedor_azul = false;
volatile bool vencedor_vermelho = false;
volatile bool jogo_travado =
    false; // Evita que um jogador aperte após o outro já ter ganhado

void tocarSirene(int tempoTotalMs);
void transicaoSuave();

// Rotina de Interrupção do Azul
void ISR_azul() {
  if (!jogo_travado) {
    vencedor_azul = true;
    jogo_travado = true;
  }
}

// Rotina de Interrupção do Vermelho
void ISR_vermelho() {
  if (!jogo_travado) {
    vencedor_vermelho = true;
    jogo_travado = true;
  }
}

void setup() {
  Serial.begin(9600);

  pinMode(btn_azul, INPUT_PULLUP);
  pinMode(btn_vermelho, INPUT_PULLUP);

  pinMode(led_azul, OUTPUT);
  pinMode(led_vermelho, OUTPUT);
  pinMode(rgb_vermelho, OUTPUT);
  pinMode(rgb_verde, OUTPUT);
  pinMode(rgb_azul, OUTPUT);
  pinMode(buzzer, OUTPUT);

  // Configurando as interrupções de hardware
  // FALLING significa que a interrupção dispara quando o sinal vai de HIGH para
  // LOW (botão pressionado)
  attachInterrupt(digitalPinToInterrupt(btn_azul), ISR_azul, FALLING);
  attachInterrupt(digitalPinToInterrupt(btn_vermelho), ISR_vermelho, FALLING);
}

void loop() {
  // Verifica se chegou o comando de liberação pela porta Serial
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim(); // Remove espaços e quebras de linha (\r, \n)

    // Se receber "L", "l" ou "LIBERAR"
    if (input.equalsIgnoreCase("L") || input.equalsIgnoreCase("LIBERAR")) {
      // Apaga os leds de indicação individuais
      digitalWrite(led_azul, LOW);
      digitalWrite(led_vermelho, LOW);

      // Reseta todas as flags para permitir uma nova rodada
      vencedor_azul = false;
      vencedor_vermelho = false;
      jogo_travado = false;

      Serial.println("PRONTO"); // Retorna confirmação para o sistema
    }
  }

  if (vencedor_azul) {
    Serial.println("AZUL");
    digitalWrite(led_azul, HIGH);
    digitalWrite(rgb_vermelho, LOW);
    digitalWrite(rgb_verde, LOW);
    digitalWrite(rgb_azul, HIGH);

    tocarSirene(2000);

    // Espera o jogador soltar o botão para evitar leituras fantasmas
    while (digitalRead(btn_azul) == LOW) {
      delay(10);
    }
    delay(100); // Debounce

    // Limpa a flag do vencedor imediato, mas deixa o jogo_travado = true
    // Assim, o LED do vencedor permanece aceso até que chegue o comando Serial
    vencedor_azul = false;
  } else if (vencedor_vermelho) {
    Serial.println("VERMELHO");
    digitalWrite(led_vermelho, HIGH);
    digitalWrite(rgb_vermelho, HIGH);
    digitalWrite(rgb_verde, LOW);
    digitalWrite(rgb_azul, LOW);

    tocarSirene(2000);

    // Espera o jogador soltar o botão para evitar leituras fantasmas
    while (digitalRead(btn_vermelho) == LOW) {
      delay(10);
    }
    delay(100); // Debounce

    // Limpa a flag do vencedor imediato, mas deixa o jogo_travado = true
    vencedor_vermelho = false;
  } else {
    // Só roda o efeito de transição se o jogo estiver liberado (jogo_travado =
    // false)
    if (!jogo_travado) {
      transicaoSuave();
      delay(5); // Define a velocidade da transição (menor = mais rápido)
    }
  }
}

void tocarSirene(int tempoTotalMs) {
  long inicio = millis();
  while (millis() - inicio < tempoTotalMs) {
    // Sobe o tom (Frequência de 440Hz a 1000Hz)
    for (int freq = 440; freq < 1000; freq += 5) {
      tone(buzzer, freq);
      delay(1);
    }
    // Desce o tom (Frequência de 1000Hz a 440Hz)
    for (int freq = 1000; freq > 440; freq -= 5) {
      tone(buzzer, freq);
      delay(1);
    }
  }
  noTone(buzzer); // Desliga o som ao final
}

// Função para criar um efeito arco-íris suave no LED RGB
void transicaoSuave() {
  static int hue = 0;
  int r, g, b;

  // Converte a posição atual da "roda de cores" (0-255) em valores RGB
  if (hue < 85) {
    r = 255 - hue * 3;
    g = 0;
    b = hue * 3;
  } else if (hue < 170) {
    int pos = hue - 85;
    r = 0;
    g = pos * 3;
    b = 255 - pos * 3;
  } else {
    int pos = hue - 170;
    r = pos * 3;
    g = 255 - pos * 3;
    b = 0;
  }

  analogWrite(rgb_vermelho, r);
  analogWrite(rgb_verde, g);
  analogWrite(rgb_azul, b);

  hue++;
  if (hue > 255) {
    hue = 0;
  }
}