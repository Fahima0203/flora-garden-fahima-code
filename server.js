const express = require("express");
const app = express();
const multer = require('multer')
const bodyParser = require("body-parser")
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require('fs')
const ImageModell = require("./models/nodeModel")
const UserModel = require("./models/signupModel")

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//connect to mongoose
mongoose.connect("mongodb+srv://fahima:passpass@cluster0.oz07pn2.mongodb.net/plantsdb")

//storage
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //cb(null, Date.now+file.originalname)
  },
});

const upload = multer({
  storage: Storage
})

app.post("/upload", upload.single("testImage"), (req, res) => {
  // res.send(req.file); 
  const saveImage = ImageModell({
    plantName: req.body.plantName,
    image: req.body.image,
    desc: req.body.desc
  });
  saveImage
    .save()
    .then((res) => {
      console.log("image is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
  res.send('image is saved')
});

app.get('/fetch', async (req, res) => {
  const allData = await ImageModell.find()
  res.json(allData)
})

app.get('/fetchUser', async (req, res) => {
  const allData = await UserModel.find()
  res.json(allData)
})

app.post("/uploadSignup", (req, res) => {
  const saveSignupData = UserModel({
    name: req.body.name,
    uname: req.body.uname,
    email: req.body.email,
    password: req.body.password
  });
  saveSignupData
    .save()
    .then((res) => {
      console.log("Signup Data is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
  res.send('Signup data is saved')
});

app.use(express.static(path.join(__dirname, "/flora/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/flora/build', 'index.html'));
});

app.listen(process.env.PORT || 5001, () => {
  console.log("Express server is running on port 5001");
});