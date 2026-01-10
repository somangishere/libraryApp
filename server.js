const express = require('express');
const cors = require('cors');
const db = require('./db');
const LoanService = require('./services/LoanService');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const loanService = new LoanService(db);


//GET collections
app.get('/collections', (req, res) => {
    loanService.getAllCollections ((err, results) => {
        if (err) {
            res.status(500).json({ error: 'database error' });
            return;
        }
        res.json(results);
    });
});


//GET loans
app.get('/loans', (req, res) => {
    loanService.getAllLoans ((err, results) => {
        if (err) {
            res.status(500).json({ error: 'database error' });
            return;
        }
        res.json(results);
    });
});

//POST borrow

app.post('/borrow', (req, res) => {
    const { collectionId, memberName, loanDate } = req.body;

    if (!collectionId || !memberName || !loanDate) {
        return res.status(400).json({ error: 'collectionId, memberName, dan loanDate wajib diisi' });
    }

    loanService.findOrCreateMemberByName(memberName, (err, memberId) => {
        if (err) return res.status(500).json({ error: err.message });

        const loanDateObj = new Date(loanDate);
        const dueDate = new Date(loanDateObj);
        dueDate.setDate(loanDateObj.getDate() + 7);

        loanService.createLoan(collectionId, memberId, loanDateObj, dueDate, (err2, result) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ message: 'Loan created', loanId: result.insertId });
        });
    });
});


app.get('/loan-history', (req, res) => {
    loanService.getLoanHistory((err, results) => {
        if (err) return res.status(500).json({ error: 'database error' });
        res.json(results);
    });
});

app.get('/loans-by-member', (req, res) => {
    const { name } = req.query;
    loanService.getLoansByMemberName(name, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/return', (req, res) => {
    const { loanId } = req.body;
    loanService.returnLoan(loanId, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Book returned' });
    });
});

app.post('/collections', (req, res) => {
    const { title, author, total_copies } = req.body;
    loanService.addCollection(title, author, total_copies, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Book added' });
    });
});

app.delete('/collections/:id', (req, res) => {
    loanService.deleteCollection(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Book deleted' });
    });
});

app.listen(3001, () => {
    console.log('API running on http://localhost:3001');
});