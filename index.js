const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

//Set Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

//Init Upload
const upload = multer({
  storage: storage
  //   limits: { fileSize: 10 }
}).single("avatar");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) res.render("index", { msg: err });
    else {
      if (req.file == undefined) {
        res.render("index", {
          msg: "No File uploaded"
        });
      } else {
        res.render("index", {
          msg: "file uploaded",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server running on " + port);
});
