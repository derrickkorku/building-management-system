const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017"

module.exports = class DBConnection {
    static connection = null;

    static async getConnection() {
        if (this.connection) {
            return this.connection;
        }

        let client = new MongoClient(uri);
        await client.connect();
        this.connection = client.db('finalproject');
        console.log("DB Connected");
        return this.connection;
    }
}