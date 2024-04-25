const express = require("express");
const app = express();

const orderRoutes = require("./routes/order.route");
const database = require("./config/database");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//routes
app.use("/api/v1/", orderRoutes);

//def route

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
