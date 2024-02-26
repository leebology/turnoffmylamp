const { initializeApp } = require('firebase/app');
const { getFirestore, doc, addDoc, updateDoc, getDoc, collection } = require('firebase/firestore');

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

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const controller = {};

controller.token = '';

//the random string of characters are the DOCUMENT NAMES in my firebase database
lampRef = doc(db, 'lamp', 'R3EoXUVxaRX4Vy1IK0Yo');
interactionsRef = collection(db, 'lamp/R3EoXUVxaRX4Vy1IK0Yo/interactions')
tokenRef = doc(db, 'token', 'KySruQOo92Kmx9L1jjoa');

controller.fliplamp = async (req, res, next) => {
  req.action ? litState = 'on' : litState = 'off'
  //CHANGE LIT VALUE
  try {
    updateDoc(lampRef, {
      lastflip: Date.now(),
      lit: litState,
    });
  } catch (error) {
    return next({
      log: 'error handler caught error in fbcontroller.fliplamp',
      status: 500,
      message: {error: 'flippy no workey'}
    })
  }
  //ADD INTERACTION LOG
  try { 
    addDoc(interactionsRef, {
      action: req.action,
      time: Date.now(),
      alias: req.alias ? req.alias : '',
    })
    console.log('### added interaction!')

  } catch (error) {
    return next({
      log: 'error handler caught error when adding an interaction',
      status: 500,
      message: {error: 'couldn\'t add interaction'}
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