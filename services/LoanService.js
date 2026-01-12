class LoanService {
    constructor(db) {
        this.db = db;
    }

 
    getAllCollections(callback) {
        this.db.query('SELECT * FROM collections', callback);
    }

   
    addCollection(title, author, totalCopies, callback) {
        const sql = `
            INSERT INTO collections (title, author, total_copies, available_copies)
            VALUES (?, ?, ?, ?)
        `;
        this.db.query(sql, [title, author, totalCopies, totalCopies], callback);
    }

    updateCollection(id, title, author, totalCopies, callback) {
        const sql = `
            UPDATE collections 
            SET title = ?, author = ?, total_copies = ?
            WHERE id = ?
        `;
        this.db.query(sql, [title, author, totalCopies, id], callback);
    }

    deleteCollection(id, callback) {
        const sql = `
            DELETE FROM collections WHERE id = ?
            `;
        this.db.query(sql, [id], callback);
    }

   
    getAllLoans(callback) {
        this.db.query('SELECT * FROM loans', callback);
    }

   
    getLoanHistory(callback) {
        const sql = `
            SELECT
                loans.id,
                members.name AS member_name,
                collections.title AS book_title,
                loans.loan_date,
                loans.due_date,
                loans.returned_date
            FROM loans
            JOIN members ON loans.member_id = members.id
            JOIN collections ON loans.collection_id = collections.id
        `;
        this.db.query(sql, callback);
    }

  
    getLoansByMemberName(name, callback) {
        const sql = `
            SELECT 
                loans.id,
                collections.title AS book_title,
                loans.loan_date,
                loans.due_date,
                loans.returned_date,
                collections.id AS collection_id
            FROM loans
            JOIN members ON loans.member_id = members.id
            JOIN collections ON loans.collection_id = collections.id
            WHERE members.name = ? AND loans.returned_date IS NULL
        `;
        this.db.query(sql, [name], callback);
    }

   
    createLoan(collectionId, memberId, loanDate, dueDate, callback) {
        // cek stok
        this.db.query(
            'SELECT available_copies FROM collections WHERE id = ?',
            [collectionId],
            (err, rows) => {
                if (err) return callback(err);
                if (!rows || rows.length === 0) return callback(new Error('collection not found'));

                const available = rows[0].available_copies;
                if (available <= 0) return callback(new Error('no copies available'));

                // insert loan
                const insertSql = `
                    INSERT INTO loans (collection_id, member_id, loan_date, due_date)
                    VALUES (?, ?, ?, ?)
                `;

                this.db.query(
                    insertSql,
                    [collectionId, memberId, loanDate, dueDate],
                    (err2, result) => {
                        if (err2) return callback(err2);

                        // kurangi stok
                        this.db.query(
                            'UPDATE collections SET available_copies = available_copies - 1 WHERE id = ?',
                            [collectionId],
                            (err3) => {
                                if (err3) return callback(err3);
                                callback(null, result);
                            }
                        );
                    }
                );
            }
        );
    }

    returnLoan(loanId, callback) {
        this.db.query(
            'SELECT collection_id FROM loans WHERE id = ? AND returned_date IS NULL',
            [loanId],
            (err, rows) => {
                if (err) return callback(err);
                if (!rows || rows.length === 0) {
                    return callback(new Error('loan not found or already returned'));
                }

                const collectionId = rows[0].collection_id;

                // set returned_date
                this.db.query(
                    'UPDATE loans SET returned_date = NOW() WHERE id = ?',
                    [loanId],
                    (err2) => {
                        if (err2) return callback(err2);

                        // tambah stok
                        this.db.query(
                            'UPDATE collections SET available_copies = available_copies + 1 WHERE id = ?',
                            [collectionId],
                            (err3) => {
                                if (err3) return callback(err3);
                                callback(null);
                            }
                        );
                    }
                );
            }
        );
    }


    findOrCreateMemberByName(name, callback) {
        this.db.query(
            'SELECT id FROM members WHERE name = ?',
            [name],
            (err, rows) => {
                if (err) return callback(err);

                if (rows && rows.length > 0) {
                    return callback(null, rows[0].id);
                }

                // create new member
                this.db.query(
                    'INSERT INTO members (name) VALUES (?)',
                    [name],
                    (err2, result) => {
                        if (err2) return callback(err2);
                        callback(null, result.insertId);
                    }
                );
            }
        );
    }
}

module.exports = LoanService;
