const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  const user = req.params.user;
  res.status(200).send(`Hello World! Are you ready to learn Node.js? ${user}`);
});
app.listen(4000, () => console.log("Server is running on port 4000"));
