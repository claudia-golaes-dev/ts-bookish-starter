import type { Connection, Request as RequestType } from 'tedious';

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
        connection: Connection,
        Request: typeof RequestType,
    ): Promise<Book[]> {
        return new Promise<Book[]>((resolve, reject) => {
            const books: Book[] = [];

            const request = new Request(
                'SELECT * FROM bookish.dbo.BOOKS',
                (err) => {
                    if (err) {
                        return reject(err);
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
    }
}
