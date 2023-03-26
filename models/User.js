const BaseApiModel = require('./BaseApiModel')

module.exports = class User extends BaseApiModel {
    static getCollectionName(){
        return 'users';
    }
}