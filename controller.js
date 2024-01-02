// import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
// const db = getFirestore(firebaseApp);
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const controller = {};
const posturl = 'https://wap.tplinkcloud.com?token=1b6ca5c3-ATaNQSLYNCBGeHgo8RDqa70';
//1b6ca5c3-ATTPtwpHukqm5DHHs6jk5tf new token 240101

const deviceId = '80066A2A877483A23D63A993CAA043A12162BC8C';

controller.fliplamp = async (req, res, next) => {
  //console.log('controller req.body: ', req.body)
  //const flip = req.body

  let flipReq = false;
  if (req.body.value) flipReq = true;

  const postBody = {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'passthrough',
      params: {
        deviceId: deviceId,
        requestData: `{"system":{"set_relay_state":{"state":${flipReq}}}}`,
      },
    }),
  };

  try {
    const fetchResponse = await fetch(posturl, postBody);
    const jsonResponse = await fetchResponse.json();
    res.json(jsonResponse); 
    // res.locals.lit = true
    // console.log('-----controller response:')
    // console.log(res.locals)
  } catch (err) {
    return next({
      log: 'error handler caught error at controller.buttonpress',
      status: 500,
      message: { err: 'button no worky' },
    });
  }
}

controller.turnonlamp = async (req, res, next) => {

  const postBody = {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'passthrough',
      params: {
        deviceId: deviceId,
        requestData: '{"system":{"set_relay_state":{"state":1}}}',
      },
    }),
  };

  try {
    const fetchResponse = await fetch(posturl, postBody);
    const jsonResponse = await fetchResponse.json();
    res.json(jsonResponse); 
    // res.locals.lit = true
    // console.log('-----controller response:')
    // console.log(res.locals)
  } catch (err) {
    return next({
      log: 'error handler caught error at controller.buttonpress',
      status: 500,
      message: { err: 'button no worky' },
    });
  }
};

controller.turnofflamp = async (req, res, next) => {
  const postBody = {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'passthrough',
      params: {
        deviceId: '80066A2A877483A23D63A993CAA043A12162BC8C',
        requestData: '{"system":{"set_relay_state":{"state":0}}}',
      },
    }),
  };

  try {
    const fetchResponse = await fetch(posturl, postBody);
    const jsonResponse = await fetchResponse.json();
    res.json(jsonResponse); 
  } catch (err) {
    return next({
      log: 'error handler caught error at controller.buttonpress',
      status: 500,
      message: { err: 'button no worky' },
    });
  }
};

module.exports = controller