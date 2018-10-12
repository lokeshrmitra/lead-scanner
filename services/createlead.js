const request = require("request");
module.exports = {
  create: (options, res) => {
    request.post(options, (error, response) => {
      if (error) {
        console.log("Error: ", error);
        res.render("error", { msg: err });
      }
      res.redirect("success");
    });
  }
};
