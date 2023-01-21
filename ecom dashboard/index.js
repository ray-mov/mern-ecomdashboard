const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const jwtkey = "xocomm";

require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");

const app = express();

//middleaware for json data
app.use(express.json());
app.use(cors());

//midleware for token

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  console.log(token);
  if (token) {
    jwt.verify(token, jwtkey, (err, authData) => {
      if (err) {
        res.status(401).send({ result: "Token not valid" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "PLease add token with header" });
  }
}

app.post("/signup", async (req, res) => {
  let user = User(req.body);
  let result = await user.save(); // return promise
  result = result.toObject(); // convert to object
  delete result.password;
  jwt.sign(
    { result },
    jwtkey,
    { expiresIn: "2h" },
    // { algorithm: "RS256" },
    (err, token) => {
      if (err) {
        res.send({
          result: "something went wrong, Please try after some time",
        });
      }
      res.send({ result, auth: token });
    }
  );
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body, { _id: 1, name: 1, email: 1 });

    if (user) {
      jwt.sign(
        { user },
        jwtkey,
        { expiresIn: "2h" },
        // { algorithm: "RS256" },
        (err, token) => {
          if (err) {
            res.send({
              result: "something went wrong, Please try after some time",
            });
          }
          res.send({ user, auth: token });
        }
      );
    } else {
      res.send("no user found");
    }
  } else {
    res.send("Invalid ");
  }
});

app.post("/add-product", async (req, res) => {
  let product = Product(req.body);
  let result = await product.save(); // return promise
  result = result.toObject(); // convert to object
  res.send(result);
});

app.get("/products", verifyToken, async (req, res) => {
  let product = await Product.find(); // return promise
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send({ result: "No Products Found" });
  }
});

app.delete("/product/:id", async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.put("/product/:id", async (req, res) => {
  const result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

app.get("/product/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No Products Found" });
  }
});

app.get("/search/:key", async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  });
  if (result) {
    res.send(result);
  }
});

app.listen(5000);
