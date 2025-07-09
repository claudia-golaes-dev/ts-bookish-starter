import 'dotenv/config';

const ConnectionPool = require('tedious-connection-pool');
let Request = require('tedious').Request;

// eslint-disable-next-line @typescript-eslint/no-var-requires

const Connection = require('tedious').Connection;

const request = require('tedious').Request;

const poolConfig = {
    min: 2,
    max: 4,
    log: true
};

const connectionConfig = {
    userName: 'ClaGolDB',
    password: '&VsCy-cL@1427092!',
    server: 'localhost',
};

const pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on('error', function(err) {
    console.error(err);
});
