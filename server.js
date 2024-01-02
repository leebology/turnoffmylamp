//got api call from itnerd.space website - how to contorl your tpp link from the internet
//npm start works for local, then open html with live server
//firebase server doesn't function correctly

const express = require('express');
const app = express();
const path = require('path');
const controller = require('./controller.js');
const PORT = 5003;

const cors = require('cors');
app.use(cors());

app.use(express.static('client'));
app.use(express.json());

// app.get('/', (req, res) => {
//   return res.status(200).sendFile(path.resolve(__dirname, './client/index.html'));
// })

app.post('/flip', controller.fliplamp, (req, res) => {
  return res.status(201).json('lamp flipped')
})

app.get('/on', controller.turnonlamp, (req, res) => {
  return res.status(201).json('lamp on now')
})

app.get('/off', controller.turnofflamp, (req, res) => {
  return res.status(201).json('lamp off now')
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
  console.log(`Server listening on port: ${PORT}...`);
});