require('dotenv').config();
const { connectDb } = require("./src/services/mongoose");
const userRoutes = require("./src/routes/user");
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const authentification = require("./src/middlewares/authentification");

// View engine
app.set("views", "src/views");
app.set("view engine", "ejs");

// Page par défaut
app.get("/", authentification, async (req, res, next) =>{
    res.render("index")
});

connectDb().catch(err => console.log(err)); 

app.use(userRoutes);

app.listen(port, () => {
    console.log("Server running");
});
