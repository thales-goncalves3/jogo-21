const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";


startGame();

async function startGame() {
    const id = await getId();

    getDeck(id);

    const buttonBuyCard = document.getElementById('buy');
    buttonBuyCard.addEventListener('click', async () => {
        const card = await getCards(id, 1);

        const divPlayer = document.getElementById('player');
        const image = document.createElement('img');
        image.src = card[0]['image'];
        console.log(card[0]);

        divPlayer.appendChild(image);
    });

}


async function getDeck(id) {

    showSum('countCom', await getCardsCom(id));
    showSum('countPlayer', await getCardsPlayer(id));


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


async function showSum(player, values) {
    const scoreboard = document.getElementById(player);


    const special = ['KING', 'QUEEN', 'JACK', 'ACE'];
    var sum = 0;

    values.forEach((element, index) => {
        if (index == 0 && element == 'ACE') {
            sum += 11;

        } else {
            if (special.includes(element)) {
                sum += 10;
            } else {

                sum += parseInt(element);
            }
        }

    })

    scoreboard.innerHTML = sum;

}