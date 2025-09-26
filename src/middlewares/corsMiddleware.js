const { allowedOrigins } = require("../configs/allowedOrigins");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Unauthorized."));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
