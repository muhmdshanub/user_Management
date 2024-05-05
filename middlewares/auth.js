// Auth middleware
const isLogin = async (req, res, next) => {
    try {
        if (req.session.userId) {
            res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            next(); 
        } else {
            res.redirect('/login');
            
        }
        
    } catch (error) {
        console.log(error.message);
    }
};

const isLogOut = async (req, res, next) => {
    try {
        if (req.session.userId) {
            res.redirect('/home'); // User is logged in, redirect to '/home'
        } else{
            res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            next();
        }
        
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogOut,
    isLogin
}