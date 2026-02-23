const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

// to use notifications for front-end
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");


// to use env file 
require('dotenv').config();


// to use database
const database = require("./config/database");

const systemConfig = require("./config/system")

// to use route
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");


// connect to database through the connect function 
database.connect();

const app = express();

// get the port variable inside the env file 
const port = process.env.PORT;

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// to use pug
app.set("views", "./views");
app.set("view engine", "pug");

// Flash
app.use(cookieParser("BOMAYLANHAT"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.message = {
        success: req.flash("success")
    };
    next();
});
// End Flash

// App Local Variables: all these variables will exist in all pug files
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// to use public file 
app.use(express.static("public"));

// routes
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})