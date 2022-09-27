const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const locationRoute = require("./routes/locationRoute");
const stationRoute = require("./routes/stationRoute");
const bikeRoute = require("./routes/bikeRoute");
const hiringBikeRoute = require("./routes/hiringBikeRoute");
const notification = require("./controllers/notification");
const paymentRoute = require("./routes/accountBillRoute");

// socket.io notification
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  transports: ["polling"],
  cors: {
    cors: {
      origin: "",
    },
  },
});
require("./controllers/notification")(io);
// end config socket

dotenv.config();
var cors = require("cors");
connectDB();
app.use("/images", express.static("./images"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOpts));
app.use(userRoute, function (req, res, next) {
  next();
});

app.use(categoryRoute, function (req, res, next) {
  next();
});

app.use(locationRoute, function (req, res, next) {
  next();
});
app.use(paymentRoute, function (req, res, next) {
  next();
});

app.use(stationRoute, function (req, res, next) {
  next();
});

app.use(bikeRoute, function (req, res, next) {
  next();
});

app.use(hiringBikeRoute, function (req, res, next) {
  next();
});
app.all("*", (req, res) => {
  res.json({status: "fail", msg: "Check route api"});
});

app.listen(process.env.PORT || 5000, (req, res) => {
  console.log("Server listening on port 5000");
});
