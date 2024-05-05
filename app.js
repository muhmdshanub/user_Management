const express = require('express');
const path = require('path');
const flash = require('express-flash');
const config = require('./config/myconfig');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');

const app = express();

//initialize view engine
app.set('view engine', 'ejs');

//set static path to public and node modules directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//flash and session





app.use(flash());
//cache blocking
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  next();
});
//router
app.use('/',userRoute);
app.use('/admin',adminRoute);


module.exports = app;