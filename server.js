import express from "express";
const PORT = 3000;

// express app
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get("/", (req, res) => res.send("Hello Express! Welcome to the server."));

app.listen(PORT, () => {
  console.log("listening for requests on port", PORT);
});
