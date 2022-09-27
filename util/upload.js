const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
      },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadImage = multer({storage: storage}).single('image');

module.exports= uploadImage;
