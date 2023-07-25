// Create connection to pproducts within server
// Create a connection to a product
// console log message once connection is made

import express from "express";
import fs from "fs";
import products from "./data/products.js";
import bcrypt from "bcryptjs";
import { generateToken } from "./utils.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/products", (req, res) => {
  fs.readFile("./data/clothing.json", "utf-8", (err, data) => {
    err
      ? res.status(404).send({ message: "Can't connect to cloting Database" })
      : res.send(data);
  });
});

app.get("/api/users", (req, res) => {
  fs.readFile("./data/users.json", "utf-8", (err, data) => {
    err
      ? res.status(404).send({ message: "Can't connect to user Database" })
      : res.send(data);
  });
});

app.get("/api/products/slug/:slug", (req, res) => {
  fs.readFile("./data/clothing.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Product not found" });
    } else {
      const clothing = JSON.parse(data);
      const product = clothing.find((x) => x.slug === req.params.slug);
      res.send(product);
    }
  });
});

app.get("/api/products/:id", (req, res) => {
  fs.readFile("./data/clothing.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to cloting Database" });
    } else {
      const clothing = JSON.parse(data);
      const product = clothing.find((x) => x._id === req.params.id);
      res.send(product);
    }
  });
});

//POST
app.post("/api/users/signin", (req, res) => {
  fs.readFile("./data/users.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to user Database" });
    } else {
      const users = JSON.parse(data);
      const user = users.find((x) => x.email === req.body.email);
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
    }
  });
});

app.post("/api/users/signup", (req, res) => {
  const newUser = {
    _id: (products.users.length + 1).toString(),
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  };

  const fileContents = fs.readFileSync("./data/users.json", "utf-8");

  let users = JSON.parse(fileContents);
  users.push(newUser);
  fs.writeFile("./data/users.json", JSON.stringify(users, null, 2), (err) => {
    err ? console.log(err) : console.log("File Written");
  });

  res.send({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    token: generateToken(newUser),
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
