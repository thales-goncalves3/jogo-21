const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

class Player {
    constructor(name, countCards) {
        this.name = name;
        this.countCards = countCards;
    }

}

const thales = new Player('Thales', 0);
const computador = new Player('Comp', 0);



startGame();

async function startGame() {
    const id = await getId();
    thales.countCards = 0;
    getDeck(id);

    const buttonBuyCard = document.getElementById('buy');
    buttonBuyCard.addEventListener('click', async () => {
        const card = await getCards(id, 1);

        const divPlayer = document.getElementById('player');
        const image = document.createElement('img');
        image.src = card[0]['image'];

        showSum(thales, 'countPlayer', card[0]['value']);
        divPlayer.appendChild(image);
    });

}


async function getDeck(id) {

    showSum(computador, 'countCom', await getCardsCom(id));
    showSum(thales, 'countPlayer', await getCardsPlayer(id));

}



async function getCardsCom(id) {

    const com = document.getElementById("com");
    var values = [];
    const cards = await getCards(id, 2);

    cards.forEach(element => {
        const image = document.createElement("img");
        values.push(element['value']);
        image.src = element['image'];

        com.appendChild(image);
    });

    return values;

}

async function getCardsPlayer(id) {

    const com = document.getElementById("player");
    var values = [];
    const cards = await getCards(id, 2);

    cards.forEach(element => {
        const image = document.createElement("img");
        values.push(element['value']);
        image.src = element['image'];

        com.appendChild(image);
    });

    return values;
}

async function getCards(id, amount) {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=${amount}`);
    const cards = await response.json();

    return cards['cards'];
}


async function getId() {
    const response = await fetch(url);
    const data = await response.json();

    return data['deck_id'];
}


async function showSum(player, scoreDiv, values) {
    const score = document.getElementById(scoreDiv);


    if (Array.isArray(values)) {
        values.forEach((element, index) => {
            verifyCards(player, element, index);
        })
    } else {

        verifyCards(player, values, 1);

    }

    score.innerHTML = player.countCards;

}

function verifyCards(player, element, index) {

    const special = ['KING', 'QUEEN', 'JACK', 'ACE'];

    if (index == 0 && element == 'ACE') {
        player.countCards += 11;

    } else {
        if (special.includes(element)) {
            player.countCards += 10;
        } else {

            player.countCards += parseInt(element);
        }
    }


    if (player.countCards > 21) {
        alert("lose");
        window.location.reload();
    }

}
