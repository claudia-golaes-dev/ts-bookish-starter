import { Router, Request, Response } from 'express';
import type { Connection, Request as RequestType } from 'tedious';
import ConnectionPool from 'tedious-connection-pool';
import { Book } from '../classes/Book';
import { pool, request } from '../app';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/:id', this.getBook.bind(this));

        this.router.post('/', this.createBook.bind(this));
    }

    getBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    async createBook(req: Request, res: Response) {
        const { id_book, title, no_copies, ISBN } = req.body;
        try {
            console.log('asd')
            const newBook = await Book.addBook(pool, request, {
                id_book,
                title,
                no_copies,
                ISBN,
            });
            console.log('wtf');

            res.status(201).json({
                message: 'create OK',
                reqBody: req.body,
            });
        } catch (err) {
            res.status(500).json({
                message: 'Internal Server Error!',
            });
        }
    }
}

export default new BookController().router;
