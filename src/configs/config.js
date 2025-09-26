require("dotenv").config();

const {
  PORT
} = process.env;

const ENV = {
  PORT: PORT
};

module.exports = ENV;
