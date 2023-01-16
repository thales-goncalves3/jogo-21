

const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

const buttons = document.querySelectorAll(".betInput");



function createButtons() {
    const buyButton = document.createElement('button');
    buyButton.classList.add('button');
    buyButton.classList.add('buy');
    buyButton.id = 'buy';
    buyButton.innerHTML = 'Comprar';

    const stopButton = document.createElement('button');
    stopButton.classList.add('button');
    stopButton.classList.add('stop');
    stopButton.id = 'stop';
    stopButton.innerHTML = 'Parar';

    const buttonDiv = document.getElementById('buttons');
    buttonDiv.appendChild(buyButton);
    buttonDiv.appendChild(stopButton);

}


class Player {
    constructor(name, countCards, balance, bet) {
        this.name = name;
        this.countCards = countCards;
        this.balance = balance;
        this.bet = bet;
    }

}

const computador = new Player('Comp', 0);

buttons.forEach((button) => {
    const balanceValue = document.getElementById("balanceValue");
    const bet = document.getElementById("bet");
    balanceValue.innerHTML = '0';
    bet.innerHTML = '0';
    button.addEventListener('click', () => {
        player.balance -= parseInt(button.value);
        player.bet += parseInt(button.value);
        bet.innerHTML = player.bet;
        balanceValue.innerHTML = player.balance;
    })
})

const player = getNameAndBalance();


function getNameAndBalance() {
    let name = prompt("Your name: ");
    let balance = prompt("Your balance: ");



    if (name == null || balance == null) alert("The fields can't be null");
    else {
        const player = new Player(name, 0, parseInt(balance), 0);
        const value = document.getElementById("balanceValue");
        value.innerHTML = parseInt(balance);
        return player;
    }

}

startGame(player);

async function startGame(player) {
    const id = await getId();
    createButtons();
    getInicialCards(id, player);
    const buttonBuyCard = document.getElementById('buy');
    const buttonStop = document.getElementById('stop');

    buttonBuyCard.addEventListener('click', async () => {
        const carta = await buyCard(id, 1);
        renderCards(carta[0], 'player');
        sumCards(carta[0], '', player);
        renderScore(player);

        setTimeout(() => {
            if (player.countCards > 21) {
                alert('estourou');
                newGameButton(player, computador);

            }
            else if (player.countCards == 21) alert('blackjack');
        }, 500);

    });

    buttonStop.addEventListener('click', async () => {
        const div = document.getElementById("com");
        const image = div.getElementsByTagName('img')[1];
        const balanceValue = document.getElementById('balanceValue');
        const bet = document.getElementById('bet').textContent;


        const src = image.src;
        div.removeChild(image);
        const newImage = document.createElement("img");
        newImage.src = src;
        newImage.classList.add("animate__animated");
        newImage.classList.add("animate__flipInY");
        div.appendChild(newImage);


        while (computador.countCards < 21 && computador.countCards <= 16) {


            const carta = await buyCard(id, 1);
            renderCards(carta[0], 'com');
            sumCards(carta[0], '', computador);

            if (computador.countCards > player.countCards) break;

        }

        setTimeout(() => {
            if (computador.countCards > 21) {
                player.balance += parseInt(bet) * 2;
                alert("a mesa perde");
            }
            else if (computador.countCards < player.countCards) {
                player.balance += parseInt(bet) * 2;
                alert("a mesa perde");
            }
            else if (computador.countCards > player.countCards) {
                alert("a mesa ganha");
            }
            else if (computador.countCards == player.countCards) {
                player.balance += parseInt(bet);
                alert("a mesa devolve")
            };


            balanceValue.innerHTML = player.balance;
            newGameButton();
        }, 2000);




    })


}

function newGameButton() {
    const newGameDiv = document.getElementById("newGame");
    const button = document.createElement('button');
    button.innerHTML = 'New Game';
    button.classList.add('button');
    button.classList.add('buttonNewGame');
    button.classList.add('buy');
    button.id = 'buttonNewGame';
    button.addEventListener('click', newGame);
    newGameDiv.appendChild(button);
}

function newGame() {
    player.countCards = 0;
    player.bet = 0;
    computador.countCards = 0;

    const countPlayer = document.getElementById("countPlayer");
    const bet = document.getElementById("bet");
    bet.innerHTML = player.bet;
    countPlayer.innerHTML = '';

    const divCom = document.getElementById("com");
    var comChild = divCom.lastElementChild;

    const divPlayer = document.getElementById("player");
    var playerChild = divPlayer.lastElementChild;

    while (comChild) {
        divCom.removeChild(comChild);
        comChild = divCom.lastElementChild;
    }

    while (playerChild) {
        divPlayer.removeChild(playerChild);
        playerChild = divPlayer.lastElementChild;
    }

    const newGameButton = document.getElementById("buttonNewGame");
    const buy = document.getElementById("buy");
    const stop = document.getElementById("stop");

    newGameButton.remove();
    buy.remove();
    stop.remove();



    startGame(player);

}



function renderScore(player) {
    const div = document.getElementById('countPlayer');
    div.innerHTML = player.countCards;
}


async function getInicialCards(id, player) {

    const cartasJogador = await buyCard(id, 2);
    const cartasComputador = await buyCard(id, 2);

    for (let index = 0; index < 2; index++) {

        renderCards(cartasJogador[index], 'player');
        renderCards(cartasComputador[index], 'com');
        sumCards(cartasComputador[index], index, computador);
        sumCards(cartasJogador[index], index, player);

    }

    const div = document.getElementById("com");
    const image = div.getElementsByTagName("img")[1];
    image.classList.add('back');

    renderScore(player);

}

function renderCards(carta, jogador) {
    const divJogador = document.getElementById(jogador);

    divJogador.appendChild(criaElementoImagem(carta['image']));

}

function criaElementoImagem(caminho) {
    const image = document.createElement("img");
    image.src = caminho;
    image.classList.add('animate__animated');
    image.classList.add('animate__bounceInRight');
    return image;
}

function sumCards(carta, index = null, jogador) {
    const especiais = ['ACE', 'QUEEN', 'KING', 'JACK'];
    if (especiais.includes(carta['value'])) {
        if (carta['value'] == especiais[0]) {
            jogador.countCards += 1;
        } else {
            jogador.countCards += 10;
        }
    } else {
        jogador.countCards += parseInt(carta['value']);
    }

}




async function buyCard(id, quantidade) {
    const resposta = await fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=${quantidade}`);
    const carta = await resposta.json();
    return carta['cards'];
}


async function getId() {
    const resposta = await fetch(url);
    const id = await resposta.json();

    return id['deck_id'];
}





