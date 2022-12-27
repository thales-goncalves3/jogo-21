

const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

const buttons = document.querySelectorAll("input");

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
    constructor(name, countCards, balance) {
        this.name = name;
        this.countCards = countCards;
        this.balance = balance;
    }

}

const computador = new Player('Comp', 0);

buttons.forEach((button) => {
    const balanceValue = document.getElementById("balanceValue");
    const bet = document.getElementById("bet");
    let sum = 0;
    balanceValue.innerHTML = '0';
    bet.innerHTML = '0';
    button.addEventListener('click', () => {
        player.balance -= parseInt(button.value);
        sum += parseInt(button.value);
        bet.innerHTML = sum;
        balanceValue.innerHTML = player.balance;
    })
})

const player = getNameAndBalance();
console.log(player);

function getNameAndBalance() {
    let name = prompt("Your name: ");
    let balance = prompt("Your balance: ");



    if (name == null || balance == null) alert("The fields can't be null");
    else {
        const player = new Player(name, 0, parseInt(balance));
        const value = document.getElementById("balanceValue");
        value.innerHTML = parseInt(balance);
        return player;
    }

}

comecarJogo(player);

async function comecarJogo(player) {
    const id = await pegaIdBaralho();
    createButtons();
    pegaCartasIniciais(id, player);
    const botaoComprarCarta = document.getElementById('buy');
    const botaoParar = document.getElementById('stop');

    botaoComprarCarta.addEventListener('click', async () => {
        const carta = await compraCarta(id, 1);
        renderizaCartas(carta[0], 'player');
        somaCartas(carta[0], '', player);
        renderizaPlacar(player);

        setTimeout(() => {
            if (player.countCards > 21) {
                alert('estourou');
                newGameButton(player, computador);

            }
            else if (player.countCards == 21) alert('blackjack');
        }, 500);

    });

    botaoParar.addEventListener('click', async () => {
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


            const carta = await compraCarta(id, 1);
            renderizaCartas(carta[0], 'com');
            somaCartas(carta[0], '', computador);

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
    computador.countCards = 0;
    const countPlayer = document.getElementById("countPlayer");

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



    comecarJogo(player);

}



function renderizaPlacar(player) {
    const div = document.getElementById('countPlayer');
    div.innerHTML = player.countCards;
}


async function pegaCartasIniciais(id, player) {

    const cartasJogador = await compraCarta(id, 2);
    const cartasComputador = await compraCarta(id, 2);

    for (let index = 0; index < 2; index++) {

        renderizaCartas(cartasJogador[index], 'player');
        renderizaCartas(cartasComputador[index], 'com');
        somaCartas(cartasComputador[index], index, computador);
        somaCartas(cartasJogador[index], index, player);

    }

    const div = document.getElementById("com");
    const image = div.getElementsByTagName("img")[1];
    image.classList.add('back');

    renderizaPlacar(player);

}

function renderizaCartas(carta, jogador) {
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

function somaCartas(carta, index = null, jogador) {
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




async function compraCarta(id, quantidade) {
    const resposta = await fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=${quantidade}`);
    const carta = await resposta.json();
    return carta['cards'];
}


async function pegaIdBaralho() {
    const resposta = await fetch(url);
    const id = await resposta.json();

    return id['deck_id'];
}





