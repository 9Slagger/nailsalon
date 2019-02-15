const express = require("express");
const cors = require("cors");
const app = express.Router();
const mongoose = require("./db_config");
// --------------------------------------------
const Nail = require("./model/nailModel");
const Store = require("./model/storeModel");

app.use(cors());

// --------------------------------------------

app.post("/nail", (req, res) => {
  let nail = new Nail({
    _id: new mongoose.Types.ObjectId(),
    Thumbnail: req.body.link,
    Price: req.body.Price,
    store: req.body.store
  });
  nail.save({ new: true }, function(error, data) {
    if (error) {
      res.status(400).json(error);
    } else {
      res.status(201).json(data);
    }
  });
});

app.post("/store", (req, res) => {
  let store = new Store({
    _id: new mongoose.Types.ObjectId(),
    Storename: req.body.Storename,
    Address: req.body.Address,
    Map: req.body.Map,
    Fbname: req.body.Fbname,
    Fbpage: req.body.Fbpage,
    Igname: req.body.Igname,
    Igpage: req.body.Igpage
  });
  store.save({ new: true }, function(error, data) {
    if (error) {
      res.status(400).json(error);
    } else {
      res.status(201).json(data);
    }
  });
});

//---------------------------------------------
app.get("/checkserver", (req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
