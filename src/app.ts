import express, { Response } from 'express';
import 'dotenv/config';
import healthcheckRoutes from './controllers/healthcheckController';
import bookRoutes from './controllers/bookController';
import { Book } from './classes/Book';
import ConnectionPool from 'tedious-connection-pool';

const ConnectionPool = require('tedious-connection-pool');
const Request = require('tedious').Request;
import healthcheckController from './controllers/healthcheckController';
import bookController from './controllers/bookController';

// eslint-disable-next-line @typescript-eslint/no-var-requires

const port = process.env['PORT'] || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

/**
 * Primary app routes.
 */
app.use('/healthcheck', healthcheckRoutes);
app.use('/books', bookRoutes);

const Connection = require('tedious').Connection;

export const request = require('tedious').Request;

const poolConfig = {
    min: 2,
    max: 4,
    log: true,
};

const connectionConfig = {
    userName: 'ClaGolDB',
    password: '&VsCy-cL@1427092!',
    server: 'localhost',
};

export const pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on('error', function (err) {
    console.error(err);
});

app.get('/', async (req, res) => {
    try {
        const books = await Book.getBooks(pool, request);
        console.log(books);
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err });
        console.log(err);
    }
});

app.post('/books', async (req, res) => {
    try {
        const { id_book, title, no_copies, ISBN } = req.body;
        const book = await Book.addBook(pool, request, {
            id_book,
            title,
            no_copies,
            ISBN,
        });
        console.log(book);
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err });
        console.log(err);
    }
});
