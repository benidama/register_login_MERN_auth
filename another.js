const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello World! Are you ready to learn Node.js?");
});
app.listen(4000, () => console.log("Server is running on port 4000"));
