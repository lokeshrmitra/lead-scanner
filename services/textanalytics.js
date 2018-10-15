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
            let type = item.Type;
            let val = item.Name;
            val = val.replace(/\s?\|\s+/g, " "); //Removes Garbage Delimiters
            val = val.trim(); //Trims to remove any extra whitespace
            if (type == "Person") {
              if (leadDetails.first_name == "") {
                leadDetails.first_name = val;
              } else {
                leadDetails.last_name += val;
              }
            } else if (type == "Email") {
              leadDetails.email = val;
            } else if (type == "Quantity" && val.length >= 10) {
              if (leadDetails.mobile == "") leadDetails.mobile = val;
            } else if (type == "Organization") {
              leadDetails.company += val;
            } else if (type == "Location") {
              if (leadDetails.city == "") {
                leadDetails.city = val;
              } else {
                leadDetails.state += " " + val;
              }
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
