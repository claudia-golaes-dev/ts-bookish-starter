import type { Request as RequestType } from 'tedious';
import TYPES from 'tedious';
import ConnectionPool from 'tedious-connection-pool';

export class Book {
    public id_book: number;
    public title: string;
    public no_copies: number;
    public ISBN: string;

    constructor(
        id_book: number,
        title: string,
        no_copies: number,
        ISBN: string,
    ) {
        this.id_book = id_book;
        this.title = title;
        this.no_copies = no_copies;
        this.ISBN = ISBN;
    }

    static async getBooks(
        pool: ConnectionPool,
        Request: typeof RequestType,
    ): Promise<Book[]> {
        return new Promise<Book[]>((resolve, reject) => {
            const books: Book[] = [];
            pool.acquire(function (err, connection) {
                if (err) {
                    console.error(err);
                    return;
                }
                const request = new Request(
                    'SELECT * FROM bookish.dbo.BOOKS',
                    (err) => {
                        if (err) {
                            connection.release();
                        } else {
                            return resolve(books);
                        }
                    },
                );

                request.on('row', (columns) => {
                    let id_book = 0;
                    let title = '';
                    let no_copies = 0;
                    let ISBN = '';

                    columns.forEach((column) => {
                        switch (column.metadata.colName) {
                            case 'id_book':
                                id_book = column.value;
                                break;
                            case 'title':
                                title = column.value;
                                break;
                            case 'no_copies':
                                no_copies = column.value;
                                break;
                            case 'ISBN':
                                ISBN = column.value;
                                break;
                        }
                    });
                    books.push(new Book(id_book, title, no_copies, ISBN));
                });
                connection.execSql(request);
            });
        });
    }

    static async addBook(
        pool: ConnectionPool,
        Request: typeof RequestType,
        bookData: Book,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                pool.acquire(function (err, connection) {
                    console.log('before');
                    const insertQuery = `
                        INSERT INTO bookish.dbo.BOOKS (id_book, title, no_copies, ISBN)
                        VALUES (@id_book, @title, @no_copies, @ISBN)`;
                    console.log('after');
                    console.log(insertQuery);
                    console.log('here');
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('there');
                    const request = new Request(insertQuery, (err) => {
                        connection.release();
                        console.log('asdsajdasdka');
                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log('qwe');
                            resolve();
                        }
                    });
                    console.log('the other here');

                    request.addParameter(
                        'id_book',
                        TYPES.Int,
                        bookData.id_book,
                    );
                    request.addParameter(
                        'title',
                        TYPES.VarChar,
                        bookData.title,
                    );
                    request.addParameter(
                        'no_copies',
                        TYPES.Int,
                        bookData.no_copies,
                    );
                    request.addParameter('ISBN', TYPES.VarChar, bookData.ISBN);
                    console.log('the other there');

                    let insertedBook: Book;
                    request.on('row', (columns) => {
                        console.log('AAAAAAAAAA');

                        let id_book = 0;
                        let title = '';
                        let no_copies = 0;
                        let ISBN = '';
                        console.log('WTFFFFF');

                        columns.forEach((column) => {
                            switch (column.metadata.colName) {
                                case 'id_book':
                                    id_book = column.value;
                                    console.log(id_book);
                                    break;
                                case 'title':
                                    title = column.value;
                                    break;
                                case 'no_copies':
                                    no_copies = column.value;
                                    break;
                                case 'ISBN':
                                    ISBN = column.value;
                                    break;
                            }
                        });
                        insertedBook = new Book(
                            id_book,
                            title,
                            no_copies,
                            ISBN,
                        );
                        console.log(insertedBook);
                    });
                    console.log('what');
                    request.on('requestCompleted', () => {
                        if (insertedBook) {
                            console.log('Succesful!');
                        } else {
                            reject(new Error('Failed to insert book'));
                        }
                    });
                    connection.execSql(request);
                });
            } catch (err) {
                console.log(err.message);
                console.log(err);
            }
        });
    }
}
