const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const fetch = require("node-fetch");

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
  res.render("index", {
    text: process.env.sample_key
  });
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
        // Getting data from Google Vision API
        console.log(req.file.filename);

        var url =
          "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCxQPGs4zmsYOnLl48SndoEIH9PoDpl_HU";
        var data = {
          requests: [
            {
              image: {
                source: {
                  imageUri:
                    "https://image.ibb.co/jCtjWz/Whats_App_Image_2018_09_28_at_2_10_52_AM.jpg"
                }
              },
              features: [
                {
                  type: "TEXT_DETECTION"
                }
              ]
            }
          ]
        };
        fetch(url, { method: "POST", body: JSON.stringify(data) })
          .then(res => res.json())
          .then(json => {
            // console.log(JSON.stringify(json));
            let resp = JSON.stringify(json);
            console.log(resp.responses);
            res.render("index", {
              msg: "file uploaded",
              file: `uploads/${req.file.filename}`
              //   text: JSON.parse(json)
            });
          });
      }
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server running on " + port);
});
