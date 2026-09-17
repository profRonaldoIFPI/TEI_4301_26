# Controle de Motor CC com Ponte H e Arduino

Projeto prático desenvolvido na aula de **03/09/2026** para a disciplina de **Tópicos Especiais em Inovação (TEI 4301)** no IFPI.

O objetivo desta prática é compreender o princípio de funcionamento e controle de motores de corrente contínua (CC) utilizando um microcontrolador Arduino e um módulo de potência Ponte H (L298N).

---

## 🔌 Componentes Utilizados

* **Arduino Uno / Nano**
* **Módulo Driver Ponte H L298N**
* **Motores CC com caixa de redução** (ou motor CC avulso para teste de bancada)
* **Fonte de alimentação externa** para alimentação dos motores
* **Jumpers e cabos de conexão**

---

## 📌 Pinagem e Ligações

A pinagem configurada no arquivo [`ponte_h.ino`](file:///home/rpb/IFPI_26.2/TEI%20-%204301/TEI_4301_26/Aula_0309_Controle%20Motor%20CC/ponte_h.ino) é a seguinte:

| Componente / Função | Pino Arduino | Tipo | Descrição |
| :--- | :---: | :---: | :--- |
| **ENA Esquerda** | `3` | Saída PWM | Controle de velocidade do motor esquerdo |
| **IN3** | `4` | Saída Digital | Controle de sentido do motor esquerdo |
| **IN4** | `5` | Saída Digital | Controle de sentido do motor esquerdo |
| **ENA Direita** | `6` | Saída PWM | Controle de velocidade do motor direito |
| **IN1** | `7` | Saída Digital | Controle de sentido do motor direito |
| **IN2** | `8` | Saída Digital | Controle de sentido do motor direito |

> [!NOTE]
> Para o controle de velocidade por PWM, os pinos `ENA` e `ENB` da Ponte H devem ser conectados obrigatoriamente a pinos do Arduino com suporte a PWM (identificados pelo símbolo `~`, como 3, 5, 6, 9, 10, 11 no Arduino Uno). Os jumpers de ativação (jumper 5V) dos pinos ENA/ENB da ponte H devem ser removidos ao usar controle por PWM.

---

## 🧠 Princípio de Funcionamento

### 1. Sentido de Rotação
O sentido do motor é determinado pela diferença de potencial entre os terminais de entrada da ponte H:

| Entrada 1 (ex: IN3) | Entrada 2 (ex: IN4) | Ação no Motor |
| :---: | :---: | :--- |
| `HIGH` | `LOW` | Gira no sentido direto (horário) |
| `LOW` | `HIGH` | Gira no sentido reverso (anti-horário) |
| `LOW` | `LOW` | Roda livre / Desligado |
| `HIGH` | `HIGH` | Frenagem ativa |

### 2. Controle de Velocidade via PWM (Pulse Width Modulation)
A velocidade é regulada pela função `analogWrite(pino, valor)`, onde o valor varia de `0` (motor completamente parado) até `255` (tensão máxima aplicada, velocidade máxima).

### 3. Rotina Demonstrada no Código
No arquivo `ponte_h.ino`:
1. Liga o motor em meia velocidade (`PWM = 128`) em um sentido por 5 segundos.
2. Para o motor por 1 segundo.
3. Inverte o sentido de giro e executa uma aceleração gradual (rampa de `0` a `255`).
4. Para o motor e reinicia o ciclo.

---

## 🛠️ Como Executar

1. Abra o arquivo [`ponte_h.ino`](file:///home/rpb/IFPI_26.2/TEI%20-%204301/TEI_4301_26/Aula_0309_Controle%20Motor%20CC/ponte_h.ino) na **Arduino IDE** ou abra o diretório no **VS Code** com a extensão do Arduino ou PlatformIO.
2. Selecione a placa correspondente (ex: *Arduino Uno*) e a porta serial conectada.
3. Faça o upload do código para o Arduino.
