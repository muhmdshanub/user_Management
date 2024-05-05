const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');




// login page loading

const loginLoader = async (req, res) => {
    try{
        res.render('login');
    }catch(error){
        console.log(error.message);
    }
}

//verify and handle admin login

const verifyAndhandleLogin = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData =await User.findOne({ email : email });

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.isAdmin === 0){
                    req.flash('error', 'Incorrect Email or Password!');
                    res.redirect('/admin');
                }else{
                    req.session.adminUserId = userData._id;
                    req.session.isAdmin = userData.isAdmin;
                    res.redirect('/admin/home');
                }
                
            }else{
                req.flash('error', 'Incorrect Email or Password!');
                res.redirect('/admin');
            }
        }else{
            
            req.flash('error', 'Incorrect Email or Password !');
            res.redirect('/admin');
        }

    }catch(error){
        console.log(error.message);
    }
}

//load admin dashboard

const loadHome = async (req, res) =>{
    try{
        const userData = await User.findById({_id:req.session.adminUserId});
        res.render('home',{user : userData});  
        
    }catch(error){
        console.log(error.message)
    }
}

//logging out admin
const logoutHandler = async (req, res) => {
    try{
        req.session.adminUserId = null;
        req.session.isAdmin = null;
        res.redirect('/admin');
    }catch (error){
        console.log(error.message);
    }
}
const loadNewUser = async (req, res) => {
    try{
        res.render('new-user');
    }catch(error){
        console.log(error.message) 
    }
}
//securing the password
const securePassword = async(password) =>{
    try{

        const passwordHashed = await bcrypt.hash(password, 10);
        return passwordHashed;

    }catch (error){
        console.log(error.message);
    }
}

//adding new user
const addNewUser = async (req, res) => {
    try {

        // Check if the email is already in use
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            // If email is already in use, send a flash message
            req.flash('error', 'Email is already in use. Please choose another email.');
            res.redirect('/admin/new-user'); // Redirect to the registration page or handle it as needed
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
        
                req.flash('success', `New user ${userData.name} has added.`);
                res.redirect('/admin/new-user'); // Redirect to the registration page or handle it as needed
            } else {
                req.flash('error', 'Failed registration attempt. Please try again.');
                res.redirect('/admin/new-user'); // Redirect to the registration page or handle it as needed
            }
        }
    } catch (error) {
        // Handle other errors if needed
        console.error(error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/admin/new-user'); // Redirect to the registration page or handle it as needed
    }
};

const editUserLoad = async (req, res) =>{
    try{
        const userId = req.params.userId;
        

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            req.flash('error', 'Invalid user ID');
            res.redirect('/admin/dashboard');
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            req.flash('error', 'User not found');
            res.redirect('/admin/dashboard');
            return;
        }

        res.render('edit-user', { user });
    }catch(error){
        console.log(error.message);
    }
}

const handleUpdateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, email, mobile } = req.body;
        const userToUpdate = await User.findById(userId);

        if (!userToUpdate) {
            req.flash('error', 'User not found');
            res.redirect('/admin/dashboard');
            return;
        }

        // Update the fields that have values in the request
        userToUpdate.name = name || userToUpdate.name;
        userToUpdate.email = email || userToUpdate.email;
        userToUpdate.mobile = mobile || userToUpdate.mobile;

        // Update the image only if a new file is provided
        if (req.file) {
            userToUpdate.image = req.file.filename;
        }

        // Save the updated user document
        const updatedUser = await userToUpdate.save();

        if (updatedUser) {
            req.flash('success', 'User updated successfully');
            res.redirect('/admin/dashboard');
        } else {
            req.flash('error', 'Failed to update user');
            res.redirect(`/admin/edit-user/${userId}`);
        }
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect(`/admin/edit-user/${userId}`);
    }
};

//delete user
const handleDeleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('_id');

        if (!user) {
            req.flash('error', 'User not found');
            res.redirect('/admin/dashboard');
            return;
        }

        const confirmed = req.query.confirm === 'true';

        if (confirmed) {
            await User.deleteOne({ _id: userId });
            req.flash('success', 'User deleted successfully');
            res.redirect('/admin/dashboard');
        } else {
            req.flash('error', 'Deletion not confirmed');
            res.redirect('/admin/dashboard');
        }
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to delete user');
        res.redirect('/admin/dashboard');
    }
};
// Load admin dashboard with search functionality
const loadDashboard = async (req, res) => {
    try {
        let query = {};

        // Check if there's a search query
        if (req.query.q) {
            const searchQuery = new RegExp(req.query.q, 'i');
            query = {
                $or: [
                    { name: searchQuery },
                    { email: searchQuery },
                    { mobile: searchQuery }
                ],
                isAdmin: 0
            };
        } else {
            // If no search query, retrieve all users with isAdmin: 0
            query = { isAdmin: 0 };
        }

        const usersData = await User.find(query);

        res.render('dashboard', { users: usersData, searchQuery: req.query.q || '' });
    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
    loginLoader,
    verifyAndhandleLogin,
    loadHome,
    loadDashboard,
    logoutHandler,
    loadNewUser,
    addNewUser,
    editUserLoad,
    handleUpdateUser,
    handleDeleteUser

}