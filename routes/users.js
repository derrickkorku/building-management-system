const express = require('express')
const path = require('path')
const multer = require('multer')
const middleware = require('../middlewares')
const UsersController = require('../controllers/UsersController')

const imageUpload = multer({
    storage: path.join(__dirname, '../public/images'),
    limits: { fileSize: 2000000 }, //2M,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Please upload a Image'))
        }

        cb(undefined, true)
    }
});

const router = express.Router()

router.post('/login', UsersController.login);

/**
 * Admin user operations
 * 
 */
router.use(middleware.adminUser)
router.post('', UsersController.create);
router.use(middleware.userModelRoute); //Pass User Model Object
router.get('/:id', UsersController.findById)
router.get('', UsersController.findAll);
router.put('/:id', UsersController.updateById);
router.delete('/:id', UsersController.deleteById);


router.use(middleware.normalUser)
router.put('/:id/upload-profile-picture', imageUpload.single('picture'), UsersController.upploadProfilePicture);


module.exports = router;