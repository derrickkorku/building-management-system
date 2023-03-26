const { ObjectId } = require('mongodb');
const BuildingModel = require('../models/Building')
const BaseController = require('./BaseController')

module.exports = class BuildingsController extends BaseController {
    static async addApartment(req, res, next) {
        let query = { $push: { "apartments": req.body } };

        try {
            let resp = await BuildingModel.updateByQuery({ _id: new ObjectId(req.params.id) }, query);

            if (!resp) {
                res.status(500);
                return next(new Error('Error adding apartment'));
            }

            res.status(201);
            return res.send({ success: true, message: "Apartment added successfully" });
        } catch (error) {
            console.log(error);
            res.status(500);
            return next(new Error('Error adding apartment'));
        }
    }

    static async getApartments(req, res, next) {
        try {
            let building = await BuildingModel.findOne({ _id: new ObjectId(req.params.id) });

            if (!building) {
                res.status(500);
                return next(new Error('No building exists for the provided building id'));
            }

            res.status(200)
            return res.send({ success: true, data: building.apartments ? building.apartments : [] });

        } catch (error) {
            res.status(500);
            return next(new Error('Error getting building apartments'));
        }
    }

    static async getApartment(req, res, next) {
        try {
            let building = await BuildingModel.findOne({ _id: new ObjectId(req.params.id) });

            if (!building) {
                res.status(500);
                return next(new Error('No building exists for the provided building id'));
            }

            let apartment = building.apartments.find(ap => ap.code == req.params.apartmentCode);
            res.status(200)
            return res.send({ success: true, data: apartment });

        } catch (error) {
            res.status(500);
            return next(new Error('Error getting building apartments'));
        }
    }

    static async deleteApartment(req, res, next) {
        try {
            let updateBy = { _id: new ObjectId(req.params.id) }
            let deleteQuery = { $pull: { "apartments": { code: req.params.apartmentCode } } };
            await BuildingModel.updateByQuery(updateBy, deleteQuery);

            res.status(201)
            return res.send({ success: true, message: "Apartment has been removed" });

        } catch (error) {
            res.status(500);
            return next(new Error('Error in removing apartment'));
        }
    }

    static async updateApartment(req, res, next) {
        try {

            let building = await BuildingModel.findOne({ _id: new ObjectId(req.params.id) });
            if (!building) {
                res.status(400);
                return next(new Error('No building found for the provided id'));
            }

            building.apartments = building.apartments ? building.apartments : [];
            let apartment = building.apartments.find(ap => ap.code == req.params.apartmentCode);

            if (!apartment) {
                res.status(400);
                return next(new Error('No apartment found for the provided building'));
            }

            if (! req.body.capacity || req.body.capacity <= apartment.capacity) {
                res.status(400);
                return next(new Error('Provide a valid apartment capacity'));
            }

            apartment.capacity = req.body.capacity;

            let updateBy = { _id: new ObjectId(req.params.id), "apartments.code": req.params.apartmentCode }
            let query = { $set: { "apartments.$": apartment } };
            
            await BuildingModel.updateByQuery(updateBy, query);

            res.status(201)
            return res.send({ success: true, message: "Apartment has been updated" });

        } catch (error) {
            res.status(500);
            return next(new Error('Error in updating apartment'));
        }
    }

    static async checkIn(req, res, next) {
        try {
            let building = await BuildingModel.findOne({ _id: new ObjectId(req.params.id) });
            if (!building) {
                res.status(400);
                return next(new Error('No building found for the provided id'));
            }

            building.apartments = building.apartments ? building.apartments : [];
            let apartment = building.apartments.find(ap => ap.code == req.params.apartmentCode);

            if (!apartment) {
                res.status(400);
                return next(new Error('No apartment found for the provided building'));
            }

            apartment.residents = apartment.residents ? apartment.residents : [];
            if (apartment.vacancies == 0 || apartment.residents.length == apartment.capacity) {
                res.status(400);
                return next(new Error('There is no vacancy in apartment'));
            }

            let userEmail = apartment.residents.find(remail => remail == req.body.email);

            if (userEmail) {
                res.status(400);
                return next(new Error('A user with the provided email already exists in the apartment'));
            }

            let updateQuery = {
                $push: {"apartments.$.residents" : req.body.email},
                $inc: {"apartments.$.vacancies": -1}
            };
            let updateBy = { _id: new ObjectId(req.params.id), "apartments.code": req.params.apartmentCode };
            
            await BuildingModel.updateByQuery(updateBy, updateQuery);

            res.status(201)
            return res.send({ success: true, message: "Check in successful" });

        } catch (error) {
            console.log(error)
            res.status(500);
            return next(new Error('Error checking in'));
        }
    }

    static async checkOut(req, res, next) {
        try {
            let building = await BuildingModel.findOne({ _id: new ObjectId(req.params.id) });
            if (!building) {
                res.status(400);
                return next(new Error('No building found for the provided id'));
            }

            building.apartments = building.apartments ? building.apartments : [];
            let apartment = building.apartments.find(ap => ap.code == req.params.apartmentCode);

            if (!apartment) {
                res.status(400);
                return next(new Error('No apartment found for the provided building'));
            }

            if (!apartment.residents || apartment.residents.length == 0) {
                res.status(400);
                return next(new Error('No user exists in residence to checkout'));
            }

            let updateQuery = {
                $pull: {"apartments.$.residents" : req.body.email},
                $inc: {"apartments.$.vacancies": 1}
            };

            let updateBy = { _id: new ObjectId(req.params.id), "apartments.code": req.params.apartmentCode };
            
            await BuildingModel.updateByQuery(updateBy, updateQuery);

            res.status(201)
            return res.send({ success: true, message: "Check out successful" });

        } catch (error) {
            console.log(error)
            res.status(500);
            return next(new Error('Error checking out'));
        }
    }
}