const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc, collection } = require('firebase/firestore');

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

//initializeApp(firebaseConfig);
//admin.initializeApp(firebaseConfig);
const dbapp = initializeApp(firebaseConfig);

const db = getFirestore(dbapp);


const lampCol = collection(db, 'lamp');

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const controller = {};

controller.token = '';

//do these need to be declared as variables?
lampRef = doc(db, 'lamp', 'R3EoXUVxaRX4Vy1IK0Yo');
tokenRef = doc(db, 'token', 'KySruQOo92Kmx9L1jjoa');
let token = '';

controller.fliplamp = async (req, res, next) => {
  try {
    //req will be true or false
    req ? litState = 'on' : litState = 'off'
    updateDoc(lampRef, {
      lastflip: Date.now(),
      lit: litState,
    });
  } catch (err) {
    return next({
      log: 'error handler caught error when trying to flip lamp in fbcontroller.fliplamp',
      status: 500,
      message: {error: 'flippy no workey'}
    })
  }
}

controller.getcurrtoken = async () => {
  try {
    const docSnapshot = await getDoc(tokenRef);
    return docSnapshot.data().token;
  } catch (error) {
    console.error("error gettting current token from FB: ", error);
    return null
  }
}

controller.lasttokentime = async () => {
  try {
    const docSnapshot = await getDoc(tokenRef);
    console.log('last tokentime from fb.lasattokentime: ', docSnapshot.data().lastTime)
    return docSnapshot.data().lastTime;
  } catch (error) {
    console.error("error gettting current token from FB: ", error);
    return null
  }
}

controller.setToken = async (x) => {
  console.log('x param in setToken = ', x)
  try {
    const docSnapshot = await updateDoc(tokenRef, {
      lastTime: Date.now(),
      token: x,
    });
    console.log('set new token in fbcontroller. res from fb: ', docSnapshot)
    return true;
  } catch (error) {
    console.error("error setting a new token into FB: ", error);
    return null
  }
}

module.exports = controller;