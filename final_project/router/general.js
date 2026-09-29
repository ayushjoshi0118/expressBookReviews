const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new customer
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1 & Task 10: Get the book list available in the shop using Promise callback / async-await
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject({ status: 500, message: "Error retrieving books" });
    }
  });

  getBooks
    .then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      return res.status(error.status || 500).json({ message: error.message });
    });
});

// Task 2 & Task 11: Get book details based on ISBN using Promise callback / async-await
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      return res.status(error.status || 500).json({ message: error.message });
    });
});

// Task 3 & Task 12: Get book details based on author using Promise callback / async-await
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let matchingBooks = [];
    const keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: `No books found by author: ${author}` });
    }
  });

  getBooksByAuthor
    .then((matchingBooks) => {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    })
    .catch((error) => {
      return res.status(error.status || 500).json({ message: error.message });
    });
});

// Task 4 & Task 13: Get all books based on title using Promise callback / async-await
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    let matchingBooks = [];
    const keys = Object.keys(books);
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: `No books found with title: ${title}` });
    }
  });

  getBooksByTitle
    .then((matchingBooks) => {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    })
    .catch((error) => {
      return res.status(error.status || 500).json({ message: error.message });
    });
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

/*
  ========================================================================
  Tasks 10 - 13: Functions implementing Axios with Promises and Async/Await
  ========================================================================
*/
const BASE_URL = 'http://localhost:5000';

// Task 10: Code to retrieve all books using async/await with Axios
const getAllBooksAsync = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log("Task 10 - All Books:", response.data);
    return response.data;
  } catch (error) {
    console.error("Task 10 Error fetching all books:", error.message);
    throw error;
  }
};

// Task 11: Code to retrieve book details based on ISBN using Promises with Axios
const getBookByISBNPromise = (isbn) => {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      console.log(`Task 11 - Book details for ISBN ${isbn}:`, response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(`Task 11 Error fetching book by ISBN ${isbn}:`, error.message);
      throw error;
    });
};

// Task 12: Code to retrieve book details based on Author using async/await with Axios
const getBookByAuthorAsync = async (author) => {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(`Task 12 - Books by Author ${author}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Task 12 Error fetching books by Author ${author}:`, error.message);
    throw error;
  }
};

// Task 13: Code to retrieve book details based on Title using async/await with Axios
const getBookByTitleAsync = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    console.log(`Task 13 - Books with Title ${title}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Task 13 Error fetching books by Title ${title}:`, error.message);
    throw error;
  }
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNPromise = getBookByISBNPromise;
module.exports.getBookByAuthorAsync = getBookByAuthorAsync;
module.exports.getBookByTitleAsync = getBookByTitleAsync;
