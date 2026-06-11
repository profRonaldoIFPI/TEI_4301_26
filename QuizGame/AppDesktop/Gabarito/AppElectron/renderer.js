const { ipcRenderer } = require("electron");

let perguntas = [];
let indicePerguntaAtual = 0;
let respostaSelecionada = null;
let confirmado = false;

// Elementos do DOM
const perguntaText = document.querySelector(".pergunta p");
const respostasOl = document.querySelector(".respostas ol");
const tempoPerguntaText = document.querySelector(".tempo p");
const gameTimerText = document.querySelector("footer div:nth-child(2) p:nth-child(2)");
const pontosVermelhoText = document.querySelector(".pontos.vermelho");
const pontosAzulText = document.querySelector(".pontos.azul");

const btnConfirmar = document.querySelector(".botoes button:nth-child(1)");
const btnProximo = document.querySelector(".botoes button:nth-child(2)");

// Pontuação
let placarVermelho = 0;
let placarAzul = 0;

// Timers
let timerPerguntaInterval = null;
let timerJogoInterval = null;
let tempoRestante = 30;
let tempoJogoTotal = 0;

// Injetar estilos CSS adicionais para destacar as respostas e placar interativo
const style = document.createElement("style");
style.innerHTML = `
  .respostas ol li {
    margin-bottom: 10px;
  }
  .respostas ol li a {
    display: block;
    padding: 10px 15px;
    border-radius: 8px;
    color: #333;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    font-size: 2rem;
  }
  .respostas ol li a:hover {
    background-color: rgba(52, 152, 219, 0.1);
  }
  .respostas ol li a.selecionado {
    background-color: rgba(52, 152, 219, 0.2);
    border-color: #3498db;
    font-weight: bold;
  }
  .respostas ol li a.correta {
    background-color: rgba(46, 204, 113, 0.3) !important;
    border-color: #2ecc71 !important;
    color: #27ae60 !important;
    font-weight: bold;
  }
  .respostas ol li a.incorreta {
    background-color: rgba(231, 76, 60, 0.3) !important;
    border-color: #e74c3c !important;
    color: #c0392b !important;
  }
  .pontos {
    cursor: pointer;
    user-select: none;
    transition: transform 0.1s ease;
  }
  .pontos:active {
    transform: scale(0.95);
  }
`;
document.head.appendChild(style);

// Inicializar o jogo
async function init() {
  perguntas = await ipcRenderer.invoke("obter-perguntas");
  
  if (!perguntas || perguntas.length === 0) {
    alert("Nenhuma pergunta carregada! Por favor, abra um arquivo JSON de perguntas (F3).");
    window.location.href = "inicio.html";
    return;
  }

  indicePerguntaAtual = 0;
  placarVermelho = 0;
  placarAzul = 0;
  tempoJogoTotal = 0;
  
  pontosVermelhoText.innerText = placarVermelho;
  pontosAzulText.innerText = placarAzul;
  
  iniciarTimerJogo();
  carregarPergunta();
}

function carregarPergunta() {
  confirmado = false;
  respostaSelecionada = null;
  tempoRestante = 30;
  tempoPerguntaText.innerText = tempoRestante;
  tempoPerguntaText.parentNode.style.borderColor = "greenyellow";
  
  const p = perguntas[indicePerguntaAtual];
  perguntaText.innerText = p.pergunta;
  
  respostasOl.innerHTML = "";
  p.respostas.forEach((resposta, index) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.innerText = resposta;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirmado) return;
      
      // Limpa seleções anteriores
      document.querySelectorAll(".respostas ol li a").forEach(el => el.classList.remove("selecionado"));
      
      // Seleciona a atual
      a.classList.add("selecionado");
      respostaSelecionada = index;
    });
    li.appendChild(a);
    respostasOl.appendChild(li);
  });
  
  iniciarTimerPergunta();
}

function iniciarTimerPergunta() {
  if (timerPerguntaInterval) clearInterval(timerPerguntaInterval);
  
  timerPerguntaInterval = setInterval(() => {
    tempoRestante--;
    tempoPerguntaText.innerText = tempoRestante;
    
    if (tempoRestante <= 10) {
      tempoPerguntaText.parentNode.style.borderColor = "red";
    }
    
    if (tempoRestante <= 0) {
      clearInterval(timerPerguntaInterval);
      revelarRespostaCorreta();
      alert("Tempo esgotado para esta pergunta!");
    }
  }, 1000);
}

function iniciarTimerJogo() {
  if (timerJogoInterval) clearInterval(timerJogoInterval);
  
  timerJogoInterval = setInterval(() => {
    tempoJogoTotal++;
    const minutos = String(Math.floor(tempoJogoTotal / 60)).padStart(2, '0');
    const segundos = String(tempoJogoTotal % 60).padStart(2, '0');
    gameTimerText.innerText = `${minutos}:${segundos}`;
  }, 1000);
}

function revelarRespostaCorreta() {
  confirmado = true;
  if (timerPerguntaInterval) clearInterval(timerPerguntaInterval);
  
  const p = perguntas[indicePerguntaAtual];
  const links = document.querySelectorAll(".respostas ol li a");
  
  links.forEach((a, index) => {
    if (index === p.respostaCorreta) {
      a.classList.remove("selecionado");
      a.classList.add("correta");
    } else if (index === respostaSelecionada) {
      a.classList.remove("selecionado");
      a.classList.add("incorreta");
    }
  });
}

// Botão Confirmar
btnConfirmar.addEventListener("click", () => {
  if (confirmado) return;
  if (respostaSelecionada === null) {
    alert("Selecione uma resposta antes de confirmar!");
    return;
  }
  
  revelarRespostaCorreta();
  
  const p = perguntas[indicePerguntaAtual];
  if (respostaSelecionada === p.respostaCorreta) {
    // Alerta informativo: o ponto pode ser creditado clicando no placar correspondente
    console.log("Resposta correta! Clique no placar de um dos times para atribuir a pontuação.");
  }
});

// Botão Próximo
btnProximo.addEventListener("click", () => {
  if (!confirmado) {
    const querPular = confirm("A pergunta atual ainda não foi respondida. Deseja pular?");
    if (!querPular) return;
  }
  
  indicePerguntaAtual++;
  if (indicePerguntaAtual < perguntas.length) {
    carregarPergunta();
  } else {
    clearInterval(timerPerguntaInterval);
    clearInterval(timerJogoInterval);
    alert(`Fim do Jogo!\n\nPlacar Final:\nVermelho: ${placarVermelho} | Azul: ${placarAzul}`);
    window.location.href = "inicio.html";
  }
});

// Controles manuais do placar (clique esquerdo soma, clique direito subtrai)
pontosVermelhoText.addEventListener("click", () => {
  placarVermelho++;
  pontosVermelhoText.innerText = placarVermelho;
});
pontosVermelhoText.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (placarVermelho > 0) {
    placarVermelho--;
    pontosVermelhoText.innerText = placarVermelho;
  }
});

pontosAzulText.addEventListener("click", () => {
  placarAzul++;
  pontosAzulText.innerText = placarAzul;
});
pontosAzulText.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (placarAzul > 0) {
    placarAzul--;
    pontosAzulText.innerText = placarAzul;
  }
});

init();
