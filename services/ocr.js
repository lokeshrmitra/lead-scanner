const request = require("request");
const fs = require("fs");
const path = require("path");

const subscriptionKey = process.env.VISION_KEY_1 || process.env.VISION_KEY_2;

// Request parameters.
// const params = {
//   mode: "Handwritten"
// };

module.exports = {
  getOCRText: (fileName, params) => {
    const payload1 = {
      uri:
        "https://centralindia.api.cognitive.microsoft.com/vision/v2.0/recognizeText",
      qs: params,
      body: fs.createReadStream(
        path.join(__dirname, "../public/uploads/", fileName)
      ),
      headers: {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    };
    return new Promise((resolve, reject) => {
      request.post(payload1, (error, response, body) => {
        if (!error && response.statusCode == "202") {
          var target = response.headers["operation-location"];
          console.log(target);
          const payload2 = {
            uri: target,
            headers: {
              "Content-Type": "application/octet-stream",
              "Ocp-Apim-Subscription-Key": "7b8b9299e32b49afbafa4a2cd075731c"
            }
          };
          var text = "";
          setTimeout(() => {
            request.get(payload2, (error, resp, body) => {
              if (!error && resp.statusCode == "200") {
                var lines = JSON.parse(body).recognitionResult.lines;
                lines.forEach(element => {
                  text += element.text + " ";
                });
                text = text.replace(/["'\(\)-]/g, ""); //Removes garbage characters
                text = text.replace(/(\d)\s+(?=\d)/g, "$1"); //Removes spaces between any two digit groups
                text = text.replace(/\s/g, " | "); //Adds | as delimiter
                console.log(text);
                resolve({ ocrText: text });
              } else reject("Error while OCR");
            });
          }, 4000);
        } else {
          if (error) {
            console.debug("Error: ", error);
            reject("Error while OCR", { err: error });
          } else {
            console.debug("Error: ", error);
            reject("Error while OCR");
          }
        }
      });
    });
  }
};
