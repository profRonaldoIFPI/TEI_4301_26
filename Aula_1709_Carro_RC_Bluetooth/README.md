# Robô Móvel Carro RC com Bluetooth e Arduino UNO

Projeto desenvolvido na aula de **17/09/2026** para a disciplina de **Tópicos Especiais em Inovação (TEI 4301)** no IFPI.

Este projeto utiliza o ambiente **PlatformIO** para controlar um robô móvel com chassi 2WD (dois motores CC de tração e roda de apoio "boba"), utilizando um **Arduino UNO**, um módulo de comunicação sem fio **Bluetooth HC-05** e uma **Ponte H L298N**.

O robô é controlado através de aplicativo móvel para smartphone Android: [**Bluetooth Car Controller** na Google Play Store](https://play.google.com/store/apps/details?id=com.giristuido.bluetooth.car.controller&pcampaignid=web_share), permitindo comandos de movimentação em todas as direções e alteração de faixas de velocidade.

---

## 🔌 Componentes Utilizados

* **Arduino UNO**
* **Módulo Bluetooth HC-05**
* **Ponte H L298N** (Driver de potência)
* **2 Motores CC com caixa de redução** (tração esquerda e direita)
* **2 Rodas com pneus de borracha**
* **1 Roda de apoio "boba"** (suporte frontal/traseiro para equilíbrio)
* **Chassi acrílico para robô 2WD**
* **Fonte de alimentação** (suporte com baterias recarregáveis tipo 18650 ou pilhas)
* **Fios, jumpers e conectores**

---

## 📌 Tabela de Pinagem e Conexões

A pinagem configurada no firmware principal ([`src/main.cpp`](file:///home/rpb/IFPI_26.2/TEI%20-%204301/TEI_4301_26/Aula_1709_Carro_RC_Bluetooth/src/main.cpp)) é detalhada a seguir:

| Módulo / Componente | Pino do Componente | Pino Arduino UNO | Tipo | Descrição |
| :--- | :---: | :---: | :---: | :--- |
| **Ponte H L298N** | `ENA` | `3` | Saída PWM | Velocidade motor esquerdo |
| **Ponte H L298N** | `IN3` | `4` | Saída Digital | Sentido motor esquerdo |
| **Ponte H L298N** | `IN4` | `5` | Saída Digital | Sentido motor esquerdo |
| **Ponte H L298N** | `ENB` | `6` | Saída PWM | Velocidade motor direito |
| **Ponte H L298N** | `IN1` | `7` | Saída Digital | Sentido motor direito |
| **Ponte H L298N** | `IN2` | `8` | Saída Digital | Sentido motor direito |
| **Módulo Bluetooth HC-05** | `TXD` | `11` | Entrada Serial | Conectado ao pino `bt_tx` do SoftwareSerial |
| **Módulo Bluetooth HC-05** | `RXD` | `10` | Saída Serial | Conectado ao pino `bt_rx` do SoftwareSerial |

> [!NOTE]
> O módulo Bluetooth HC-05 é operado via **`SoftwareSerial`** a uma taxa de **9600 bps**, liberando a porta serial física do Arduino (pinos 0 e 1) para depuração ou upload sem conflitos.

---

## 🎮 Comandos de Controle (Protocolo Bluetooth)

O aplicativo no smartphone envia caracteres ASCII via Bluetooth para controlar a movimentação e a velocidade:

### 1. Comandos de Direção
* **`F`** – **Frente:** Ambos os motores giram no sentido horário / direto.
* **`B`** – **Trás:** Ambos os motores giram no sentido inverso.
* **`L`** – **Esquerda:** Motor esquerdo para e motor direito avança.
* **`R`** – **Direita:** Motor direito para e motor esquerdo avança para trás (rotação no próprio eixo).
* **`S`** – **Parar:** Desliga todos os motores instantaneamente.

### 2. Comandos de Velocidade (PWM)
* **`1`** – **25%** da velocidade máxima (PWM ~ 63)
* **`2`** – **33%** da velocidade máxima (PWM ~ 85)
* **`3`** – **50%** da velocidade máxima (PWM ~ 127)
* **`4`** – **100%** da velocidade máxima (PWM = 255)

---

## ⚠️ Observação sobre o arquivo `exemplo_app.ino`

O arquivo [`exemplo_app.ino`](file:///home/rpb/IFPI_26.2/TEI%20-%204301/TEI_4301_26/Aula_1709_Carro_RC_Bluetooth/exemplo_app.ino) presente na raiz deste diretório é apenas um código de referência genérico que acompanha o app Android [Bluetooth Car Controller](https://play.google.com/store/apps/details?id=com.giristuido.bluetooth.car.controller&pcampaignid=web_share).

**Atenção:** Esse arquivo de exemplo **não** deve ser utilizado diretamente neste robô, pois utiliza mapeamentos de pinos e chamadas seriais diferentes. O código funcional e devidamente ajustado para a nossa montagem está em [`src/main.cpp`](file:///home/rpb/IFPI_26.2/TEI%20-%204301/TEI_4301_26/Aula_1709_Carro_RC_Bluetooth/src/main.cpp).

---

## 🛠️ Como Compilar e Gravar no Arduino

Este projeto está pronto para compilação com o **PlatformIO**:

1. Abra o VS Code e certifique-se de ter a extensão **PlatformIO IDE** instalada.
2. Abra a pasta `Aula_1709_Carro_RC_Bluetooth/`.
3. Conecte o Arduino UNO ao computador via cabo USB.
4. Para compilar o código:
   ```bash
   pio run
   ```
5. Para gravar no microcontrolador:
   ```bash
   pio run --target upload
   ```
6. Instale o app [Bluetooth Car Controller na Play Store](https://play.google.com/store/apps/details?id=com.giristuido.bluetooth.car.controller&pcampaignid=web_share) no seu smartphone Android.
7. Emparelhe o smartphone com o módulo HC-05 via configurações de Bluetooth do aparelho (código PIN padrão usualmente `1234` ou `0000`).
8. Abra o aplicativo, conecte-se ao HC-05 e controle o robô!
