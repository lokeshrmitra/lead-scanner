const request = require("request");
const fs = require("fs");
const path = require("path");

const subscriptionKey = process.env.VISION_KEY_1 || process.env.VISION_KEY_2;

// Request parameters.
const params = {
  language: "en",
  detectOrientation: "true"
};

const options = {
  uri: "https://centralindia.api.cognitive.microsoft.com/vision/v2.0/ocr",
  qs: params,
  body: fs.createReadStream(
    path.join(__dirname, "../public/uploads/card.jpeg")
  ),
  headers: {
    "Content-Type": "application/octet-stream",
    "Ocp-Apim-Subscription-Key": subscriptionKey
  }
};

module.exports = {
  getOCRText: () => {
    return new Promise((resolve, reject) => {
      console.debug("Inside OCCR");
      request.post(options, (error, response, body) => {
        if (error) {
          console.debug("Error: ", error);
          reject("Error while OCR");
        }
        if (response.statusCode == "200") {
          console.debug("Inside OCCR after 200");
          let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
          var regions = JSON.parse(body).regions;
          var op = "";
          regions.forEach(item => {
            item.lines.forEach(it => {
              it.words.forEach(i => {
                op += i.text + " ";
              });
            });
          });
          resolve({ ocrText: op });
        } else {
          reject("Error while OCR");
        }
      });
    });
  }
};
