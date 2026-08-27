//importando recursos das bibliotecas
// const { app, BrowserWindow, Menu, dialog } = require("electron");
import { app, BrowserWindow, Menu, dialog } from "electron";

let win = null; //win AGORA É GLOBAL
let portaConectada = false;
let perguntasCarregadas = null;

//configurando a janela
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //configurações abaixo facilitam a modificação do conteúdo dentro da página
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("inicio.html");
}

// Template de personalização do menu
const menuTemplate = [
  {
    label: "Opções",
    submenu: [
      {
        label: "Conectar botões",
        accelerator: "F2",
        click: () => {
          //TODO: implementar a seleção e conexão com a porta serial do Arduino
          portaConectada = true; //simulação.
        },
      },
      {
        label: "Abrir perguntas",
        accelerator: "F3",
        click: async () => {
          try {
            const result = await dialog.showOpenDialog(win, {
              title: "Abrir arquivo de perguntas",
              filters: [{ name: "Arquivos JSON", extensions: ".json" }],
              properties: ["openFile"],
            });
            // perguntasCarregadas =
          } catch (err) {
            console.log(err);
          }
        },
      },
      {
        label: "Iniciar jogo",
        accelerator: "F5",
        click: () => {
          //TODO: verificar se a porta serial está conectada e se as perguntas foram carregadas.
          win.loadFile("index.html");
        },
      },
      {
        type: "separator",
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
    ], //final submenu
  },
]; //final menuTemplate

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  createWindow();
});
