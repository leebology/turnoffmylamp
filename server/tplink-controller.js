const express = require('express');
const app = express();
require('dotenv').config();
const fbcontroller = require('./firebase-controller.js');
const cors = require('cors');
app.use(cors());
app.use(express.json());

const controller = {};

let token = '';
//const plugId = '80066A2A877483A23D63A993CAA043A12162BC8C';
const plugId = process.env.PLUG_ID;
const posturl = 'https://wap.tplinkcloud.com';


//get a new token from TP-LINK api
controller.newtoken = async (req, res, next) => {
  const postBody = {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({
      "method": "login",
      "params": {
         "appType": "Kasa_Android",
         "cloudUserName": "liam.donaher@gmail.com",
         "cloudPassword": "WifiOutlet:808",
         "terminalUUID": "27daa39e-2830-4286-a653-d2fa64bc1a61"
      }
     }),
  };
  try {
    const fetchResponse = await fetch(posturl, postBody);
    const jsonResponse = (await fetchResponse.json()).result.token;
    console.log('sending new token to fbcontroller.setToken: ', jsonResponse)

    //save the new token to firebase - setToken returns true if successful
    let setToken = await fbcontroller.setToken(jsonResponse);
    console.log('setToken = ', setToken)
    //if the write to firebase is successful, return the new token
    if (setToken) {
      return jsonResponse
    }
  } catch (err) {
    return next({
      log: 'error handler caught error at tpcontroller.newtoken',
      status: 500,
      message: { err: 'token no worky' },
    });
  }
}

controller.fliplamp = async (req, res, next) => {

  let flipReq = req.body.value;
  console.log('-----FLIP REQUEST TO: ', flipReq)

  if (!token) {
    console.log('awaiting token from fb')
    token = await fbcontroller.getcurrtoken();
    console.log('got token:', token);
  }

  const postBody = {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'passthrough',
      params: {
        deviceId: plugId,
        requestData: `{"system":{"set_relay_state":{"state":${flipReq}}}}`,
      },
    }),
  };

  try {
    const fetchResponse = await fetch(`${posturl}?token=${token}`, postBody);
    const jsonResponse = await fetchResponse.json();

    // console.log('Controller.fliplamp Response: ')
    // console.log(jsonResponse)

    //error_code -20651 for token expired
    if (jsonResponse.error_code === -20651) {
      console.log('expired token')
      // check firebase for the time the last token was taken.
      const lastTokenTime = await fbcontroller.lasttokentime();
      //check if token is fresh to within ~5.78 days. if not, run the fetchResponse lines again.
      if (lastTokenTime + 500000000 < Date.now()) {
        try {
          console.log('old token is: ', token);
          //get a new token from tplink
          token = await controller.newtoken();
          console.log('new token is: ', token);
        } catch (error) {
          return next({
            log: 'error handle caught error in fetching new token',
            staus: 500,
            message: { error: 'token no tokey'},
          })
        }
        const fetchResponse2 = await fetch(`${posturl}?token=${token}`, postBody);
        const jsonResponse2 = await fetchResponse2.json();
        res.json(jsonResponse2); 
        console.log('FINAL RES 2: ', jsonResponse2)
      } else {
        console.log('token is expired, but i feel like i ~just got a new one')
      }
      //error_code -20002 for request timeout (likely plug is not plugged in)
    } else if (jsonResponse.error_code === -20002) {
      console.log('request to lamp timed out (not plugged in?)')
      res.json(jsonResponse); 
      //error_code 0 for a successful request to TPLINK
    } else if (jsonResponse.error_code === 0) { 
      //set current plug state in firebase
      await fbcontroller.fliplamp(flipReq);
    } else {
      console.log('Error with TPLink API request: ', jsonResponse)
      res.json(jsonResponse); 
    }
  } catch (error) {
    return next({
      log: 'error handler caught error when trying to flip lamp',
      status: 500,
      message: {error: 'flippy no workey'}
    })
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
          "deviceId": plugId,
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
    const fetchResponse = await fetch(`${posturl}?token=${token}`, postBody);
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

module.exports = controller