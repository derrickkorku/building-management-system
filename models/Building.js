const BaseApiModel = require('./BaseApiModel')

module.exports = class Building extends BaseApiModel {
    static getCollectionName(){
        return 'buildings';
    }
}