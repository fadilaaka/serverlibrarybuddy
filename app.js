const express = require("express");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const cors = require("cors");
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const apiRouter = require("./routes/api");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://adminbuddy:3gOk3H1s3gikNKjv@cluster0.i9lntqd.mongodb.net/?retryWrites=true&w=majority",
  {
    autoIndex: false,
  }
);

app.use(cors());
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
app.use("/v1/api", apiRouter);

app.listen(process.env.PORT || 3000, (error) => {
  if (error) console.log(error);
  console.log("Server online on port 3000");
});
