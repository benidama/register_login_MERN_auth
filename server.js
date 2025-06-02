import express from "express";
import router from "./routes/route.js";

const PORT = 3000;

// express app
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//Home page
app.get("/", (req, res) => res.send("Hello Express! Welcome to the server."));

//About page
app.get("/user", (req, res) => {
  res.send("This is the about page.");
});

app.use("/user", router);
app.post("/users", (req, res) => {
  console.log(req.body);
  const { name, email } = req.body;
  res.json({
    message: `This is the post request. Name: ${name}, Email: ${email}`,
  });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  res.json({
    message: `This is the put request for user with ID: ${userId}. Name: ${name}, Email: ${email}`,
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.json({
    message: `This is the delete request for user with ID: ${userId}`,
  });
});

app.listen(PORT, () => {
  console.log("listening for requests on port", PORT);
});
