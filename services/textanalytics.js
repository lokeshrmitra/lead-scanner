const request = require("request");

const subscriptionKey =
  process.env.TEXT_ANALYTICS_KEY1 || process.env.TEXT_ANALYTICS_KEY2;

module.exports = {
  analyzeText: textfromOCR => {
    const options = {
      uri:
        "https://centralindia.api.cognitive.microsoft.com/text/analytics/v2.1-preview/entities",
      body: JSON.stringify({
        documents: [
          {
            language: "en",
            id: "1",
            text: textfromOCR
          }
        ]
      }),
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    };
    return new Promise((resolve, reject) => {
      console.log("Inside TA");
      request.post(options, (error, response, body) => {
        if (error) {
          console.log("Error: ", error);
          reject("Error while analyzing image");
        }
        if (response.statusCode == "200") {
          console.log("Inside TA after 200");
          // let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
          // console.log(jsonResponse);
          var leadDetails = {
            first_name: "",
            last_name: "",
            email: "",
            company: "",
            city: "",
            state: "",
            mobile: ""
          };
          var entities = JSON.parse(body).Documents[0].Entities;
          entities.forEach(item => {
            if (item.Type == "Person") {
              leadDetails.first_name = item.Name;
              leadDetails.last_name = item.Name;
            } else if (item.Type == "Email") {
              leadDetails.email = item.Name;
            } else if (item.Type == "Organization") {
              leadDetails.company = item.Name;
            } else if (item.Type == "Location") {
              leadDetails.state = item.Name;
            }
          });
          resolve({ leadDetails });
        } else {
          reject("Error while analyzing image");
        }
      });
    });
  }
};
