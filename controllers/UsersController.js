const UserModel = require('../models/User')
const BaseController = require('./BaseController')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = class UsersController extends BaseController{
    static async login(req, res, next) {
        let { email, password } = req.body;

        let record = await UserModel.findOne({ email });
        if (!record) {
            res.status(400);
            return next(new Error("Invalid username or password"));
        }

        try {
            let valid = await bcrypt.compare(password, record.password);

            if (!valid) {
                res.status(400);
                return next(new Error("Invalid username or password"));
            }

            delete record.password;
            let token = jwt.sign(record, process.env.JWT_PRIVATE_KEY);

            res.status(200);
            return res.send({ success: true, token: token });
        } catch (error) {
            res.status(400);
            return next(new Error("Invalid username or password"));
        }
    }

    static async create(req, res, next) {
        let { name, email, password, phone, role } = req.body;

        if (!role) {
            res.status(400);
            return next(new Error("User role required"));
        }

        if (!['admin', 'user'].includes(role)) {
            res.status(400);
            return next(new Error("A role can either be admin or user"));
        }

        let recordExists = await UserModel.findOne({email});

        if (recordExists){
            res.status(400);
            return next(new Error("A record with the provided email already exists"));
        }

        password = bcrypt.hashSync(password, 10);

        let postData = { name, email, password, phone, role };
        let created = await UserModel.create(postData);

        if (!created) {
            res.status(400);
            return next(new Error("Unable to create user record. Please try again"));
        }

        res.status(201);
        return res.send({ success: true, message: "User record created successfully" });
    }

    static async upploadProfilePicture(req, res, next){
        if (! req.file) {
            return next(new Error('No profile image uploaded'));
        }
        
        try {
            await UserModel.updateById(req.params.id, {profilePicture: req.file.path});
            res.status(201)
            return res.send({success: true, message: "Profile picture upload successful."});
        } catch (error) {
            console.log(error)
            res.status(500)
            return next(new Error('Error uploading profile picture'));
        }
    }
}