const sql = require('mssql');

module.exports.Iterations = {
    GetIterationById: (connection, id) => {
        return {
            execute: async () => await connection
                .request()
                .input('iterationId', id)
                .execute('GetIterationById')
        };
    },
    GetAllIterations: (connection, amount = 100) => {
        return {
            execute: async () => await connection
                .request()
                .input('amount', amount)
                .execute('GetAllIterations')
        };
    },
    SaveIteration: (connection, { id, iteration }) => {
        return {
            execute: async () => await connection
                .request()
                .input('id', id)
                .input('path', iteration.path)
                .input('date', iteration.date)
                .execute('SaveIteration')
        };
    },
    RemoveIteration: (connection, id) => {
        return {
            execute: async () => await connection
                .request()
                .input('id', id)
                .execute('RemoveIteration')
        };
    },
    IsIterationIncluded: (connection, id) => {
        return {
            execute: async () => await connection
                .request()
                .input('id', id)
                .output('isIncluded', sql.Bit, 'isIncluded')
                .execute('IsIterationIncluded')
        };
    }
};
