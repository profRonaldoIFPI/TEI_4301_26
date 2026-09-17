# TEI 4301 - Tópicos Especiais em Inovação (2026.2)

Repositório central com os códigos-fonte, práticas de laboratório e projetos de sistemas embarcados, robótica e integração hardware/software desenvolvidos na disciplina de **Tópicos Especiais em Inovação**.

---

## 🎓 Informações da Disciplina

* **Instituição:** Instituto Federal de Educação, Ciência e Tecnologia do Piauí (IFPI)
* **Disciplina:** Tópicos Especiais em Inovação
* **Código:** TEI - 4301
* **Turma:** 4301
* **Período Letivo:** 2026.2
* **Professor:** Ronaldo P. B.

---

## 📂 Projetos e Práticas Desenvolvidas

Abaixo estão listados os projetos e aulas práticas presentes no repositório. Cada diretório contém sua documentação específica com esquemas, pinagens e instruções de execução:

| Projeto / Aula | Descrição Resumida | Link para Detalhes |
| :--- | :--- | :---: |
| ⚙️ **Aula 03/09 - Controle Motor CC** | Prática de controle de rotação e variação de velocidade PWM em motores CC com Ponte H L298N e Arduino. | [📖 Ver README](Aula_0309_Controle%20Motor%20CC/README.md) |
| 🚗 **Aula 17/09 - Carro RC Bluetooth** | Robô móvel 2WD com Arduino UNO, Ponte H L298N e módulo Bluetooth HC-05 controlado via aplicativo de smartphone. | [📖 Ver README](Aula_1709_Carro_RC_Bluetooth/README.md) |
| 🎮 **Quiz Game (Arduino + Electron)** | Sistema integrado de quiz para dois times com detecção de reflexo via interrupções de hardware e app desktop em Electron. | [📖 Ver README](QuizGame/README.md) |

---

## 🗂️ Estrutura do Repositório

```text
TEI_4301_26/
├── README.md                              # Informações da disciplina e índice de projetos (este arquivo)
├── Aula_0309_Controle Motor CC/           # Diretório da prática de 03/09
│   ├── README.md                          # Documentação técnica e pinagem da Ponte H
│   └── ponte_h.ino                        # Código Arduino
├── Aula_1709_Carro_RC_Bluetooth/          # Diretório da prática de 17/09
│   ├── README.md                          # Documentação completa, protocolo Bluetooth e PlatformIO
│   ├── platformio.ini                     # Configuração de build
│   ├── exemplo_app.ino                    # Código de referência
│   └── src/main.cpp                       # Firmware C++ do robô
└── QuizGame/                              # Diretório do projeto Quiz Game
    ├── README.md                          # Visão geral do sistema e comunicação serial
    ├── spec.md                            # Especificação técnica completa
    ├── Atividade.md                       # Roteiro e material didático
    ├── Codigo.gs                          # Script Google Apps Script
    ├── Arduino/                           # Firmware C++ (PlatformIO / Wokwi)
    └── AppDesktop/                        # Aplicativo Desktop (Electron.js / Node.js)
```

---

## 📥 Como Clonar

Para clonar este repositório completo com todos os projetos:

```bash
git clone https://github.com/profRonaldoIFPI/TEI_4301_26.git
cd TEI_4301_26
```
