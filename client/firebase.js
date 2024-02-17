import { getFirestore, collection, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';

import { initializeApp } from 'firebase/app';

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

initializeApp(firebaseConfig);

export const db = getFirestore();

export { collection, onSnapshot, doc, getDoc, updateDoc };