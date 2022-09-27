const express = require('express');
const socketio = require('socket.io');
const http = require("http");
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute')
const locationRoute = require('./routes/locationRoute')
const stationRoute = require('./routes/stationRoute')
const bikeRoute = require('./routes/bikeRoute')
const hiringBikeRoute = require('./routes/hiringBikeRoute');
const notification = require('./controllers/notification');
const paymentRoute = require('./routes/accountBillRoute');
const dotenv = require("dotenv");

const port = 5000

// socket.io notification
const app = express();
const server = http.createServer(app)
const io = socketio(server, {
  transports: ['polling'],
  cors: {
    cors: {
      origin: ""
    }
  }
})
require('./controllers/notification')(io);
// end config socket 

let cors = require('cors');
const path = require('path');
dotenv.config();
connectDB();

const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/public")))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const corsOpts = {
  origin: '*',
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],
};

app.use(cors(corsOpts));

app.use(userRoute, function (req, res, next) {
  next()
});

app.use(categoryRoute, function (req, res, next) {
  next()
})

app.use(locationRoute, function (req, res, next) {
  next();
})
app.use(paymentRoute, function (req, res, next) {
  next();
})

app.use(stationRoute, function (req, res, next) {
  next();
})

app.use(bikeRoute, function (req, res, next) {
  next();
})

app.use(hiringBikeRoute, function (req, res, next) {
  next();
})

app.all('*', (req, res) => {
  res.json({ status: 'fail', msg: 'Check route api' })
})

app.listen(process.env.PORT || 5000, (req, res) => {
  console.log(`Example app listening on port ${port}`)
})

