import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
// import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

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

const myApp = initializeApp(firebaseConfig);
const db = getFirestore(myApp);
const lampCol = collection(db, 'lamp');

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const controller = {};

lampRef = doc(db, 'lamp', R3EoXUVxaRX4Vy1IK0Yo);
updateDoc(lampRef, {
  lastflip: Date.now(),
  lit: 'on',
});