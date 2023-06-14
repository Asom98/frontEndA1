export async function loadStorePage() {
    let books = await (await fetch('/public/books.json')).json();
    let html = books.map(b => `
      <div class="col-150 col-md-60 col-lg-40" id="product-container">
        <div class="card">
          <div id="card-img-container" class="card-img-container">
            <img src="${b.url}" class="card-img-right rounded" alt="${b.title}">
          </div>
          <div class="card-body">
            <h5 class="card-title">${b.title}</h5>
            <p class="card-author">${b.author}</p>
            <button class="accordion">Description</button>
            <div class="panel">
              <p class="card-desc">${b.description}</p>
            </div>
            <a href="#" data-book='${JSON.stringify({
              ...b, description: undefined,
            })}' class="btn btn-primary add-to-cart-btn" id="btn-add-to-cart">Add to cart</a>
            <p class="card-price">${b.price} $</p> 
          </div>
        </div>
      </div>
    `).join('');
    document.querySelector('#content').innerHTML = html;
  
    // Accordion, opted out of using bootstrap for this. JS is just less of a hassle.
    var acc = document.getElementsByClassName("accordion");
    var i;
  
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("accordion-active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  
    // Attach event listeners to Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const bookData = btn.dataset.book;
        console.log('Parsing book data:', bookData);
        const book = JSON.parse(bookData);
        addToCart(book);
      });
    });
  }
  
  export let cart = [];
  function addToCart(book) {
    cart.push(book);
    console.log(`Added book "${book.title}" to cart`);
    console.log(cart);
  }