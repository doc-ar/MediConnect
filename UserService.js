const express = require("express");

const app = express();
app.use(express.json());

const users = [
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Smith",
  },
];

app.get("/users", (req, res) => {
  res.send(users);
});

app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User does not exist");
  res.send(user);
});

app.listen(3001, () => {
  console.log("User service is running");
});
