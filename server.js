const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const cors = require('cors');
const userAuth = require('./utilities/tokenVerifier');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoute);
app.use('/user', userAuth, userRoute);

app.get('/', function(req, res) {
    res.send({
      "Output": "Hello World!"
    });
  });

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, data) => {
    if(err) return console.log('error connecting to Mongo Atlas')
    console.log(`connected to Mongo Atlas`)
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`express server running on port ${port}`));

module.exports = app