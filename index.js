const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();

//router
const userRoutes = require("./routes/user.routes");
// const taskRoutes = require("./routes/route.task");
//middlewares
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/user", userRoutes);
// app.use("/api/task", taskRoutes);

mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "database error:"));
db.once("open", () => console.log("Connected to the database! "));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`App is running to port ${port}...`));