const { ObjectId } = require("mongodb");

module.exports = class BaseController {
    static async findById(req, res, next) {
        try {
            if (!req.params.id) {
                res.status(400);
                return next(new Error('Parameter id is required'));
            }


            let record = await req.model.findOne({ _id: new ObjectId(req.params.id) })
            res.status(200);
            return res.send({ success: true, data: record });
        } catch (error) {
            console.log(error);
            res.status(500);
            return next(new Error('Error serving request'));
        }
    }

    static async findAll(req, res, next){
        try {
            let records = await req.model.find({});
            res.status(200);
            return res.send({success: true, data: records});
        } catch (error) {
            console.log(error);
            res.status(500);
            return next(new Error("Error getting records"));
        }
    }

    static async updateById(req, res, next){
        if (!req.params.id) {
            res.status(400);
            return next(new Error('Parameter id is required'));
        }

        try {
            await req.model.updateById(req.params.id, req.body);
            res.status(201);
            return res.send({success: true, message: "Record update successful"});
        } catch (error) {
            console.log(error);
            res.status(500);
            return next(new Error("Error updating record"));
        }
    }

    static async create(req, res, next){
        try {
            await req.model.create(req.body);
            res.status(201);
            return res.send({ success: true, message: "Record created successfully" });
        } catch (error) {
            console.log(error);
            res.status(500);
            return next(new Error("Error in creating record"));
        }
    }

    static async deleteById(req, res, next){
        if (!req.params.id) {
            res.status(400);
            return next(new Error('Parameter id is required'));
        }

        try {
            await req.model.deleteById(req.params.id);
            res.status(201);
            return res.send({success: true, message: "Record deleted successful"});
        } catch (error) {
            console.log(error);
            res.status(500);
            return next(new Error("Error deleting record"));
        }
    }
}