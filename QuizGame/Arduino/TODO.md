# TODO - Quiz Game Firmware (Arduino)

Este documento lista as pendências, melhorias de firmware e ajustes no protocolo serial para o circuito de botões localizado em `QuizGame/Arduino`.

---

## 🚨 1. Alinhamento de Protocolo Serial com o AppDesktop (Electron)

- [ ] **Compatibilidade de comandos de liberação/reset**:
  - No código atual (`src/main.cpp`, linhas 70-71), o firmware só reconhece:
    ```cpp
    if (input.equalsIgnoreCase("L") || input.equalsIgnoreCase("LIBERAR"))
    ```
  - O aplicativo Electron em `QuizGame/AppDesktop/Gabarito/AppElectron` envia a string `"REINICIAR"`.
  - **Ação:** Adicionar suporte ao comando `"REINICIAR"` na verificação serial para tolerar envios do aplicativo:
    ```cpp
    if (input.equalsIgnoreCase("L") || input.equalsIgnoreCase("LIBERAR") || input.equalsIgnoreCase("REINICIAR"))
    ```
- [ ] **Comandos para controle direto de sinalização (Repassagem de Pergunta)**:
  - Quando uma equipe erra a resposta no aplicativo, a pergunta é repassada para o time adversário sem nova disputa de botões.
  - Implementar comandos seriais para que o Electron possa acender diretamente a cor da equipe que recebeu a vez:
    - `"SET_AZUL"`: Acende o LED azul e ajusta o LED RGB para azul estático.
    - `"SET_VERMELHO"`: Acende o LED vermelho e ajusta o LED RGB para vermelho estático.
    - `"APAGAR"` ou `"SILENCIAR"`: Interrompe a sirene ou apaga LEDs sem liberar a disputa.

---

## ⚡ 2. Melhorias de Temporização e Concorrência

- [ ] **Desbloquear o loop durante o toque da sirene**:
  - A função `tocarSirene(2000)` utiliza laços de repetição com `delay(1)`, retendo a execução do microcontrolador por 2 segundos completos.
  - Além disso, há um `while (digitalRead(btn_...) == LOW) delay(10);` que aguarda a soltura do botão.
  - **Ação:** Refatorar a sirene para uma máquina de estados assíncrona baseada em `millis()`, garantindo que o Arduino consiga receber e processar comandos seriais mesmo enquanto a sirene estiver soando.
- [ ] **Filtro anti-repique (Debounce) aprimorado nas interrupções**:
  - Validar e refinar o tempo de debounce nas rotinas `ISR_azul()` e `ISR_vermelho()` utilizando conferência de timestamp via `millis()`, evitando múltiplos disparos provocados por ruído elétrico nos botões físicos.
