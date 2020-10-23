const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// app
const app = express();

// connect database
mongoose
  .connect(process.env.MONGO_URI_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Database connected!!"));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// // cors
// if (process.env.NODE_ENV === "development") {
//   app.use(
//     cors({
//       origin: `${process.env.CLIENT_URL}`,
//     })
//   );
// }

// routes
const authRoute = require("./src/routes/auth.route");
app.use("/api", authRoute);

const userRoute = require("./src/routes/user.route");
app.use("/api/user", userRoute);

const categoryRoute = require("./src/routes/category.route");
app.use("/api", categoryRoute);

const tagRoute = require("./src/routes/tag.route");
app.use("/api", tagRoute);

const blogRoute = require("./src/routes/blog.route");
app.use("/api/blog", blogRoute);

const contactRoute = require("./src/routes/contact.route");
app.use("/api", contactRoute);

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
