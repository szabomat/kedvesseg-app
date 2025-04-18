
// Firebase konfiguráció
const firebaseConfig = {
  apiKey: "AIzaSyDT6pkTGe0COhjZU6cR8B2jo8xvL930bXs",
  authDomain: "kedvesseg-app.firebaseapp.com",
  projectId: "kedvesseg-app",
  storageBucket: "kedvesseg-app.firebasestorage.app",
  messagingSenderId: "50423971619",
  appId: "1:50423971619:web:120d549c27c8a58cfb5696"
};

// Inicializálás
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Kihívások listája
const challenges = [
  "Írj egy cetlit valakinek, amiben megdicséred.",
  "Adj egy ölelést valakinek ma – csak úgy.",
  "Pakolj el valamit valaki helyett, titokban.",
  "Rajzolj egy képet, és ajándékozd oda egy családtagnak.",
  "Írj egy kedves üzenetet a tükörre fogkrémmel (vagy post-ittel)."
];

// Név bekérése
function askName() {
  let name = localStorage.getItem('username');
  if (!name) {
    name = prompt("Hogy hívhatunk téged?");
    if (name) {
      localStorage.setItem('username', name);
    }
  }
  return name;
}

// Dátum lekérése
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Kedvesség mentése Firestore-ba
async function saveChoice(name, challenge) {
  const date = getTodayDate();
  await db.collection("choices").doc(name + "_" + date).set({
    user: name,
    challenge: challenge,
    date: date,
    completed: true
  });
}

// Kártyák megjelenítése
function displayCards() {
  const name = askName();
  if (!name) return;

  const container = document.getElementById('cards');
  container.innerHTML = "";
  const shuffled = challenges.sort(() => 0.5 - Math.random()).slice(0, 3);

  shuffled.forEach(text => {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = text;
    div.onclick = async () => {
      alert("Ma ez lesz a kedvességed: " + text);
      await saveChoice(name, text);
    };
    container.appendChild(div);
  });
}

// Kedvesség-napló megjelenítése
async function showLog() {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML = "<em>Betöltés...</em>";
  const snapshot = await db.collection("choices").get();
  const entries = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    entries.push(data);
  });
  entries.sort((a, b) => a.date.localeCompare(b.date));
  logDiv.innerHTML = entries.map(e =>
    `<div class="log-entry"><strong>${e.date}</strong>: <em>${e.user}</em> – ${e.challenge}</div>`
  ).join("");
}

// Napló gombhoz esemény
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('log-button').addEventListener('click', showLog);
  displayCards();
});
