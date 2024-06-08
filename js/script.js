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

const coposContainer = document.querySelector("#copos-container");
const copos = document.getElementsByClassName("copo");
let copoBolinha;

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
    maoDireita.classList.add("mao-v")
    const frase1 = msg("tente memorizar onde está a bolinha!", 3);
    spawnBola();
    await frase1;
    rosto.classList.remove("rosto-lingua2");
    maoDireita.classList.remove("mao-v");

    // ---------------------
    startRound();
}

function switchCup() {

}

function grab(hand, cup) {
    const handRect = hand.getBoundingClientRect();
    const cupRect = cup.getBoundingClientRect();

    const leftVal = hand.style.left != "" ? parseInt(hand.style.left) : 0

    hand.style.left = leftVal + cupRect.left - handRect.left + "px";
    hand.style.bottom = "-330px";
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

function startRound() {
    const coposDisponiveis = Array.from(copos);

    rosto.classList.add("rosto-feliz");
    maoDireita.classList.add("mao-aberta");
    msg("", 0);

    maoEsquerda.style.display = "block";
    maoEsquerda.classList.add("mao-aberta");
    
    setTimeout(() => {
        const copo_esquerdo = selectCup(coposDisponiveis);
        const copo_direito = selectCup(coposDisponiveis);

        grab(maoEsquerda, copo_esquerdo);
        grab(maoDireita, copo_direito);
    }, 1000);
    


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