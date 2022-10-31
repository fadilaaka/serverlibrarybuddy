const express = require("express");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const apiRouter = require("./routes/api");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/dblibrarybuddy", {
  autoIndex: false,
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000000000 },
  })
);
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/admin", adminRouter);
// app.use("/admin/v1/api", apiRouter);

app.listen(3001, (error) => {
  if (error) console.log(error);
  console.log("Server online on port 3001");
});
