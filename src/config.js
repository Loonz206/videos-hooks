const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  key: process.env.REACT_APP_YT_API_KEY,
  baseUrl: process.env.REACT_APP_BASEURL,
};
