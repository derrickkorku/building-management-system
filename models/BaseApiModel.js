const { ObjectId } = require('mongodb');
const DBConnection = require('../dbconnect')
let db = null;

DBConnection.getConnection().then((connect) => db = connect).catch(error => console.log('ERR connecting'));

module.exports = class BaseApiModel {
    static async findOne(params) {
        try {
            let record = await db.collection(this.getCollectionName()).findOne(params);
            return record;
        } catch (error) {
            console.log(error);
        }
    }

    static async find(params) {
        try {
            let records = await db.collection(this.getCollectionName()).find(params).toArray();
            return records;
        } catch (error) {
            console.log(error);
        }
    }

    static async create(params) {
        try {
            await db.collection(this.getCollectionName()).insertOne(params);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async updateById(id, params) {
        try {
            id = new ObjectId(id)
            await db.collection(this.getCollectionName()).updateOne({ _id: id }, { $set: params })
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async updateByQuery(by, query, arrayFilters) {
        try {
            if (arrayFilters) {
                await db.collection(this.getCollectionName()).updateOne(by, query, arrayFilters)
                return true;
            }

            await db.collection(this.getCollectionName()).updateOne(by, query)
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async deleteById(id) {
        try {
            await db.collection(this.getCollectionName()).deleteOne({ _id: new ObjectId(id) })
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}