
import {{ initializeApp }} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {{
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  query
}} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase konfiguráció
const firebaseConfig = {{
  apiKey: "AIzaSyDT6pkTGe0COhjZU6cR8B2jo8xvL930bXs",
  authDomain: "kedvesseg-app.firebaseapp.com",
  projectId: "kedvesseg-app",
  storageBucket: "kedvesseg-app.firebasestorage.app",
  messagingSenderId: "50423971619",
  appId: "1:50423971619:web:120d549c27c8a58cfb5696"
}};

// Inicializálás
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Kihívások
const challenges = [
  "Írj egy cetlit valakinek, amiben megdicséred.",
  "Adj egy ölelést valakinek ma – csak úgy.",
  "Pakolj el valamit valaki helyett, titokban.",
  "Rajzolj egy képet, és ajándékozd oda egy családtagnak.",
  "Írj egy kedves üzenetet a tükörre fogkrémmel (vagy post-ittel)."
];

function shuffle(array) {{
  return array.sort(() => 0.5 - Math.random());
}}

function getTodayDate() {{
  const today = new Date();
  return today.toISOString().split('T')[0];
}}

async function saveChoice(name, challenge) {{
  const date = getTodayDate();
  await setDoc(doc(db, "choices", name + "_" + date), {{
    user: name,
    challenge: challenge,
    date: date,
    completed: true
  }});
}}

function askName() {{
  let name = localStorage.getItem('username');
  if (!name) {{
    name = prompt("Hogy hívhatunk téged?");
    if (name) {{
      localStorage.setItem('username', name);
    }}
  }}
  return name;
}}

export function displayCards() {{
  const name = askName();
  if (!name) return;

  const container = document.getElementById('cards');
  container.innerHTML = "";
  const options = shuffle([...challenges]).slice(0, 3);
  options.forEach(text => {{
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = text;
    div.onclick = async () => {{
      alert("Ma ez lesz a kedvességed: " + text);
      await saveChoice(name, text);
    }};
    container.appendChild(div);
  }});
}}

export async function showLog() {{
  const logDiv = document.getElementById("log");
  logDiv.innerHTML = "<em>Betöltés...</em>";
  const q = query(collection(db, "choices"));
  const snapshot = await getDocs(q);
  const entries = [];
  snapshot.forEach(doc => {{
    const data = doc.data();
    entries.push(data);
  }});
  entries.sort((a, b) => a.date.localeCompare(b.date));
  logDiv.innerHTML = entries.map(e =>
    `<div class="log-entry"><strong>${e.date}</strong>: <em>${e.user}</em> – ${e.challenge}</div>`
  ).join("");
}}

// Automatikusan indítja a fő funkciót
displayCards();
