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
const msgBox = document.querySelector("#msg-box");
const msgDelay = 60;

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
    await frase1;
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