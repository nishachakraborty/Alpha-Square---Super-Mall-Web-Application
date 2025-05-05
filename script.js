// Initialize Firebase (frontend only placeholder)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  // Your Firebase config
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Logging helper
function log(action, detail) {
  console.log(`[LOG] ${new Date().toISOString()} - ${action}: ${detail}`);
}

// Login Handler
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(user => {
      log('Login', `User ${email} logged in`);
      alert('Login successful');
    })
    .catch(err => {
      log('Login Error', err.message);
      alert('Login failed');
    });
});

// Generic save form data to Firestore
async function saveData(formId, collectionName) {
  const form = document.getElementById(formId);
  const data = {};
  new FormData(form).forEach((value, key) => data[key] = value);
  try {
    await addDoc(collection(db, collectionName), data);
    log(`Save ${collectionName}`, JSON.stringify(data));
    alert(`${collectionName} saved`);
  } catch (err) {
    log(`Save ${collectionName} Error`, err.message);
    alert(`Failed to save ${collectionName}`);
  }
}

document.getElementById('shop-form').addEventListener('submit', e => { e.preventDefault(); saveData('shop-form', 'shops'); });
document.getElementById('offer-form').addEventListener('submit', e => { e.preventDefault(); saveData('offer-form', 'offers'); });
document.getElementById('category-form').addEventListener('submit', e => { e.preventDefault(); saveData('category-form', 'categories'); });

// Fetch and list items (shops, offers, categories)
async function listCollection(collectionName, listElementId) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const container = document.getElementById(listElementId);
  container.innerHTML = '';
  querySnapshot.forEach(doc => {
    const div = document.createElement('div');
    div.textContent = JSON.stringify(doc.data());
    container.appendChild(div);
  });
}

// Initial fetch
['shops','offers','categories'].forEach(name => listCollection(name, `${name.slice(0,-1)}-list`));