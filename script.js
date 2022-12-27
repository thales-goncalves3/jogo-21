

const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

const buttons = document.querySelectorAll("input");


class Player {
    constructor(name, countCards, balance) {
        this.name = name;
        this.countCards = countCards;
        this.balance = balance;
    }

}

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

comecarJogo(player);

function getNameAndBalance() {
    let name = prompt("Your name: ");
    let balance = prompt("Your balance: ");
    const player = new Player('player', 0, parseInt(balance));

    if (name == null || balance == null) alert("The fields can't be null");
    else {
        player.name = name;
        const value = document.getElementById("balanceValue");
        value.innerHTML = parseInt(balance);
    }

    return player;
}


const computador = new Player('Comp', 0);



async function comecarJogo(player) {
    const id = await pegaIdBaralho();

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
        }, 2000);




    })

}

async function restartGame(playerStart) {
    const com = document.getElementById('com');
    const player = document.getElementById('player');
    const count = document.getElementById('countPlayer');
    const bet = document.getElementById('bet');

    while (com.firstChild) {
        com.removeChild(com.lastChild);
    }

    while (player.firstChild) {
        player.removeChild(player.lastChild);
    }

    playerStart.countCards = 0;
    count.innerHTML = '0';
    bet.innerHTML = '0';

    await comecarJogo(playerStart);
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





