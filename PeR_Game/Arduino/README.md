# Módulo Hardware: Arduino Uno / Nano

Este diretório contém o firmware do circuito de botões e sinalizadores do Quiz Game, desenvolvido em C++ usando o ambiente **PlatformIO**. Ele gerencia os botões físicos usando interrupções de hardware, garantindo total imparcialidade na medição de quem apertou o botão primeiro.

---

## 🔌 Tabela de Pinagem e Ligações

A tabela abaixo descreve as conexões elétricas configuradas no código (`src/main.cpp`):

| Componente | Pino Arduino | Tipo de Entrada/Saída | Configuração/Notas |
| :--- | :---: | :---: | :--- |
| **Botão Vermelho** | `2` | Entrada com Pull-up interno | Aciona Interrupção Externa `INT0` (vai a `LOW` ao pressionar) |
| **Botão Azul** | `3` | Entrada com Pull-up interno | Aciona Interrupção Externa `INT1` (vai a `LOW` ao pressionar) |
| **LED Indicador Vermelho** | `13` | Saída Digital | Acende fixo se o jogador Vermelho bater primeiro |
| **LED Indicador Azul** | `4` | Saída Digital | Acende fixo se o jogador Azul bater primeiro |
| **LED RGB - Canal Vermelho** | `11` | Saída Analógica (PWM) | Usado para efeito arco-íris e indicação estática |
| **LED RGB - Canal Verde** | `9` | Saída Analógica (PWM) | Usado para efeito arco-íris e indicação estática |
| **LED RGB - Canal Azul** | `10` | Saída Analógica (PWM) | Usado para efeito arco-íris e indicação estática |
| **Buzzer / Sirene** | `8` | Saída Digital | Emite sinal sonoro senoidal de alerta por 2 segundos |

---

## ⚡ O conceito de Interrupção de Hardware

Para um jogo de reflexo rápido, ler os botões usando a técnica tradicional de *polling* (verificação repetitiva dentro do `loop()`) pode gerar atrasos ou injustiças caso um botão seja pressionado exatamente enquanto o Arduino está executando outra tarefa (como processar a transição suave de cores do LED RGB ou tocar a sirene).

Por isso, este projeto utiliza **Interrupções de Hardware (External Interrupts)**:
* O microcontrolador ATmega328P (do Arduino Uno/Nano) possui pinos dedicados (`2` e `3`) conectados à linha de interrupção interna.
* Quando qualquer um desses pinos muda de estado lógico (neste caso, transição de `HIGH` para `LOW` - borda de descida/`FALLING`), o processador suspende imediatamente a execução normal do loop principal para executar a função associada (chamada **ISR - Interrupt Service Routine**).
* Código correspondente em `setup()`:
  ```cpp
  attachInterrupt(digitalPinToInterrupt(btn_azul), ISR_azul, FALLING);
  attachInterrupt(digitalPinToInterrupt(btn_vermelho), ISR_vermelho, FALLING);
  ```
* No momento em que a primeira ISR roda, a flag global `jogo_travado` é imediatamente definida como `true`. Isso garante que pressões de botões subsequentes sejam completamente desconsideradas até que o jogo seja redefinido pelo computador.

---

## 📨 Protocolo Serial (Ponto de Vista do Arduino)

O Arduino comunica-se com o computador pela porta serial a **9600 bps**.

### Mensagens Enviadas (Saídas)
Assim que um jogador vence a disputa:
* Envia `"AZUL\r\n"` ou `"VERMELHO\r\n"` via Serial.
* Ativa o buzzer por 2 segundos e mantém o LED vencedor aceso.

### Mensagens Recebidas (Entradas)
Para liberar o jogo para a próxima rodada, o computador deve enviar:
* `"L\n"` ou `"LIBERAR\n"`.
* Ao receber o comando, o Arduino limpa as variáveis de controle, apaga os LEDs e responde com `"PRONTO\r\n"`, indicando que está pronto para o próximo round.

---

## 💻 Simulação no Wokwi

O projeto está configurado para simulação no **Wokwi** através dos arquivos:
* `wokwi.toml`: Define o arquivo ELF de compilação.
* `diagram.json`: Define as conexões elétricas e posicionamento virtual de todos os botões, LEDs e buzzer.

Para rodar a simulação integrada no VS Code, certifique-se de ter a extensão oficial do Wokwi instalada e inicie o simulador.
