const { app, BrowserWindow, Menu } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "gray",
  });

  win.loadFile("inicio.html");
};

// personalização do menu

const menuTemplate = [
  {
    label: "Opções",
    submenu: [
      {
        label: "Conectar botões",
        accelerator: "F2",
        click: () => {
          //TODO: implementar a seleção e conexão com a porta serial do arduíno
        },
      },
      {
        label: "Abrir perguntas",
        accelerator: "F3",
        click: () => {
          //TODO: implementar a abertura de um arquivo de perguntas em .json e a troca para a tela de perguntas (index.html).
        },
      },
      {
        label: "Iniciar jogo",
        accelerator: "F5",
        click: () => {
          //TODO: implementar o início do jogo
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
    ],
  },
];

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  createWindow();
});
