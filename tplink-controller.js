// import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
// const db = getFirestore(firebaseApp);
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const controller = {};

const token = '1b6ca5c3-ATTPtwpHukqm5DHHs6jk5tf' //token 240101
//const token = '1b6ca5c3-ATaNQSLYNCBGeHgo8RDqa70' //old token
const deviceId = '80066A2A877483A23D63A993CAA043A12162BC8C';
const posturl = `https://wap.tplinkcloud.com?token=${token}`;

controller.fliplamp = async (req, res, next) => {

  let flipReq = req.body.value;
  console.log('flipReq: ', flipReq)

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

    //set the res to something other than the response from Kasa
    res.json(jsonResponse); 

  } catch (err) {
    return next({
      log: 'error handler caught error at controller.buttonpress',
      status: 500,
      message: { err: 'button no worky' },
    });
  }
}


controller.lampstatus = async (req, res, next) => {
  console.log('in controller.lampstatus')

  const postBody = {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({
      "method": 'passthrough',
      "params": {
          "deviceId": deviceId,
          "requestData": {
              "system":{
                  "get_sysinfo": null
              },
              "emeter": {
                  "get_realtime": null
              }
          }
      }
    }),
  };

  try { 
    const fetchResponse = await fetch(posturl, postBody);
    const jsonResponse = await fetchResponse.json();
    res.json(jsonResponse); 
  } catch (err) {
    return next({
      log: 'error handler caught error at controller.lampstatus',
      status: 500,
      message: { err: 'oopsy woopsy' },
    })
  }
}

// controller.turnonlamp = async (req, res, next) => {

//   const postBody = {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       method: 'passthrough',
//       params: {
//         deviceId: deviceId,
//         requestData: '{"system":{"set_relay_state":{"state":1}}}',
//       },
//     }),
//   };

//   try {
//     const fetchResponse = await fetch(posturl, postBody);
//     const jsonResponse = await fetchResponse.json();
//     res.json(jsonResponse); 
//     // res.locals.lit = true
//     // console.log('-----controller response:')
//     // console.log(res.locals)
//   } catch (err) {
//     return next({
//       log: 'error handler caught error at controller.buttonpress',
//       status: 500,
//       message: { err: 'button no worky' },
//     });
//   }
// };

// controller.turnofflamp = async (req, res, next) => {
//   const postBody = {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       method: 'passthrough',
//       params: {
//         deviceId: '80066A2A877483A23D63A993CAA043A12162BC8C',
//         requestData: '{"system":{"set_relay_state":{"state":0}}}',
//       },
//     }),
//   };

//   try {
//     const fetchResponse = await fetch(posturl, postBody);
//     const jsonResponse = await fetchResponse.json();
//     res.json(jsonResponse); 
//   } catch (err) {
//     return next({
//       log: 'error handler caught error at controller.buttonpress',
//       status: 500,
//       message: { err: 'button no worky' },
//     });
//   }
// };

module.exports = controller