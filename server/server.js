//got api call from itnerd.space website - how to contorl your tpp link from the internet
//npm start works for local, then open html with live server
//firebase server doesn't function correctly

const express = require('express');
const app = express();
const path = require('path');
const tpcontroller = require('./tplink-controller.js');
const fbcontroller = require('./firebase-controller.js');
const PORT = 5004;

const cors = require('cors');
app.use(cors());

fbcontroller.getcurrtoken();

//app.use(express.static('client')); //this is how i served static files without webpack
app.use(express.static(path.join(__dirname, 'dist'))); //this is the way to serve static files with webpack
app.use(express.json());

// app.get('/', (req, res) => {
//   return res.status(200).sendFile(path.resolve(__dirname, './client/index.html'));
// })

app.post('/flip', tpcontroller.fliplamp, (req, res) => {
  return res.status(201).json('lamp flipped')
})

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...\n 🔆 Time to get lit 🔆`);
});