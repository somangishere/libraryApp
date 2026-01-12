# Library Management System – libraryApp

This project is a simple **Library Management System** built using **Node.js, Express, and MySQL**.
It is designed as an academic project to demonstrate basic **CRUD operations, relational database usage, and client–server interaction**.

The system supports:

* Book collection management
* Member management
* Book borrowing and returning
* Loan history tracking

The application consists of a **backend API** and a **static frontend interface** for Admin and Customer roles.

---
## Screenshots
### Dashboard 
<img width="1032" height="911" alt="Screenshot 2026-01-12 at 1 17 01 PM" src="https://github.com/user-attachments/assets/222671c7-f34d-464a-b64b-e3c92c3f5bd6" />

### Customer Page
<img width="1037" height="914" alt="Screenshot 2026-01-12 at 1 17 21 PM" src="https://github.com/user-attachments/assets/373f5dfb-ead1-4f4e-98e8-a11c593c91a9" />

### Admin Page
<img width="1036" height="910" alt="Screenshot 2026-01-12 at 1 18 00 PM" src="https://github.com/user-attachments/assets/2adc230d-4ebf-4afd-900f-f4743a64f334" />


## Features

### Admin Features

* View complete loan history
* Add new books to the collection
* Delete books from the collection
* Monitor overdue loans

### Customer Features

* View available books
* Borrow books
* Return borrowed books
* View current active loans

---

## Technology Stack

| Layer         | Technology                    |
| ------------- | ----------------------------- |
| Backend       | Node.js, Express              |
| Database      | MySQL                         |
| Frontend      | HTML, CSS, Vanilla JavaScript |
| Communication | REST API (JSON)               |

---

## Project Structure

```
libraryApp/
├── node_modules/
├── public/
│   ├── admin.html
│   ├── customer.html
│   └── index.html
├── services/
│   └── LoanService.js
├── .gitattributes
├── db.js
├── package.json
├── package-lock.json
├── readme.md
├── server.js
└── test.js
```

---

## Database Design

Database name: `library_db`

### `members` table

| Column | Type                     |
| ------ | ------------------------ |
| id     | INT (PK, AUTO_INCREMENT) |
| name   | VARCHAR(100)             |

### `collections` table

| Column           | Type                     |
| ---------------- | ------------------------ |
| id               | INT (PK, AUTO_INCREMENT) |
| title            | VARCHAR(200)             |
| author           | VARCHAR(100)             |
| total_copies     | INT                      |
| available_copies | INT                      |

### `loans` table

| Column        | Type                      |
| ------------- | ------------------------- |
| id            | INT (PK, AUTO_INCREMENT)  |
| collection_id | INT (FK → collections.id) |
| member_id     | INT (FK → members.id)     |
| loan_date     | DATE                      |
| due_date      | DATE                      |
| returned_date | DATE                      |

### SQL Schema

```sql
CREATE DATABASE library_db;
USE library_db;

CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100),
    total_copies INT NOT NULL,
    available_copies INT NOT NULL
);

CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    collection_id INT,
    member_id INT,
    loan_date DATE,
    due_date DATE,
    returned_date DATE,
    FOREIGN KEY (collection_id) REFERENCES collections(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
);
```
### ERD Diagram

<img width="774" height="615" alt="Screenshot 2026-01-12 at 1 15 39 PM" src="https://github.com/user-attachments/assets/d023f434-cdfe-4e15-9e87-f9d9f81cda48" />


---

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/somangishere/libraryApp.git
cd libraryApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

* Open MySQL
* Create database using the SQL script above
* Make sure database credentials in `db.js` match your local setup:

```js
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'library_db'
});
```

---

## Running the Application

Start the server using:

```bash
node server.js
```

If successful, you will see:

```
API running on http://localhost:3001
connected to mysql
```

Then open browser:

```
http://localhost:3001
```

---

## API Endpoints

### Collections (Books)

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| GET    | `/collections`     | Get all books |
| POST   | `/collections`     | Add new book  |
| DELETE | `/collections/:id` | Delete book   |

---

### Loans

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/loans`                 | Get all loans              |
| GET    | `/loan-history`          | Get full loan history      |
| GET    | `/loans-by-member?name=` | Get active loans by member |
| POST   | `/borrow`                | Borrow book                |
| POST   | `/return`                | Return book                |

---

## User Interface

### Home Page

* `index.html`
* Choose between **Admin** and **Customer** mode

### Admin Page (`admin.html`)

* View loan history
* Add book
* Delete book
* See overdue status

### Customer Page (`customer.html`)

* Borrow book
* Return book
* Check active loans

---

## Business Logic

All main logic is handled in:

```
services/LoanService.js
```

Responsibilities:

* Stock validation before borrowing
* Auto-create member if not exists
* Update available copies on borrow/return
* Join queries for history and member loans

---

## Limitations

This project is intended for **academic and learning purposes**.
Current limitations:

* No authentication / authorization
* No role-based access control
* No transaction handling
* No input sanitization
* No pagination
* Not production-ready

---

## Testing

Manual testing report for **Library Management System (libraryApp)**.

---

## 📊 Test Summary

| Metric               | Value     |
| -------------------- | --------- |
| **Total Test Cases** | 9         |
| **Passed**           | 8 ✅       |
| **Failed**           | 1 ❌       |
| **Success Rate**     | **88.9%** |

---

## 🎯 Test Categories

### 1. User Interface (2 tests)

* ✅ Home page rendering
* ✅ Mode switching (Admin / Customer)

### 2. Book Collection (3 tests)

* ✅ View all books
* ❌ Delete book with active loan
* ✅ Add new book

### 3. Loan Management (3 tests)

* ✅ Borrow book
* ✅ Return book
* ✅ View loan history

### 4. Business Logic (1 test)

* ✅ Due date calculation (7 days)

---

## 📝 Detailed Test Cases

---

### TC-01: Home Page Rendering

**Priority:** High
**Type:** Functional

**Preconditions:**

* Application running
* Server connected to database

**Steps:**

1. Open browser
2. Navigate to `http://localhost:3001`

