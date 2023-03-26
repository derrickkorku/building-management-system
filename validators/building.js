const { ObjectId } = require('mongodb');
const BuildingModel = require('../models/Building')

module.exports = {
    createBuilding: async function(req, res, next){
        try {
            let existsCode = await BuildingModel.findOne({code: req.body.code});

            if (existsCode) {
                res.status(400)
                return next(new Error('The provided building code already exists'));
            }

            next();
        } catch (error) {
            console.log(error)
            res.status(500)
            return next(new Error("Error validating building creation request."));
        }
    },
    updatingBuilding: async function(req, res, next){
        if (req.body.code) {
            delete req.body.code;
        }
        next()
    },

    isUniqueApartmentCode: async function(req, res, next){
        try {
            let id = new ObjectId(req.params.id);
            let building = await BuildingModel.findOne({_id: id});

            if (! building) {
                res.status(400)
                return next(new Error('No building exists for the provided id'));
            }

            building.apartments = building.apartments ? building.apartments : [];
            let apartment = building.apartments.find(ap => ap.code == req.body.code);

            if (apartment) {
                res.status(400)
                return next(new Error('The provided apartment code already exists'));
            }

            next();
        } catch (error) {
            console.log(error)
            res.status(500)
            return next(new Error("Error validating apartment oode in request."));
        }
    },

    isUniqueDeviceCode: async function(req, res, next){
        try {
            let building = await BuildingModel.findOne({ _id: new ObjectId(req.params.id) });

            if (!building) {
                res.status(400);
                return next(new Error('No building exists for the provided building id'));
            }

            building.apartments = building.apartments ? building.apartments : [];
            let apartment = building.apartments ? building.apartments.find(ap => ap.code == req.params.apartmentCode) : null;
            if (! apartment) {
                res.status(400);
                return next(new Error('No apartment exists for the provided apartment code'));
            }

            apartment.devices = apartment.devices ? apartment.devices : [];

            let device = apartment.devices.find(d => d.code == req.body.code);
            if (device) {
                res.status(400);
                return next(new Error('A device with the provided code already exists'));
            }

            next();
        } catch (error) {
            console.log(error)
            res.status(500)
            return next(new Error("Error validating device oode in request."));
        }
    }
}