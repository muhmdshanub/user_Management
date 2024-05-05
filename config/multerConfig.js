const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, path.join(__dirname,'../public/images/userImages/')); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        const sanitizedName = req.body.name.replace(/[^\w]/g, '');
        const newName = sanitizedName+ "_" +  Date.now()+  "_" + file.originalname;
        cb(null, newName); // Use the original file name as the new file name
    }

})

const upload = multer({ storage: storage });

module.exports = upload;