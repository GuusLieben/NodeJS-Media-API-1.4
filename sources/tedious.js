const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

var config = {
    server: '192.168.2.21',
    options: {
        database: 'NodeDB'
    },
    authentication: {
        type: 'default',
        options: {
            userName: 'gs',
            password: '8zEkD6zkM_'
        }
    }
};
const connection = new Connection(config);

function executeStatement(statement, func) {
    connection.on('connect', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(' == Connected == ');
            handleStatement(statement, func);
        }
    });
}

function handleStatement(statement, func) {
    let request = new Request(statement, (err) => {
        if (err) console.log(err)
    });

    request.on('row', (columns) => {
        console.log('\n > New Entry => Executing task');
        func(columns);
    });

    request.on('requestCompleted', function () {
        return true;
    });

    connection.execSql(request);
}

module.exports.executeStatement = executeStatement;