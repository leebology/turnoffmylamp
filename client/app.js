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


const firebaseConfig = {
  apiKey: "AIzaSyDnTKW_iZaYmlRcTsQilcI12e7pYuDYNWA",
  authDomain: "turnoffmylamp.firebaseapp.com",
  databaseURL: "https://turnoffmylamp-default-rtdb.firebaseio.com",
  projectId: "turnoffmylamp",
  storageBucket: "turnoffmylamp.appspot.com",
  messagingSenderId: "62228671624",
  appId: "1:62228671624:web:1b9294652e14bb05bec33d",
  measurementId: "G-560J1TS43B"
};

// Initialize Firebase
const myApp = initializeApp(firebaseConfig);
const db = getFirestore(myApp);

const lampCol = collection(db, 'lamp'); //collection reference

let lampId;
let lampLastFlip;
let lampLit;

let lampRef;

const lastFlipText = document.getElementById('lastflip');
const currentStateText = document.getElementById('currentlampstate');
const lastfliplabel = document.getElementById('lastfliplabel');

//2nd parameter is callback function that runs once initially and then again whenever collection changes
 
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

  refreshLastFlip();
  //lastFlipText.innerText = '';
  if (currentStateText.innerText === true) lastfliplabel.innerText = 'lamp has been on for:'
  else if (currentStateText.innerText === false) lastfliplabel.innerText = 'lamp has been off for:'
  currentStateText.innerText = lampLit;
});

const refreshLastFlip = () => {
  const currTime = Date.now();
  let ms = Date.now() - lampLastFlip;
  const weeks = Math.floor(ms/604800000);
  ms -= weeks * 604800000
  const days = Math.floor(ms/86400000);
  ms -= days * 86400000
  const hours = Math.floor(ms/3600000);
  ms -= hours * 3600000
  const minutes = Math.floor(ms/60000);
  ms -= minutes * 60000
  const seconds = Math.floor(ms/1000);

  let timeStr = ''
  if (weeks) {
    if (weeks > 1) timeStr += `${weeks} weeks, `
    else timeStr += '1 week, '
  }
  if (days) {
    if (days > 1) timeStr += `${days} days, `
    else timeStr += '1 day, '
  }
  if (hours) {
    if (hours > 1) timeStr += `${hours} hours, `
    else timeStr += '1 hour, '
  }
  if (minutes) {
    if (minutes > 1) timeStr += `${minutes} minutes, `
    else timeStr += '1 minute, '
  }
  if (seconds === 1) timeStr += `1 second`
  else timeStr += `${seconds} seconds`

  lastFlipText.innerText = timeStr;
};

setInterval(refreshLastFlip, 1000);

const lampButtonOn = document.getElementById('lampbuttonon');
const lampButtonOff = document.getElementById('lampbuttonon');
lampButtonOn.addEventListener('click', () => {
  //console.log('on button pressed')
  asyncFlip({value: true});
})
lampButtonOff.addEventListener('click', () => {
  //console.log('off button pressed')
  asyncFlip({value: false});
})

//does this need to be an async function??
async function asyncFlip(data) {
  fetch('http://localhost:5003/flip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error in asyncFLip! Status: ${res.status}`);
      }
      console.log('-----client side res.locals');
      console.log(res.locals);
      return res.json();
    })
    .then((data) => {
      updateDoc(lampRef, {
        lastflip: Date.now(),
        lit: 'on',
      })
      console.log('Success:', data);
    })
    .catch((err) => console.log('Error in lampButtonOn fetch call: ', err));
};



// const lampButtonOff = document.getElementById('lampbuttonoff');
// lampButtonOff.addEventListener('click', (e) => {
//   fetch('http://localhost:5003/off', {
//     method: 'GET',
//     headers: { 'Content-Type': 'application/json' },
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status}`);
//       }
//       return res.json();
//     })
//     .then((data) => {
//       console.log('Success:', data);
//     })
//     .catch((err) => console.log('Error in lampButtonOn fetch call: ', err));

//   updateDoc(lampRef, {
//     // lastflip: new Date().getTime(),
//     lastflip: 0,
//     lit: 'off',
//   });
// });

// async function turnLampOn() {
//   const response = await fetch('/');
// }
