import express, { Response } from 'express';
import 'dotenv/config';
import healthcheckRoutes from './controllers/healthcheckController';
import bookRoutes from './controllers/bookController';
import { Book } from './classes/Book';
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
const config = {
    server: 'localhost',
    options: {
        trustServerCertificate: true,
    },
    authentication: {
        type: 'default',
        options: {
            userName: 'ClaGolDB',
            password: '&VsCy-cL@1427092!',
        },
    },
};

const connection = new Connection(config);
const request = require('tedious').Request;
const books: Book[] = [];

connection.on('connect', function (err: Error) {
    if (err) {
        console.log(err);
    }
});

connection.connect();

app.get('/', async (req, res) => {
    try {
        const books = await Book.getBooks(connection, request);
        console.log(books);
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err });
        console.log(err);
    }
});

// function executeStatement() {
//     Request = new Request('select * from bookish.dbo.BOOKS', function (
//         err: any,
//         rowCount: string,
//     ) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(rowCount + ' rows');
//             connection.close();
//         }
//     });
//
//     let getBooks: Book[] = [];
//
//     Request.on('row', function (columns) {
//         let id_book: number;
//         let title: string;
//         let no_copies: number;
//         let ISBN: bigint;
//         columns.forEach(function (column) {
//             columns.forEach(function (column) {
//                 switch (column.metadata.colName) {
//                 case 'id_book':
//                     id_book = column.value;
//                     break;
//                 case 'title':
//                     title = column.value;
//                     break;
//                 case 'no_copies':
//                     no_copies = column.value;
//                     break;
//                 case 'ISBN':
//                     ISBN = BigInt(column.value);
//                     break;
//                 }
//             });
//         });
//         const book = new Book(id_book, title, no_copies, ISBN);
//         getBooks.push(book);
//     });
//     console.log(getBooks);
//     connection.execSql(Request);
// }
