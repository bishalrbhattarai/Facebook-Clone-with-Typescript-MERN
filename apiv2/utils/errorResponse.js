const errorResponse = (err, req, res) => {
  try {
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = errorResponse;
