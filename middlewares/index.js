const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')
const BuildingModel = require('../models/Building')

module.exports = {
    adminUser: function (req, res, next) {
        if (!req.headers.authorization || !req.headers.authorization.split(' ')[1]) {
            res.status(403);
            return next(new Error('Bearer authentication token is required'));
        }

        try {
            let payload = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_PRIVATE_KEY);

            if (! payload) {
                res.status(401)
                return next(new Error('Invalid authentication token'));
            }

            if (payload.role != 'admin') {
                res.status(401)
                return next(new Error('Invalid admin access right'));
            }

            req.authUser = payload;            
            next();
        } catch (error) {
            res.status(403);
            return next(new Error('Invalid authentication token'));
        }
    },
    normalUser: function (req, res, next) {
        if (!req.headers.authorization || !req.headers.authorization.split(' ')[1]) {
            res.status(403);
            return next(new Error('Bearer authentication token is required'));
        }

        try {
            let payload = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_PRIVATE_KEY);

            if (! payload) {
                res.status(401)
                return next(new Error('Invalid authentication token'));
            }

            if (payload.role != 'user') {
                res.status(401)
                return next(new Error('Invalid user access right'));
            }
            
            req.authUser = payload;            
            next();
        } catch (error) {
            res.status(403);
            return next(new Error('Invalid authentication token'));
        }
    },
    userModelRoute: function(req, res, next){
        req.model = UserModel;
        next();
    },
    buildingModelRoute: function(req, res, next) {
        req.model = BuildingModel;
        next();
    }
}