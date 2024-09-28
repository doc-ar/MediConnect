const express = require("express");

const app = express();
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Harpic",
  },
  {
    id: 2,
    name: "Nuka Cola",
  },
];

app.get("/products", (req, res) => {
  res.send(products);
});

app.get("/products/:id", (req, res) => {
  const product = products.find((u) => u.id === parseInt(req.params.id));
  if (!product) return res.status(404).send("Product does not exist");
  res.send(product);
});

app.listen(3002, () => {
  console.log("Product service is running");
});
