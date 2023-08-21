import { loadDetailsPage } from "./main";

let allBooks; 
let booksAddedToCart = [];

const $ = el => document.querySelector(el);

export async function getBooks() {
  allBooks = await fetchJSON('./books.json');
  return allBooks;
}

export function getBook(id) {
  const book = allBooks.find(book => book.id === id);
  return book;
}

function bookDetails(id) {
  const href = `book?id=${id}`;
  history.pushState(null, null, href);
  loadDetailsPage(id);
}

function addToCart(book) {
  const bookIndex = booksAddedToCart.findIndex((cartBook) => cartBook.id === book.id);

  if (bookIndex > -1) {
    booksAddedToCart[bookIndex].quantity += 1;
    booksAddedToCart[bookIndex].total += book.price;
  } else {
    booksAddedToCart.push({ id: book.id, quantity: 1, total: book.price, book: book });
  }
}

function removeFromCart(id) {
  const index = booksAddedToCart.findIndex((cartBook) => cartBook.id === id);

  if (index > -1) {
    if (booksAddedToCart[index].quantity > 1) {
      booksAddedToCart[index].quantity -= 1;
      booksAddedToCart[index].total -= booksAddedToCart[index].book.price;
    } else {
      booksAddedToCart.splice(index, 1);8
    }
  }

  displayCart();
}

export function displayBooks(books) {
    const bookList = document.querySelector('#book-list');
    bookList.innerHTML = '';
  
    books.forEach(book => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';
  
      card.innerHTML = `
        <div class="card h-100">
          <img class="card-img-top book-card-img" src="${book.url}" alt="${book.title}">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">${book.author}</p>
          </div>
          <div class="card-footer">
            <p class="card-text"><b>${book.price} SEK</b></p>
            <button class="btn btn-danger btn-block atc-btn" data-book-id="${book.id}">Add to Cart</button>
          </div>
        </div>
      `;
  
      card.addEventListener('click', () => bookDetails(book.id));
  
      const addToCartBtn = card.querySelector('.atc-btn');
      addToCartBtn.addEventListener('click', event => {
        event.stopPropagation();
        addToCart(book);
      });
  
      bookList.appendChild(card);
    });
}

export function displayBooksDetails(book) {
  document.getElementById("url").src = book.url;
  document.getElementById("title").textContent = book.title;
  document.getElementById("author").textContent = book.author;
  document.getElementById("category").textContent = book.category;
  document.getElementById("description").textContent = book.description;
  document.getElementById("price").textContent = `${book.price} SEK`;
  const atcBtn = document.getElementById('add-to-cart-btn');
  atcBtn.addEventListener('click', () => {
    addToCart(book);
  });
}

export function displayCart() {
  const cartList = $('#cart-list');
  cartList.innerHTML = '';
  for (let addedBook of booksAddedToCart) {
    const cartItem = document.createElement('tr');
    cartItem.className = 'cart-book';
    cartItem.innerHTML = `
      <td>${addedBook.book.title}</td>
      <td><button class="btn btn-danger btn-sm remove-item">Remove</button></td>
      <td>${addedBook.quantity}</td>
      <td>${addedBook.book.price} SEK</td>
      <td>${addedBook.total} SEK</td>
    ` ;
    const removeBtn = cartItem.querySelector('.remove-item');
    removeBtn.addEventListener('click', () => {
      removeFromCart(addedBook.id);
    });
    cartList.appendChild(cartItem);
  }
  const total = booksAddedToCart.reduce((acc, book) => acc + book.total, 0);
  const cartTotal = document.getElementById("cart-total");
  cartTotal.innerHTML = `<b>${total} SEK</b>`;
}

async function fetchJSON(url) {
    let data = await fetch(url);
    let dataJ = await data.json();
    return dataJ;
}