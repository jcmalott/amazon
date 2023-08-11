// Create connection to pproducts within server
// Create a connection to a product
// console log message once connection is made

import express from "express";
import fs from "fs";
import products from "./data/products.js";
import bcrypt from "bcryptjs";
import { generateToken, isAdmin, isAuth } from "./utils.js";
import Order from "./components/Order.js";
import AddToFile from "./components/AddToFile.js";
import { PAYPAL_CLIENT_ID } from "./ServerStrings.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/keys/paypal", isAuth, (req, res) => {
  res.send(PAYPAL_CLIENT_ID || "sb");
});

app.get("/api/orders/mine", isAuth, (req, res) => {
  fs.readFile("./data/orders.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to orders Database" });
    } else {
      const orders = JSON.parse(data);
      res.send(orders.filter((x) => x.user_id === req.user._id));
    }
  });
});

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

app.get("/api/orders/:id", isAuth, (req, res) => {
  fs.readFile("./data/orders.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to orders Database" });
    } else {
      const orders = JSON.parse(data);
      const order = orders.find((x) => x._id === req.params.id);
      res.send(order);
    }
  });
});

app.get("/api/categories", (req, res) => {
  fs.readFile("./data/clothing.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to clothing Database" });
    } else {
      const products = JSON.parse(data);
      // list categories with no duplicates
      let categories = products
        .map((x) => x.category)
        .filter((value, index, self) => self.indexOf(value) === index);
      res.send(categories);
    }
  });
});

const PAGE_SIZE = 3;
app.get("/api/search", (req, res) => {
  const { query } = req;
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const order = query.order || "";
  const searchQuery = query.query || "";

  function sortOrder(list) {
    order === "featured" || order === "highest"
      ? list.sort((a, b) =>
          a.price < b.price ? 1 : a.price > b.price ? -1 : 0
        )
      : order === "lowest"
      ? list.sort((a, b) =>
          a.price > b.price ? 1 : a.price < b.price ? -1 : 0
        )
      : order === "toprated"
      ? { rating: -1 }
      : order === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };
  }

  fs.readFile("./data/clothing.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to cloting Database" });
    } else {
      let products = JSON.parse(data);
      products =
        category === "all"
          ? products
          : products.filter((x) => x.category === category);
      products =
        price === "all"
          ? products
          : products.filter((x) => x.price <= parseInt(price));
      products =
        rating === "all"
          ? products
          : products.filter((x) => x.rating >= rating);

      const countProducts = Object.keys(products).length;
      sortOrder(products);
      // add a way to skip pages
      // add a way to set pages returned

      res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
      });
    }
  });
});

app.get("/api/admin", isAuth, isAdmin, (req, res) => {
  let orders = {};
  let users = {};
  console.log("Connected");

  fs.readFile("./data/users.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to users Database" });
    } else {
      const dataParsed = JSON.parse(data);
      // number of users
      users = { numOfUsers: dataParsed.length };
    }
  });

  fs.readFile("./data/orders.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to Orders Database" });
    } else {
      const dataParsed = JSON.parse(data);
      // number of orders
      // total sales
      const numOrders = dataParsed.length;
      const totalSales = dataParsed.reduce((a, c) => a + c.itemsPrice, 0);
      // total prices of orders each day
      const dailyOrders = {};
      // number of items in each category
      let categories = [];
      const productCategories = dataParsed.map((x) => {
        x.orderItems.map((item) => {
          const duplicate = categories.find(
            (y) => y.category === item.category
          );
          duplicate
            ? (duplicate.amount += 1)
            : categories.push({ category: item.category, amount: 1 });
        });
      });

      orders = { numOrders, totalSales, dailyOrders, productCategories };
      console.log("Categories ", categories);
      res.send({ users, orders, categories });
    }
  });
});

