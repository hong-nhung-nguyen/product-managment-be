const express = require("express");

// to use env file 
require('dotenv').config();


// to use database
const database = require("./config/database");


// to use route
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");


// connect to database through the connect function 
database.connect();

const app = express();

// get the port variable inside the env file 
const port = process.env.PORT;


// to use pug
app.set("views", "./views");
app.set("view engine", "pug");


// to use public file 
app.use(express.static("public"));

// routes
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})