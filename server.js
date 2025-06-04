import express from "express";
import router from "./routes/route.js";

const PORT = 3000;

// express app
const app = express();

// middleware
app.use(express.json());

app.use("/welcome", (req, res, next) => {
  console.log("A new request received at" + Date.now());
  next();
});
app.get("/welcome", (req, res) => {
  res.send("Welcome to the Express server!");
});
//Home page
app.get("/", (req, res) => res.send("Hello Express! Welcome to the server."));

//About page
app.get("/things/:name/:id([0-9]{5})", (req, res) => {
  const { name, id } = req.params;
  res.json({ id, name });
});
//catch all route
// app.get("*", (req, res) => {
//   res.status(404).send("Page not found");
// });

app.use("/user", router);

app.get("/error", (req, res) => {
  throw new Error("This is an error");
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.send("internal server error");
});

//set EJS as view engine
app.set("view engine", "ejs");

app.get("/text", (req, res) => {
  const userName = "John Doe";
  res.render("index", { userName });
});

app.get("/seconds", (req, res) => {
  const htmlContent = "<strong>This is bold text</strong>";
  res.render("second", { content: htmlContent });
});

app.use("/public", express.static("public"));
app.use("/image", express.static("images"));
// CRUD operations
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
