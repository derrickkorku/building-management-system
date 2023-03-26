const { ObjectId } = require('mongodb');
const BuildingModel = require('../models/Building')
const BaseController = require('./BaseController')

module.exports = class DevicesController extends BaseController {
    static async addDevice(req, res, next) {
        let query = { $push: { "apartments.$.devices": req.body } };

        try {
            let resp = await BuildingModel.updateByQuery({ _id: new ObjectId(req.params.id), "apartments.code": req.params.apartmentCode }, query);

            if (!resp) {
                res.status(400);
                return next(new Error('Error adding apartment device'));
            }

            res.status(201);
            return res.send({ success: true, message: "Apartment device added successfully" });
        } catch (error) {
            console.log(error);
            res.status(500);
            return next(new Error('Error adding apartment device'));
        }
    }

    static async getDevices(req, res, next) {
        try {
            let building = await BuildingModel.findOne({ _id: new ObjectId(req.params.id) });

            if (!building) {
                res.status(400);
                return next(new Error('No building exists for the provided building id'));
            }

            let apartment = building.apartments ? building.apartments.find(ap => ap.code == req.params.apartmentCode) : null;
            if (!apartment) {
                res.status(400);
                return next(new Error('No apartment exists for the provided apartment code'));
            }

            res.status(200)
            return res.send({ success: true, data: apartment.devices ? apartment.devices : [] });

        } catch (error) {
            res.status(500);
            return next(new Error('Error getting apartment devices'));
        }
    }

    static async getDevice(req, res, next) {
        try {
            let building = await BuildingModel.findOne({ _id: new ObjectId(req.params.id) });

            if (!building) {
                res.status(400);
                return next(new Error('No building exists for the provided building id'));
            }

            let apartment = building.apartments ? building.apartments.find(ap => ap.code == req.params.apartmentCode) : null;
            if (!apartment) {
                res.status(400);
                return next(new Error('No apartment exists for the provided apartment code'));
            }

            apartment.devices = apartment.devices ? apartment.devices : [];

            let device = apartment.devices.find(d => d.code == req.params.deviceCode);

            res.status(200)
            return res.send({ success: true, data: device });

        } catch (error) {
            res.status(500);
            return next(new Error('Error getting building apartments'));
        }
    }

    static async deleteDevice(req, res, next) {
        try {
            let updateBy = { _id: new ObjectId(req.params.id), "apartments.code": req.params.apartmentCode }
            let deleteQuery = { $pull: { "apartments.$.devices": { code: req.params.deviceCode } } };
            await BuildingModel.updateByQuery(updateBy, deleteQuery);

            res.status(201)
            return res.send({ success: true, message: "Apartment device has been removed." });

        } catch (error) {
            res.status(500);
            return next(new Error('Error in removing apartment device'));
        }
    }

    static async updateDevice(req, res, next) {
        try {
            if (! req.body.description) {
                return next(new Error('No device desciption data to update to.'));
            }

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

            let device = apartment.devices.find(d => d.code == req.params.deviceCode);
            if (! device) {
                res.status(400);
                return next(new Error('No such device exists'));
            }

            device.description = req.body.description;

            let updateBy = { _id: new ObjectId(req.params.id) }
            let query = {
                $set: { "apartments.$[ap].devices.$[d]": device },
            };
            let arrayFilters = {
                arrayFilters: [{ "ap.code": req.params.apartmentCode }, { "d.code": req.params.deviceCode }]
            };

            await BuildingModel.updateByQuery(updateBy, query, arrayFilters);

            res.status(201)
            return res.send({ success: true, message: "Apartment device updated" });

        } catch (error) {
            res.status(500);
            return next(new Error('Error in updating apartment device'));
        }
    }
}