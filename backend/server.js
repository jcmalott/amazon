// Create connection to pproducts within server
// Create a connection to a product
// console log message once connection is made

import express from "express";
import products from "./data/products.js";

const app = express();

app.get("/api/products", (req, res) => {
  res.send(products.clothing);
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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
