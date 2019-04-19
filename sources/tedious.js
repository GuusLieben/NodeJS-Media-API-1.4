const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const i = require('../index');

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

async function executeStatement(statement, onRow, onComplete) {
    i.logger.debug('Connecting...');
    const connection = new Connection(config);
    connection.on('connect', (err) => {
        i.logger.debug('Connect state');
        if (err) {
            i.logger.debug(err);
        } else {
            i.logger.debug(' == Connected == ');
            handleStatement(connection, statement, onRow, onComplete);
        }
    });
}

function handleStatement(connection, statement, onRow, onComplete) {
    i.logger.debug('Handling');
    i.logger.debug('Statement : ' + statement);
    let request = new Request(statement, (err) => {
        if (err) i.logger.debug(err)
    });

    i.logger.debug('Constructed req');

    request.on('row', (columns) => {
        i.logger.debug('\n > New Entry => Executing task');
        onRow(columns);
    });

    request.on('requestCompleted', function () {
        onComplete();
    });

    connection.execSql(request);
}

module.exports.executeStatement = executeStatement;