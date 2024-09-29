const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", proxy("http://127.0.0.1:3001/users"));
app.use("/products", proxy("http://127.0.0.1:3002"));
app.use("/", proxy("http://127.0.0.1:3001"));

app.listen(3000, () => {
  console.log("Gateway is Listening to Port 8000");
});
