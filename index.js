const express = require("express");
const multer = require("multer");
const path = require("path");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");

global.loggedInUser = { user: null };

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
}).single("bcard");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views/pages");

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "main"
  })
);

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/login", (req, res) => {
  console.log(req.body.user);
  console.log(req.body.pwd);
  console.log(global.loggedInUser);
  global.loggedInUser.user = req.body.user;
  console.log(global.loggedInUser);

  res.render("home", { title: "Home", user: req.body.user });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/create-lead", (req, res) => {
  res.render("createlead", { title: "Create Lead", data: "some text" });
});

app.get("*", function(req, res) {
  res.render("redirect", { title: "Dead End" });
});

app.post("/upload", (req, res) => {
  console.log(global.loggedInUser);

  upload(req, res, err => {
    if (err) {
      res.render("error", { msg: err });
    } else {
      if (req.file == undefined) {
        res.render("home");
      } else {
        console.log(req.file.filename);
        var mockData = {
          fname: "Alex",
          lname: "Johnson",
          email: "ajohn@xyz.com",
          contact: "+91 7632 234 234",
          website: "XYZ Enterprises"
        };
        res.redirect("createlead");
        // res.render("createlead", { title: "Create Lead", lead: mockData });
      }
    }
  });
});

app.post("/createlead", (req, res) => {
  console.log(req.body);
  res.render("success");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server running on " + port);
});
