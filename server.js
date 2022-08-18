const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
/* app.use(
  bodyParser.urlencoded({
    extended: true,
  })
); */

const PORT = 5000;
const URL = process.env.MONGODB_URL;
mongoose.connect(URL);

const bookingShcema = {
  date: Date,
  time: String,
  amount: Number,
  name: String,
  requests: String,
  contact: String,
};

const Booking = mongoose.model("Booking", bookingShcema);

// get all bookins from DB
app
  .route("/bookings")

  .get(function (req, res) {
    Booking.find(function (err, foundBoking) {
      if (!err) {
        res.send(foundBoking);
      } else {
        res.send(err);
      }
    });
  })

  //post one booking to DB

  .post(function (req, res) {
    const newBooking = new Booking({
      date: req.body.date,
      time: req.body.time,
      amount: req.body.amount,
      name: req.body.name,
      requests: req.body.requests,
      contact: req.body.contact,
    });

    newBooking.save(function (err) {
      if (!err) {
        res.json("Booking saved");
      } else {
        res.json(err);
      }
    });
  });

// work with one of bookings

app
  .route("/bookings/:id")

  .get(function (req, res) {
    Booking.findOne({ _id: req.params.id }, function (err, foundBooking) {
      if (foundBooking) {
        res.send(foundBooking);
      } else {
        res.send("No Matching Booking");
      }
    });
  })

  .patch(function (req, res) {
    Booking.updateOne(
      { _id: req.params.id },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.json("Updated successfully");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Booking.findByIdAndRemove(req.params.id, function (err) {
      if (!err) {
        res.send("Deleted One Booking!");
      } else {
        res.send(err);
      }
    });
  });

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
