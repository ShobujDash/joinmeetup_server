const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shobujd6@gmail.com",
    pass: "unjyupsmcbyxzyau",
  },
});

module.exports = transporter;
