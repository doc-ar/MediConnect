const express = require("express");

const app = express();
app.use(express.json());

const patients = [
  {
    id: 1,
    name: "Harpic",
  },
  {
    id: 2,
    name: "Nuka Cola",
  },
];

app.get("/patients", (req, res) => {
  res.send(patients);
});

app.get("/patients/:id", (req, res) => {
  const patient = patients.find((u) => u.id === parseInt(req.params.id));
  if (!patient) return res.status(404).send("patient does not exist");
  res.send(patient);
});

app.listen(3002, () => {
  console.log("patient service is running");
});
