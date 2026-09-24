#include <Arduino.h>
#include <SoftwareSerial.h>

// -----------------------------------------------------------
// Configuração dos pinos do robô
// -----------------------------------------------------------

// Motor da esquerda
const int ena_esquerda =
    3;              // Pino ENABLE do motor esquerdo (controle da velocidade)
const int in_3 = 4; // Entrada 3 do driver do motor esquerdo
const int in_4 = 5; // Entrada 4 do driver do motor esquerdo

// Motor da direita
const int ena_direita =
    6;              // Pino ENABLE do motor direito (controle da velocidade)
const int in_1 = 7; // Entrada 1 do driver do motor direito
const int in_2 = 8; // Entrada 2 do driver do motor direito

// Pinos do módulo Bluetooth
const int bt_tx = 11; // Pino TX (transmite dados para o Arduino)
const int bt_rx = 10; // Pino RX (recebe dados do Arduino)

// -----------------------------------------------------------
// Objetos e variáveis globais
// -----------------------------------------------------------

// Cria uma comunicação serial em software para trocar dados com o módulo HC-05
// Formato: SoftwareSerial(rx, tx)
SoftwareSerial SerialBT(bt_tx, bt_rx);

// Velocidade inicial do robô. 255 é o valor máximo do PWM.
// 255/4 = 63, que é aproximadamente 25% da velocidade máxima.
int velocidade = 255 / 4;

// -----------------------------------------------------------
// Protótipos das funções
// -----------------------------------------------------------
// Essas funções serão definidas depois no código e podem ser chamadas antes.
inline void setarVelocidade(int velocidade);
inline void andarParaFrente();
inline void andarParaTras();
inline void paraDireita();
inline void paraEsquerda();
inline void parar();

// -----------------------------------------------------------
// Função setup: executa uma vez quando o Arduino liga
// -----------------------------------------------------------
void setup() {
  SerialBT.begin(9600);     // Inicia a comunicação Bluetooth em 9600 bps
  SerialBT.setTimeout(100); // Timeout curto para leituras seriais

  Serial.begin(9600);
  // Configura os pinos dos motores como saídas digitais
  pinMode(ena_esquerda, OUTPUT);
  pinMode(in_3, OUTPUT);
  pinMode(in_4, OUTPUT);

  pinMode(ena_direita, OUTPUT);
  pinMode(in_1, OUTPUT);
  pinMode(in_2, OUTPUT);
}

// -----------------------------------------------------------
// Função loop: fica repetindo infinitamente enquanto o Arduino está ligado
// -----------------------------------------------------------
void loop() {
  // Verifica se chegou algum dado pelo Bluetooth
  if (SerialBT.available() > 0) {
    // Lê a mensagem completa até o final da linha (\n)
    String linha = SerialBT.readStringUntil('\n');
    linha.trim(); // Remove espaços, \r e caracteres residuais

    // Se a mensagem não estiver vazia, processa o primeiro caractere
    if (linha.length() > 0) {
      char comando = linha[0];
      Serial.print("Comando: ");
      Serial.println(comando);

      // Decide o que fazer conforme o comando recebido
      switch (comando) {
      case 'R': // Comando para virar para a direita
        paraDireita();
        break;

      case 'L': // Comando para virar para a esquerda
        paraEsquerda();
        break;

      case 'F': // Comando para andar para frente
        andarParaFrente();
        break;

      case 'B': // Comando para andar para trás
        andarParaTras();
        break;

      case 'S': // Comando para parar o robô
        parar();
        break;

      case '1': // Velocidade 1: 25% da máxima
        setarVelocidade(255 / 4);
        break;

      case '2': // Velocidade 2: aproximadamente 33% da máxima
        setarVelocidade(255 / 3);
        break;

      case '3': // Velocidade 3: 50% da máxima
        setarVelocidade(255 / 2);
        break;

      case '4': // Velocidade 4: 100% da máxima
        setarVelocidade(255);
        break;
      default:
        Serial.print("Comando não atendido.: ");
      }
    }
  }
}

// -----------------------------------------------------------
// Ajusta a velocidade dos dois motores
// -----------------------------------------------------------
inline void setarVelocidade(int velocidade) {
  // analogWrite gera um sinal PWM para controlar o nível de energia do motor
  analogWrite(ena_esquerda, velocidade); // Velocidade do motor esquerdo
  analogWrite(ena_direita, velocidade);  // Velocidade do motor direito
}

// -----------------------------------------------------------
// Movimento para frente
// -----------------------------------------------------------
inline void andarParaFrente() {
  // Motor esquerdo gira em uma direção
  digitalWrite(in_3, HIGH);
  digitalWrite(in_4, LOW);

  // Motor direito gira na mesma direção para frente
  digitalWrite(in_1, HIGH);
  digitalWrite(in_2, LOW);
}

// -----------------------------------------------------------
// Movimento para trás
// -----------------------------------------------------------
inline void andarParaTras() {
  // Motor esquerdo gira na direção contrária
  digitalWrite(in_3, LOW);
  digitalWrite(in_4, HIGH);

  // Motor direito gira na direção contrária
  digitalWrite(in_1, LOW);
  digitalWrite(in_2, HIGH);
}

// -----------------------------------------------------------
// Virar para a direita
// -----------------------------------------------------------
inline void paraDireita() {
  // Motor esquerdo vai para trás
  digitalWrite(in_3, LOW);
  digitalWrite(in_4, HIGH);

  // Motor direito parado
  digitalWrite(in_1, LOW);
  digitalWrite(in_2, LOW);
}

// -----------------------------------------------------------
// Virar para a esquerda
// -----------------------------------------------------------
inline void paraEsquerda() {
  // Motor esquerdo parado
  digitalWrite(in_3, LOW);
  digitalWrite(in_4, LOW);

  // Motor direito vai para frente
  digitalWrite(in_1, HIGH);
  digitalWrite(in_2, LOW);
}

// -----------------------------------------------------------
// Parar os motores
// -----------------------------------------------------------
inline void parar() {
  // Coloca todas as entradas em LOW para desligar os motores
  digitalWrite(in_3, LOW);
  digitalWrite(in_4, LOW);
  digitalWrite(in_1, LOW);
  digitalWrite(in_2, LOW);
}