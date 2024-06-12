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
    rosto.classList.add("rosto-feliz");
    await startRound(5);

    rosto.classList.remove("rosto-feliz");
    await selectionMode();

    // ---------------------
    if (!selected) return gameOver();
    selected = false;

    rosto.classList.add("rosto-assustado");

    showBolinha();
    await timer(2);
    resetCups();

    rosto.classList.remove("rosto-assustado");
    maoDireita.classList.remove("mao-aberta");
    maoEsquerda.classList.remove("mao-aberta");

    // ---------------------
    rosto.classList.add("rosto-emburrecido");
    maoDireita.classList.add("mao-palmas");
    maoEsquerda.style.display = "none";

    const frase1_p2 = msg("vamos mais uma vez!", 1);
    await frase1_p2;

    rosto.classList.remove("rosto-emburrecido");
    maoDireita.classList.remove("mao-palmas");
    maoDireita.style.display = "none";

    // ---------------------
    rosto.classList.add("rosto-desconfiado");
    spawnBola();
    await timer(3);

    setDifficulty(0.3);
    await startRound(12);

    await selectionMode();
    rosto.classList.remove("rosto-desconfiado");

    // ---------------------
    if (!selected) return gameOver();
    selected = false;

    rosto.classList.add("rosto-enfurecido");

    showBolinha();
    await timer(2);
    resetCups();

    // ---------------------
    changeBackground("lightcoral");

    await timer(0.6);
    rosto.classList.add("rosto-tremulo");

    await timer(0.4);
    rosto.classList.add("rosto-bravo");

    // ---------------------
    spawnBola();
    await timer(3);

    setDifficulty(0.15);

    await startRound(20);
    await selectionMode();

    // ---------------------
    if (!selected) return gameOver();

}

function winner() {
    gameplay.display = "none";
    menu.display = "block";
}

function changeBackground(color) {
    gameplay.style.transition = "background-color 1s linear";
    gameplay.style.backgroundColor = color;
}

function setDifficulty(lvl) {
    maoDireita.style.transition = `left ${lvl}s ease-in-out, bottom ${lvl}s ease-in-out`;
    maoEsquerda.style.transition = `left ${lvl}s ease-in-out, bottom ${lvl}s ease-in-out`;

    Array.from(copos).forEach(copo => copo.style.transition = `transform ${lvl}s ease-in-out`);
    seconds = lvl;
}

function resetCups() {
    const bolinha = copoBolinha.getElementsByClassName("bola")[0];
    copoBolinha.classList.remove("bolinha");

    bolinha.style.opacity = 0;
    bolinha.style["animation-fill-mode"] = "forwards";
    bolinha.style.transform = "translate(0, 0)";

    Array.from(copos).forEach(copo => {
        copo.style.transform = "translate(0, 0)";
        copo.style.transition = "none";
    });
}

function showBolinha() {
    const bolinha = copoBolinha.getElementsByClassName("bola")[0];
    copoBolinha.style.transition = "none";

    copoBolinha.style.transform = `translate(${new WebKitCSSMatrix(window.getComputedStyle(copoBolinha).transform).m41}px, 50px)`;

    bolinha.style.opacity = 1;
    bolinha.style["animation-fill-mode"] = "none";
    bolinha.style.transform = `translate(${new WebKitCSSMatrix(window.getComputedStyle(bolinha).transform).m41}px, -50px)`;
}

Array.from(copos).forEach(copo => {
    copo.onclick = () => {
        if (selectionModeActive) {
            if (copo.classList.contains("bolinha")) {
                selected = true;
            } else {
                copo.classList.add("show");
            }
            selectionModeActive = false;

        }
    }
})

function gameOver() {
    rosto.className = "";
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
    }, seconds * 1000);
    
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
    maoDireita.style.display = "block";
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