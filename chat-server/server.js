"use strict";

var express = require("express");
var app = express();
var router = express.Router();
var mongo = require("./utils/database.js");
var cors = require("cors");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var apiRoutes = require("./routes/api.js");
//var runner = require("./test-runner");

const ioServer = require("http").Server(app);
require('./socketIO/IOserver')(ioServer);

// make all the files in 'public' available
app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//root level middleware
app.use(function middleware(req, res, next) {
  // Do something
  // Call the next function in line:
  var string = req.method + " " + req.path + " - " + req.ip;
  console.log(string);
  next();
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//Routing for API
const routes = async () => {
  var db = await mongo.getDB("myDB")
  await apiRoutes(router, db);
  //await mongo.disconnect();

  app.use(router);



  app.use(function(req, res, next) {
    res
      .status(404)
      .type("text")
      .send("Not Found");
  });

  // Error Middleware
  app.use(function(err, req, res, next) {
    if (err) {
      res 
        .status(err.status || 500)
        .type("txt")
        .send(err.message || "SERVER ERROR");
    }
  });

  //socketIO server
  ioServer.listen(4000, function (err) {
    if (err) throw err
    console.log('ioServer listening on port 4000')
  });

  //Start our server and tests!
  // app.listen(4000, function() {
  //   console.log("Listening on port " + '4000');
  // });

};

routes();
