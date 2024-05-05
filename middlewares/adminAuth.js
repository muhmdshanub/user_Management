const User = require('../models/userModel');
const mongoose = require('mongoose');

// Auth middleware
const isLogin = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.session.adminUserId)) {
            req.flash('error', 'Invalid user ID');
            res.redirect('/admin');
            return;
        }

        if (req.session.userId) {
            const userData = await User.findById(req.session.adminUserId);
            if (userData) {

                if(req.session.isAdmin === 1){
                    next(); // User is logged in and is an admin, proceed
                }else{
                    req.flash('error', 'Please login to your admin portal using credentials!!');
                    res.redirect('/admin');
                }
                
            } else {
                req.flash('error', 'Please login to your admin portal using credentials!!');
                res.redirect('/admin');
            } 
        } else {
            req.flash('error', 'Please login to your admin portal using credentials!!');
            res.redirect('/admin');
            
        }
    } catch (error) {
        console.log(error.message);
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.userId) {
            const userData = await User.findById(req.session.adminUserId);
            if (userData && req.session.isAdmin === 1) {
                res.redirect('/admin/home');
            }else{
                next();
            } 
        }else{
            next();
        }

    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogout,
    isLogin
}