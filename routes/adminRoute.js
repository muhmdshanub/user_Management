const express = require('express');
const adminRoute = express();
const session = require('express-session');
const config = require('../config/myconfig');
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/adminAuth');
const upload = require('../config/multerConfig');

adminRoute.use(express.json());
adminRoute.use(express.urlencoded({ extended: true }));

//initialize view engine
adminRoute.set('view engine', 'ejs');
adminRoute.set('views','./views/admin');


adminRoute.use(session({
    name: 'adminSession',
    secret: config.adminSessionSecret,
    resave: false,
    saveUninitialized: false,
  }));




adminRoute.get('/',auth.isLogout, adminController.loginLoader);
adminRoute.post('/',adminController.verifyAndhandleLogin);
adminRoute.get('/home',auth.isLogin, adminController.loadHome);
adminRoute.get('/dashboard',auth.isLogin, adminController.loadDashboard);
adminRoute.get('/logout',auth.isLogin,adminController.logoutHandler);
adminRoute.get('/new-user',auth.isLogin, adminController.loadNewUser);
adminRoute.post('/new-user', upload.single('image'), adminController.addNewUser);
adminRoute.get('/edit-user/:userId',auth.isLogin, adminController.editUserLoad);
adminRoute.post('/edit-user/:userId', upload.single('image'), adminController.handleUpdateUser);
adminRoute.get('/delete-user/:userId',auth.isLogin, adminController.handleDeleteUser);
adminRoute.get('*', (req, res) => {
    res.redirect('/admin');
});


module.exports = adminRoute;