**Expected:**

* Page loads successfully
* Title: **Library App**
* Two buttons visible:

  * Customer
  * Admin

**Result:** ✅ PASS

---

### TC-02: Mode Switching

**Priority:** High
**Type:** Functional

**Preconditions:**

* User on home page

**Steps:**

1. Click **Customer** button
2. Observe navigation
3. Click **Back to Dashboard**
4. Click **Admin** button

**Expected:**

* Customer button → opens `customer.html`
* Admin button → opens `admin.html`
* Navigation works correctly

**Result:** ✅ PASS

---

### TC-03: View All Books

**Priority:** High
**Type:** Functional

**Preconditions:**

* Books exist in database

**Steps:**

1. Open Customer page
2. Observe book dropdown list

**Expected:**

* All books from `collections` table displayed
* Available stock shown correctly

**Result:** ✅ PASS

---

### TC-04: Add New Book (Admin)

**Priority:** High
**Type:** Functional

**Preconditions:**

* Admin page open

**Steps:**

1. Fill:

   * Title: `Test Book`
   * Author: `Test Author`
   * Total: `5`
2. Click **Tambah**

**Expected:**

* Alert: "Buku berhasil ditambahkan"
* Book appears in collection list
* available_copies = total_copies

**Result:** ✅ PASS

---

### TC-05: Borrow Book

**Priority:** Critical
**Type:** Functional

**Preconditions:**

* Book available
* On Customer page

**Steps:**

1. Input Name: `John`
2. Select book from dropdown
3. Select date
4. Click **Pinjam**

**Expected:**

* Message: "Loan created"
* Book stock decreases by 1
* Loan record created in database

**Result:** ✅ PASS

---

### TC-06: Return Book

**Priority:** Critical
**Type:** Functional

**Preconditions:**

* Active loan exists
* On Customer page

**Steps:**

1. Input Name: `John`
2. Click **Check Pinjaman**
3. Click **Kembalikan: [Book Title]**

**Expected:**

* Alert: "Buku berhasil dikembalikan"
* returned_date updated
* available_copies increases by 1

**Result:** ✅ PASS

---

### TC-07: View Loan History (Admin)

**Priority:** High
**Type:** Functional

**Preconditions:**

* Loans exist in database

**Steps:**

1. Open Admin page
2. Observe history table

**Expected:**

* Member name displayed
* Book title displayed
* Loan date and due date visible
* Status shows:

  * **Dikembalikan**, **Dipinjam**, or **OVERDUE**

**Result:** ✅ PASS

---

### TC-08: Due Date Calculation (7 Days Rule)

**Priority:** Critical
**Type:** Business Logic

**Preconditions:**

* On Customer page

**Steps:**

1. Input Name
2. Select book
3. Select today’s date
4. Click **Pinjam**
5. Check database record

**Expected:**

* due_date = loan_date + 7 days
* No manual input for due date

**Result:** ✅ PASS

---

### TC-09: Delete Book With Active Loan

**Priority:** High
**Type:** Negative / Validation

**Preconditions:**

* Book has been loaned
* On Admin page

**Steps:**

1. Input Book ID (which is currently borrowed)
2. Click **Hapus**

**Expected:**

* System prevents deletion
* Error shown or handled gracefully

**Actual Result:**

* ❌ Book **not deleted**
* ❌ No clear error message shown to user
* MySQL throws foreign key constraint error

**Result:** ❌ FAIL

**Root Cause:**

```text
Cannot delete or update a parent row: 
a foreign key constraint fails (loans.collection_id references collections.id)
```

**Conclusion:**

* This is **correct behavior from database perspective**
* But **poor UX** because error is not handled in frontend
* Requires:

  * Either soft delete
  * Or cascade handling
  * Or validation before delete

---

## 📈 Coverage Summary

**Features Tested:**

```
✅ Home Page               100% (1/1)
✅ Mode Switching          100% (1/1)
✅ Book Collection         66%  (2/3)
✅ Loan Management         100% (3/3)
✅ Business Logic          100% (1/1)
```

---

## ⚠ Known Issues

| ID     | Issue                                 | Impact |
| ------ | ------------------------------------- | ------ |
| BUG-01 | Cannot delete book with active loan   | High   |
| BUG-02 | No error message shown on delete fail | Medium |
| BUG-03 | No confirmation dialog before delete  | Low    |

---

## ✅ Test Conclusion

**Summary:**

Out of 9 test cases:

* **8 PASSED**
* **1 FAILED** (Delete book with active loan)

The system is **functionally correct for core operations**:

* Borrow flow works
* Return flow works
* Stock management works
* Due date logic works
* History tracking works

However, the following must be improved:

1. ❌ **Delete validation handling**
2. ❌ **User-friendly error feedback**
3. ❌ **Data integrity UX layer**

---


## Author
Valent Rafael Somangkey
LSP Certification - Programmer
