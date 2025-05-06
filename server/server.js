const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const connectDB = require("./config/db");

//route handlers
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const messageRoutes = require("./routes/messageRoutes");
const commentRoutes = require("./routes/commentRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware configurations

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
);
app.use(cookieParser());

//connect to db
connectDB();

//route handlers
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/comment", commentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to E-commerce Platform",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});
