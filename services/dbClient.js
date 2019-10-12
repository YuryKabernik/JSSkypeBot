class DbClient {
    constructor(dbConnection) {
        this.connectionPool = dbConnection;
    }

    request() {
        this.connectionPool.request().execute();
    }
}

module.exports.DbClient = DbClient;
