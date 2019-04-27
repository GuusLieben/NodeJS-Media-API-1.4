const i = require('../..');
const mssql = require('../business/mssql');

module.exports = {
    getUserById: (req, res) => {
        let userObj;
        mssql.executeStatement('select * from Users where id=' + req.params.userId, (columns) => {
            userObj = new i.store.User(
                columns[0].value, // Name
                columns[1].value, // Street
                columns[2].value, // City
                columns[3].value, // Postal
                columns[4].value, // Birthdate
                columns[5].value, // Phone
                columns[6].value, // Email
                columns[7].value, // Password
                columns[8].value);
        }, () => {
            i.sendJson(req, res, userObj);
        }).catch(() => {
            res.status(400).json('{success: false}');
        });
    },

    getAllUsers: (req, res) => {
        let collectedUsers = [];
        let executeStatement = mssql.executeStatement('select * from Users',
            (columns) => {
                collectedUsers.push(
                    new i.store.User(
                        columns[0].value, // Name
                        columns[1].value, // Street
                        columns[2].value, // City
                        columns[3].value, // Postal
                        columns[4].value, // Birthdate
                        columns[5].value, // Phone
                        columns[6].value, // Email
                        columns[7].value, // Password
                        columns[8].value)) // Id
            },
            () => i.sendJson(req, res, collectedUsers)).catch(() => {
            res.status(400).json('{success: false}');
        });
        executeStatement.then(i.logger.debug('Collected data from MSSQL'))
    },

    postUser: (req, res) => {
        i.logger.debug('New User POST');
        const b = req.query;
        let user = new i.store.User(b.name, b.street, b.city, b.postcode, b.birthdate, b.phone, b.email, b.password);
        mssql.executeStatement(
            format('insert into Users(name, street, postal_code, city, birthdate, phone, email, password) values (\'%s\', \'%s\', \'%s\', \'%s\', \'%s\', \'%s\', \'%s\', \'%s\')', b.name, b.street, b.city, b.postcode, b.birthdate, b.phone, b.email, b.password),
            () => {
                i.sendJson(req, res, user);
            }, () => {
                i.logger.debug('Finished POST');
                mssql.executeStatement(format('select * from Users where email=\'%s\' and phone=\'%s\'', b.email, b.phone), (cols) => {
                    user.id = cols[8].value
                }, () => i.sendJson(req, res, user));
            }).catch(() => {
            res.status(400).json('{success: false}');
        });
    }
};

const format = (...args) => args.shift().replace(/%([jsd])/g, x => x === '%j' ? JSON.stringify(args.shift()) : args.shift())