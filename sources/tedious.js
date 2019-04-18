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

function executeStatement(statement) {
    connection.on('connect', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(' == Connected == ');
            handleStatement(statement);
        }
    });
}

function handleStatement(statement) {
    request = new Request(statement, (err) => {
        if (err) console.log(err)
    });

    request.on('row', (columns) => {
        console.log('\n > New Entry :');
        columns.forEach((column) => {
            console.log(column.metadata.colName + ' : ' + column.value);
        });
    });
    connection.execSql(request);
}

executeStatement('select * from Users');