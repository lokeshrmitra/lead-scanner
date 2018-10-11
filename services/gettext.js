const request = require("request");

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey =
  process.env.TEXT_ANALYTICS_KEY1 || process.env.TEXT_ANALYTICS_KEY2;

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase =
  "https://centralindia.api.cognitive.microsoft.com/text/analytics/v2.1-preview/entities";

const options = {
  uri: uriBase,
  body: JSON.stringify({
    documents: [
      {
        language: "en",
        id: "1",
        text:
          "Abhijeet | Saxena | Trainee-Analyst | B | +91 | 20 | 6621 | 4000 | M | +91 | 76 | 2014 | 6989 | saxena.abhijeet@principal.com | Principal | Principal | Global | Services | Pvt. | Ltd. | Level | 6 | & | 7, | Tower | VI, | Cybercity, | Magarpatta, | Hadapsar, | Pune | - | 411013 | India | www.principal.com |"
      }
    ]
  }),
  headers: {
    "Content-Type": "application/json",
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
  console.log(jsonResponse);
});
