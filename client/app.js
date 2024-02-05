import { db, collection, onSnapshot, doc, updateDoc } from './firebase';
import './styles.css'; //webpack will see this and inject css. dont put css link in the html file directly.

// import iro from '@jaames/iro';
// let colorWheel = new iro.ColorPicker('#colorWheelDemo', {
//   // options here
// });

const lampCol = collection(db, 'lamp'); //collection reference

let lampId, lampLastFlip, lampLit;
let lampRef;

const lastFlipText = document.getElementById('lastflip');
const currentStateText = document.getElementById('currentlampstate');
const lastfliplabel = document.getElementById('lastfliplabel');

const refreshLastFlip = () => {
  const currTime = Date.now();
  let ms = Date.now() - lampLastFlip;
  const weeks = Math.floor(ms / 604800000);
  ms -= weeks * 604800000;
  const days = Math.floor(ms / 86400000);
  ms -= days * 86400000;
  const hours = Math.floor(ms / 3600000);
  ms -= hours * 3600000;
  const minutes = Math.floor(ms / 60000);
  ms -= minutes * 60000;
  const seconds = Math.floor(ms / 1000);

  let timeStr = '';
  if (weeks) {
    if (weeks > 1) timeStr += `${weeks} weeks, `;
    else timeStr += '1 week, ';
  }
  if (days) {
    if (days > 1) timeStr += `${days} days, `;
    else timeStr += '1 day, ';
  }
  if (hours) {
    if (hours > 1) timeStr += `${hours} hours, `;
    else timeStr += '1 hour, ';
  }
  if (minutes) {
    if (minutes > 1) timeStr += `${minutes} minutes, `;
    else timeStr += '1 minute, ';
  }
  if (seconds === 1) timeStr += `1 second`;
  else timeStr += `${seconds} seconds`;

  lastFlipText.innerText = timeStr;
};

setInterval(refreshLastFlip, 1000);

//2nd parameter is callback function that runs once initially and then again whenever collection changes
onSnapshot(lampCol, (snapshot) => {
  lampId = snapshot.docs[0].id;
  lampLastFlip = snapshot.docs[0].data().lastflip;
  //console.log('------lampLastFlip:  ', lampLastFlip);
  lampLit = snapshot.docs[0].data().lit;
  lampRef = doc(db, 'lamp', lampId);

  refreshLastFlip();
  
  if (lampLit === 'on') {
    lastfliplabel.innerText = 'lamp has been on for:';
    lampButtonOn.disabled = true;
    lampButtonOff.disabled = false;
  } else if (lampLit === 'off') {
    lastfliplabel.innerText = 'lamp has been off for:';
    lampButtonOn.disabled = false;
    lampButtonOff.disabled = true;
  }
  currentStateText.innerText = lampLit;
  console.log('finished onSnapshot')
});


const lampButtonOn = document.getElementById('lampbuttonon');
lampButtonOn.addEventListener('click', () => {
  asyncFlip({ value: true });
});
const lampButtonOff = document.getElementById('lampbuttonoff');
lampButtonOff.addEventListener('click', () => {
  asyncFlip({ value: false });
});

//does this need to be an async function??
async function asyncFlip(data) {
  console.log('pressed: ', data.value);
  // fetch('http://localhost:5004/flip', {
  fetch('/flip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error in asyncFLip! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log('response from server: ', data);
    })
    .catch((err) => console.log('Error in lampButtonOn fetch call: ', err));
}
