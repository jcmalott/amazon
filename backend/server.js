// Create connection to pproducts within server
// Create a connection to a product
// console log message once connection is made

import express from "express";
import products from "./data/products.js";
import bcrypt from "bcryptjs";
import { generateToken } from "./utils.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/products", (req, res) => {
  res.send(products.clothing);
});

app.get("/api/users", (req, res) => {
  res.send(products.users);
});

app.get("/api/products/slug/:slug", (req, res) => {
  const product = products.clothing.find((x) => x.slug === req.params.slug);
  product
    ? res.send(product)
    : res.status(404).send({ message: "Product not found" });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.clothing.find((x) => x._id === req.params.id);
  product
    ? res.send(product)
    : res.status(404).send({ message: "Product not found" });
});

//POST
app.post("/api/users/signin", (req, res) => {
  const user = products.users.find((x) => x.email === req.body.email);
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: "Invalid email or password" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
