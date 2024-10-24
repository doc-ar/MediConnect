import express from "express";

const app = express();
app.use(express.json());

const doctors = [
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Smith",
  },
];

app.get("/doctors", (req, res) => {
  res.send(doctors);
});

app.get("/doctors/:id", (req, res) => {
  const doctor = doctors.find((u) => u.id === parseInt(req.params.id));
  if (!doctor) return res.status(404).send("doctor does not exist");
  res.send(doctor);
});

app.listen(3001, () => {
  console.log("doctor service is running");
});
