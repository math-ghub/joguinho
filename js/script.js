// ---- Menu ---- //

const menu = document.querySelector("#menu");
const gameplay = document.querySelector("#gameplay");
const playButton = document.querySelector("#jogar");
const optionsButton = document.querySelector("#opcoes");

playButton.addEventListener("click", () => {
    startGame();
})

// ---- Gameplay ---- //

const bot = document.querySelector("#bot");
const rosto = document.querySelector("#rosto");
const maoDireita = document.querySelector("#mao-direita");
const maoEsquerda = document.querySelector("#mao-esquerda");
const msgBox = document.querySelector("#msg-box");
const msgDelay = 60;
let selectionModeActive = false;
let seconds = 0.5;

const coposContainer = document.querySelector("#copos-container");
const copos = document.getElementsByClassName("copo");
let copoBolinha;
let selected;

async function startGame() {
    menu.style.display = "none";
    gameplay.style.display = "block";

    maoDireita.classList.add("acenando");

    // ---------------------
    const introducao = msg("olá, seja bem vindo ao meu jogo!", 2);
    await introducao;
    maoDireita.classList.remove("acenando");
    
    // ---------------------
    rosto.classList.add("rosto-lingua2");
    maoDireita.classList.add("mao-v");
    const frase1 = msg("tente memorizar onde está a bolinha!", 3);
    spawnBola();
    await frase1;
    rosto.classList.remove("rosto-lingua2");
    maoDireita.classList.remove("mao-v");

    // ---------------------
    await startRound(5);
    await selectionMode();

    // ---------------------
    if (!selected) return gameOver();
    selected = false;

    rosto.classList.add("rosto-assustado");
}

Array.from(copos).forEach(copo => {
    copo.onclick = () => {
        if (selectionModeActive) {
            if (copo.classList.contains("bolinha")) {
                selected = true;
                copo.classList.remove("bolinha");
                setTimeout(() => copo.classList.add("bolinha"), 50);
            } else {
                copo.classList.add("show");
            }
            selectionModeActive = false;

        }
    }
})

function gameOver() {
    rosto.classList.add("rosto-rindo");
    msg("você perdeu!", 1);
}

async function selectionMode() {
    Array.from(copos).forEach(copo => copo.classList.add("canSelect"));

    selectionModeActive = true;

    while (selectionModeActive) {
        await timer(0.2);
    }

    Array.from(copos).forEach(copo => copo.classList.remove("canSelect"));
}

function switchCup(h1, c1, h2, c2) {
    const old_h1 = h1.getBoundingClientRect().left;
    const old_h2 = h2.getBoundingClientRect().left;

    const old_c1 = c1.getBoundingClientRect().left;
    const old_c2 = c2.getBoundingClientRect().left;

    const present_h1 = parseInt(h1.style.left);
    const present_h2 = parseInt(h2.style.left);

    const present_c1 = new WebKitCSSMatrix(window.getComputedStyle(c1).transform);
    const present_c2 = new WebKitCSSMatrix(window.getComputedStyle(c2).transform);

    h1.style.left = present_h1 + old_h2 - old_h1 + "px";
    h2.style.left = present_h2 + old_h1 - old_h2 + "px";

    c1.style.transform = "translateX(" + (present_c1.m41 + old_c1 - old_c2) + "px)";
    c2.style.transform = "translateX(" + (present_c2.m41 + old_c2 - old_c1) + "px)";

    setTimeout(() => {
        h1.classList.remove("grab");
        h2.classList.remove("grab");

        c1.classList.remove("grab"); 
        c2.classList.remove("grab");
    }, seconds * 1000);
}

function grab(hand, cup) {
    const handRect = hand.getBoundingClientRect();
    const cupRect = cup.getBoundingClientRect();

    hand.classList.add("mao-aberta");

    const leftVal = hand.style.left != "" ? parseInt(hand.style.left) : 0;

    hand.style.left = leftVal + cupRect.left - handRect.left + 10 + "px";
    hand.style.bottom = "-330px";

    setTimeout(() => {
        hand.classList.remove("mao-aberta");
        hand.classList.add("grab");
    
        cup.classList.add("grab");
    }, 500);
    
}

function selectCup(list) {
    const rand = Math.round(Math.random() * (list.length - 1));
    const copo = list[rand];
    list.splice(rand, 1);
    return copo;
}

function spawnBola() {
    copoBolinha = copos[Math.round(Math.random() * 2)];
    copoBolinha.classList.add("bolinha");
}

async function startRound(rounds) {
    rosto.classList.add("rosto-feliz");
    maoDireita.classList.add("mao-aberta");
    msg("", 0);

    maoEsquerda.style.display = "block";
    maoEsquerda.classList.add("mao-aberta");

    await timer(1);

    for (let i = 0; i < rounds; i++) {
        let coposDisponiveis = Array.from(copos);
        let copo_esquerdo = selectCup(coposDisponiveis);
        let copo_direito = selectCup(coposDisponiveis);

        grab(maoEsquerda, copo_esquerdo);
        grab(maoDireita, copo_direito);
    
        await timer(seconds);
        
        switchCup(maoEsquerda, copo_esquerdo, maoDireita, copo_direito);

        await timer(seconds);
    }

    rosto.classList.remove("rosto-feliz");

    maoDireita.classList.add("mao-aberta");
    maoEsquerda.classList.add("mao-aberta");

    maoDireita.style.left = "0px";
    maoDireita.style.bottom = "-200px";

    maoEsquerda.style.left = "0px";
    maoEsquerda.style.bottom = "-200px";

    await timer(seconds);
}

async function timer(ms) {
    await new Promise((r) => {setTimeout(() => r(), ms * 1000)});
}

async function msg(text, delay) {
    for (let i = 0; i < text.length; i++) {
        const timer = new Promise((r) => {
            setTimeout(() => {
                msgBox.innerText = text.substring(0, i + 1) + "|";
                r();
            }, msgDelay)
        })
        await timer;
    }
    
    msgBox.innerText = text;
    await new Promise((r) => {setTimeout(() => {r()}, delay * 1000)})
}