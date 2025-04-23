-- BASE DE DONNÉES
CREATE DATABASE IF NOT EXISTS devbook;
USE devbook;

-- TABLE UTILISATEURS
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member'
);

-- TABLE CATÉGORIES
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- TABLE LIVRES
CREATE TABLE IF NOT EXISTS books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    ISBN VARCHAR(20) UNIQUE,
    published_year YEAR,
    available BOOLEAN DEFAULT TRUE,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE SET NULL
);

-- TABLE EMPRUNTS
CREATE TABLE IF NOT EXISTS loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    member_id INT NOT NULL,
    date_borrowed DATE NOT NULL DEFAULT CURRENT_DATE,
    date_returned DATE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- DONNÉES EXEMPLE

INSERT INTO users (name, email, password, role) VALUES
('Alice Admin', 'alice.admin@example.com', 'admin123', 'admin'),
('Bob Membre', 'bob.membre@example.com', 'bob123', 'member'),
('Charlie Membre', 'charlie.membre@example.com', 'charlie123', 'member');

INSERT INTO categories (name) VALUES
('Informatique'),
('Littérature'),
('Science'),
('Histoire'),
('Développement personnel');

INSERT INTO books (title, author, ISBN, published_year, available, category_id) VALUES
('Clean Code', 'Robert C. Martin', TRUE, 1),
('The Pragmatic Programmer', 'Andrew Hunt, David Thomas', TRUE, 1),
('You Don\'t Know JS: Scope & Closures', 'Kyle Simpson', TRUE, 2),
('Eloquent JavaScript', 'Marijn Haverbeke',TRUE, 2),
('Design Patterns', 'Erich Gamma et al.', TRUE, 3),
('JavaScript: The Good Parts', 'Douglas Crockford', TRUE, 3),
('Refactoring', 'Martin Fowler', TRUE, 4),
('Laravel Up & Running', 'Matt Stauffer',TRUE, 4),
('Vue.js Up and Running', 'Callum Macrae',TRUE, 5),
('Node.js Design Patterns', 'Mario Casciaro', TRUE, 6);

INSERT INTO loans (book_id, member_id, date_borrowed, date_returned) VALUES
(1, 2, '2025-04-10', NULL),
(3, 3, '2025-04-01', '2025-04-15');
