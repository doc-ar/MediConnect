const express = require("express");

const app = express();
app.use(express.json());

app.get("/auth", (req, res) => {
  console.log("This is a test to check if auth is working")
  return res.send("Auth Page");
});

app.listen(3000, () => {
  console.log("User service is running");
});
