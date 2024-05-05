const User = require('../models/userModel');
const bcrypt = require('bcrypt');

//password encryption

const securePassword = async(password) =>{
    try{

        const passwordHashed = await bcrypt.hash(password, 10);
        return passwordHashed;

    }catch (error){
        console.log(error.message);
    }
}

const loadRegister = async (req, res) => {
    try{

        res.render('users/register.ejs');
    }catch(error){
        console.log(error.message);
    }
}
// 

const insertUser = async (req, res) => {
    try {

        // Check if the email is already in use
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            // If email is already in use, send a flash message
            req.flash('error', 'Email is already in use. Please choose another email.');
            res.redirect('/register'); // Redirect to the registration page or handle it as needed
        } else {

            // If email is not in use, create and save the new user
            const updatedPassword = await securePassword(req.body.password);

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: updatedPassword, 
                image: req.file.filename,
                isAdmin: 0,
            });

            const userData = await user.save();

            if (userData) {
                


                req.flash('success', 'You have been successfully registered.');
                res.redirect('/register'); // Redirect to the registration page or handle it as needed
            } else {
                req.flash('error', 'Failed registration attempt. Please try again.');
                res.redirect('/register'); // Redirect to the registration page or handle it as needed
            }
        }
    } catch (error) {
        // Handle other errors if needed
        console.error(error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/register'); // Redirect to the registration page or handle it as needed
    }
};




// login page loading

const loginLoader = async (req, res) => {
    try{
        res.render('users/login');
    }catch(error){
        console.log(error.message);
    }
}

//verifying and handling login post requests

const verifyAndhandleLogin = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData =await User.findOne({ email : email });

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                req.session.userId = userData._id;
                res.redirect('/home');
            }else{
                req.flash('error', 'Incorrect Email or Password!');
                res.redirect('/login');
            }
        }else{
            
            req.flash('error', 'Incorrect Email or Password !');
            res.redirect('/login');
        }

    }catch(error){
        console.log(error.message);
    }
}

const loadHome = async (req, res) =>{
    try{

        const userData = await User.findById({_id:req.session.userId});
        res.render('users/home',{user : userData});
    }catch(error){
        console.log(error.message)
    }
}

const logoutHandler = async (req, res) => {
    try{
        req.session.userId = null;
        res.redirect('/');
    }catch (error){
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoader,
    verifyAndhandleLogin,
    loadHome,
    logoutHandler
}