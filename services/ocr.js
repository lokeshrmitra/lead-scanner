const request = require("request");
const fs = require("fs");

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = process.env.VISION_KEY_1 || process.env.VISION_KEY_2;

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase =
  "https://centralindia.api.cognitive.microsoft.com/vision/v2.0/ocr";

// Request parameters.
const params = {
  language: "en",
  detectOrientation: "true"
};

const options = {
  uri: uriBase,
  qs: params,
  //   body: '{"url": ' + '"' + imageUrl + '"}',
  body: fs.createReadStream("./card.jpeg"),
  headers: {
    "Content-Type": "application/octet-stream",
    "Ocp-Apim-Subscription-Key": subscriptionKey
  }
};

request.post(options, (error, response, body) => {
  if (error) {
    console.log("Error: ", error);
    return;
  }
  let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
  console.log("JSON Response\n");

  var regions = JSON.parse(body).regions;
  var op = "";
  regions.forEach(item => {
    item.lines.forEach(it => {
      it.words.forEach(i => {
        /* console.log(i.text) */ op += i.text + " ";
      });
    });
  });

  console.log(op);
});
