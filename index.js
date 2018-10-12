const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
var session = require("express-session");
const path = require("path");
const multer = require("multer");

//Set Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, req.session.user + ".jpeg");
  }
});

//Init Upload
const upload = multer({
  storage: storage
  //   limits: { fileSize: 10 }
}).single("bcard");

const app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);

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
  req.session.user = req.body.user;
  res.redirect("home");
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/unauthorised", (req, res) => {
  res.render("unauthorised", { title: ":O Unauthorised" });
});

app.get("/error", (req, res) => {
  res.render("error", { title: "Fail" });
});

app.get("/create-lead", (req, res) => {
  var data = {
    title: "Create Lead"
  };
  if (!req.query.type) data.lead = req.session.lead;
  res.render("createlead", data);
});

app.get("/home", (req, res) => {
  console.log(req.session.user);
  if (req.session.user)
    res.render("home", { title: "Home", user: req.session.user });
  else {
    res.redirect("login");
  }
});

app.get("/success", (req, res) => {
  res.render("success", { title: "Home" });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("logout");
});

app.get("*", function(req, res) {
  if (req.session.user) res.redirect("home");
  else {
    res.redirect("login");
  }
});

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("error", { msg: err });
    } else {
      if (req.file == undefined) {
        res.render("home");
      } else {
        const ocr = require("./services/ocr");
        const textanalytics = require("./services/textanalytics");

        //Add logic to call Microsofts OCR API & Text Analytics
        ocr
          .getOCRText(req.session.user + ".jpeg")
          .then(resp => {
            console.log(resp.ocrText);
            textanalytics
              .analyzeText(resp.ocrText)
              .then(response => {
                console.log("Got response");
                req.session.lead = response.leadDetails;
                res.redirect("create-lead");
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
            res.redirect("error");
          });
      }
    }
  });
});

app.post("/create-lead", (req, res) => {
  var createlead = require("./services/createlead");
  console.log(req.body);
  const options = {
    uri: "https://webto.salesforce.com/servlet/servlet.WebToLead",
    form: {
      oid: process.env.OID,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      company: req.body.company,
      city: req.body.city,
      state: req.body.state,
      mobile: req.body.mobile
    }
  };
  createlead.create(options, res);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server running on " + port);
});
