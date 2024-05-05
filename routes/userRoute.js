const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const upload = require('../config/multerConfig');
const config = require('../config/myconfig');
const session = require('express-session');

const userRoute = express.Router();


userRoute.use(session({
    name: 'userSession',
    secret: config.userSessionSecret,
    resave: false,
    saveUninitialized: false,
  }));

userRoute.get('/home', auth.isLogin, userController.loadHome);
userRoute.get('/logout',auth.isLogin,userController.logoutHandler);
userRoute.get('/register', auth.isLogOut, userController.loadRegister);
userRoute.post('/register', upload.single('image'), userController.insertUser);
userRoute.get('/', auth.isLogOut, userController.loginLoader);
userRoute.get('/login', auth.isLogOut, userController.loginLoader);
userRoute.post('/login-submit',userController.verifyAndhandleLogin);


module.exports = userRoute
    