app.get("/api/admin/products", isAuth, isAdmin, (req, res) => {
  const { query } = req;
  const page = query.page || 1;
  const pageSize = query.pageSize || PAGE_SIZE;

  fs.readFile("./data/clothing.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to clothing Database" });
    } else {
      const products = JSON.parse(data);
      // 0-3 3-6 6-9
      const productsToDisplay = products.slice(
        (page - 1) * pageSize,
        page * pageSize
      );
      const countProducts = products.length;
      res.send({
        productsToDisplay,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
      });
    }
  });
});

//PUT
app.put("/api/orders/:id/pay", isAuth, (req, res) => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  fs.readFile("./data/orders.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to orders Database" });
    } else {
      const orders = JSON.parse(data);
      const order = orders.find((x) => x._id === req.params.id);

      if (order) {
        order.isPaid = true;
        order.paidAt = new Date().toJSON();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };

        fs.writeFile(
          "./data/orders.json",
          JSON.stringify(orders, null, 2),
          (err) => {
            err ? console.log(err) : console.log("File Written");
          }
        );
        res.send({ message: "Order Paid", order: order });
      } else {
        res.status(404).send({ message: "Order Not Found" });
      }
    }
  });
});

app.put("/api/users/profile", isAuth, (req, res) => {
  fs.readFile("./data/users.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to users Database" });
    } else {
      const users = JSON.parse(data);
      const user = users.find((x) => x._id === req.user._id);

      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
          user.password = bcrypt.hashSync(req.body.password, 8);

          fs.writeFile(
            "./data/users.json",
            JSON.stringify(users, null, 2),
            (err) => {
              err ? console.log(err) : console.log("File Written");
            }
          );

          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user),
          });
        }
      } else {
        res.status(404).send({ message: "User Not Found" });
      }
    }
  });
});

app.put("/api/products/:id", isAuth, (req, res) => {
  fs.readFile("./data/clothing.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send({ message: "Can't connect to clothing Database" });
    } else {
      const products = JSON.parse(data);
      const product = products.find((x) => x._id === req.params.id);

      if (product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.price = req.body.price;
        product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;

        fs.writeFile(
          "./data/clothing.json",
          JSON.stringify(products, null, 2),
          (err) => {
            err ? console.log(err) : console.log("File Written");
          }
        );

        res.send({ message: "Product Updated" });
      } else {
        res.status(404).send({ message: "Product Not Found" });
      }
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

  AddToFile("./data/users.json", newUser);

  res.send({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    token: generateToken(newUser),
  });
});

app.post("/api/orders", isAuth, (req, res) => {
  let order = Order(req.body, req.user);
  const fileContents = fs.readFileSync("./data/orders.json", "utf-8");
  let parseContents = JSON.parse(fileContents);
  order = { ...order, _id: "" + (parseContents.length + 1) };

  parseContents.push(order);
  fs.writeFile(
    "./data/orders.json",
    JSON.stringify(parseContents, null, 2),
    (err) => {
      err ? console.log(err) : console.log("File Written");
    }
  );

  // AddToFile("./data/orders.json", newOrder, true);

  res.status(201).send({ message: "New Order Created", order });
});

app.post("/api/products", isAuth, (req, res) => {
  const fileContents = fs.readFileSync("./data/clothing.json", "utf-8");
  let parseContents = JSON.parse(fileContents);

  const newProduct = {
    _id: (parseContents.length + 1).toString(),
    name: "sample name " + Date.now(),
    slug: "sample-name-" + Date.now(),
    image: "/images/p1.jpg",
    price: 0,
    category: "sample category",
    countInStock: 0,
    brand: "sample brand",
    rating: 0,
    numReviews: 0,
    description: "sample description",
  };

  parseContents.push(newProduct);
  fs.writeFile(
    "./data/clothing.json",
    JSON.stringify(parseContents, null, 2),
    (err) => {
      err ? console.log(err) : console.log("File Written");
    }
  );

  res.send({ message: "New Product Created", newProduct });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
