const errorResponse = require("../utils/errorResponse");

exports.signUp = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    errorResponse(error, req, res);
  }
};
