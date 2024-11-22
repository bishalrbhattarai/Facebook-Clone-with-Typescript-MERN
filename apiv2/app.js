const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth");

app.get("/health", (req, res) => {
  res.status(200).send(`API Working`);
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: err,
  });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
