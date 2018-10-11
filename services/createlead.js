const request = require("request");

// Replace <Subscription Key> with your valid subscription key.
const oid = process.env.OID;

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = "https://webto.salesforce.com/servlet/servlet.WebToLead";

const options = {
  uri: uriBase,
  form: {
    oid: oid,
    retURL: "https://",
    first_name: "Abhijeet",
    last_name: "Saxena",
    email: "shopforabhi@gmail.com",
    company: "Barclays",
    city: "Des Moines",
    state: "IA",
    mobile: "9999999999"
  }
};

request.post(options, (error, response) => {
  if (error) {
    console.log("Error: ", error);
    return;
  }
  //   let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
  console.log("JSON Response\n");
  console.log(response.statusCode);
});
