const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";


getDeck();

async function getDeck(){

    const id =  await getId();

    getCardsCom(id);
    getCardsPlayer(id);

}



async function getCardsCom(id){
    console.log(id);
    const com = document.getElementById("com");

    const cards = await getCards(id);

    cards.forEach(element => {
        const image = document.createElement("img");

        image.src = element['image'];

        com.appendChild(image);
    });
    
}

async function getCardsPlayer(id){
    console.log(id);
    const com = document.getElementById("player");

    const cards = await getCards(id);

    cards.forEach(element => {
        const image = document.createElement("img");

        image.src = element['image'];

        com.appendChild(image);
    });
    
}

async function getCards(id){
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`);
    const cards = await response.json();

    return cards['cards'];
}


async function getId(){
    const response = await fetch(url);
    const data = await response.json();

    return data['deck_id'];
}