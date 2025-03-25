
const challenges = [
    "Írj egy cetlit valakinek, amiben megdicséred.",
    "Adj egy ölelést valakinek ma – csak úgy.",
    "Pakolj el valamit valaki helyett, titokban.",
    "Rajzolj egy képet, és ajándékozd oda egy családtagnak.",
    "Írj egy kedves üzenetet a tükörre fogkrémmel (vagy post-ittel)."
];

function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

function displayCards() {
    const container = document.getElementById('cards');
    const options = shuffle([...challenges]).slice(0, 3);
    options.forEach(text => {
        const div = document.createElement('div');
        div.className = 'card';
        div.textContent = text;
        div.onclick = () => {
            alert("Ma ez lesz a kedvességed: " + text);
        };
        container.appendChild(div);
    });
}

displayCards();
