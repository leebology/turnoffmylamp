//brower/client-side needs a path to import. you can't just do " import * from 'firebase' "
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
// import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
//import { getFirestore, collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDnTKW_iZaYmlRcTsQilcI12e7pYuDYNWA',
  authDomain: 'turnoffmylamp.firebaseapp.com',
  projectId: 'turnoffmylamp',
  storageBucket: 'turnoffmylamp.appspot.com',
  messagingSenderId: '62228671624',
  appId: '1:62228671624:web:1b9294652e14bb05bec33d',
  measurementId: 'G-560J1TS43B',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

const lampCol = collection(db, 'lamp'); //collection reference

let lampId;
let lampLastFlip;
let lampLit;

let lampRef;

const lastFlipText = document.getElementById('lastflip');
const currentStateText = document.getElementById('currentlampstate');

onSnapshot(lampCol, (snapshot) => {
  // console.log("------snapshot.docs[0].data()")
  // console.log(snapshot.docs[0].data())
  // console.log("------snapshot.docs[0].data().lastflip")
  // console.log(snapshot.docs[0].data().lastflip)
  // console.log("------snapshot.docs[0].id")
  // console.log(snapshot.docs[0].id)
  lampId = snapshot.docs[0].id;
  lampLastFlip = snapshot.docs[0].data().lastflip;
  console.log('------lampLastFlip:  ', lampLastFlip);
  lampLit = snapshot.docs[0].data().lit;
  lampRef = doc(db, 'lamp', lampId);

  lastFlipText.innerText = lampLastFlip;
  currentStateText.innerText = lampLit;
});

const refreshLastFlip = () => {
  lastFlipText.innerText = Number(lastFlipText.innerText) + 1;
};

setInterval(refreshLastFlip, 1000);

const lampButtonOn = document.getElementById('lampbuttonon');
lampButtonOn.addEventListener('click', (e) => {
  fetch('http://localhost:5003/on', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      console.log('-----client side res.locals');
      console.log(res.locals);
      return res.json();
    })
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((err) => console.log('Error in lampButtonOn fetch call: ', err));

  updateDoc(lampRef, {
    // lastflip: new Date().getTime(),
    lastflip: 0,
    lit: 'on',
  });
});

const lampButtonOff = document.getElementById('lampbuttonoff');
lampButtonOff.addEventListener('click', (e) => {
  fetch('http://localhost:5003/off', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((err) => console.log('Error in lampButtonOn fetch call: ', err));

  updateDoc(lampRef, {
    // lastflip: new Date().getTime(),
    lastflip: 0,
    lit: 'off',
  });
});

async function turnLampOn() {
  const response = await fetch('/');
}
