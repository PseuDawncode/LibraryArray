// Function to handle More Actions menu
function handleMoreActions(action) {
    switch (action) {
        case 'show-all':
            displayBooksModal(Store.getBooks(), "All Books");
            break;
        case 'show-read':
            displayBooksModal(Store.getBooks().filter(book => book.isRead), "Read Books");
            break;
        case 'show-unread':
            displayBooksModal(Store.getBooks().filter(book => !book.isRead), "Unread Books");
            break;
        case 'exit':
            break;
    }
}

// Function to display books in a modal
function displayBooksModal(books, title) {
    if (books.length === 0) {
        UI.showAlert(`No ${title.toLowerCase()} to display.`, 'info');
        return;
    }

    let bookList = '';
    books.forEach(book => {
        bookList += `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.bookid}</td>
                <td>${book.isRead ? 'Read' : 'Unread'}</td>
            </tr>
        `;
    });

    // Showing All Books Modal in HTML
    const modalHTML = `
        <div class="modal fade" id="booksModal" tabindex="-1" aria-labelledby="booksModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="booksModalLabel">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Book ID</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>${bookList}</tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add the modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize and show the modal
    const modalElement = document.getElementById('booksModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    modalElement.addEventListener('hidden.bs.modal', function () {
        modalElement.remove();
    });
}

// Add the "More Actions" button
function addMoreActionsButton() {

    const container = document.querySelector('.container');
    const heading = container.querySelector('h1') || container.firstElementChild;
    
    // Dropdown button container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'moreActionsContainer';
    buttonContainer.className = 'mb-3 d-flex justify-content-end';
    buttonContainer.innerHTML = `
        <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" id="moreActionsButton" data-bs-toggle="dropdown" aria-expanded="false">
                More Actions
            </button>
            <ul class="dropdown-menu" aria-labelledby="moreActionsButton">
                <li><a class="dropdown-item" href="#" data-action="show-all">Show All Books</a></li>
                <li><a class="dropdown-item" href="#" data-action="show-read">Show All Read Books</a></li>
                <li><a class="dropdown-item" href="#" data-action="show-unread">Show All Unread Books</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" data-action="exit">Exit</a></li>
            </ul>
        </div>
    `;
    
    heading.insertAdjacentElement('afterend', buttonContainer);
    
    // Event: Dropdown items
    const dropdownItems = buttonContainer.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('data-action');
            handleMoreActions(action);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    addMoreActionsButton();
});


class Book{
    constructor(title, author, bookid, isRead = false){
        this.title = title;
        this.author = author;
        this.bookid = bookid;
        this.isRead = isRead;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.bookid}</td>
        <td><input type="checkbox" class="form-check-input read-toggle" 
         data-id="${book.bookid}" ${book.isRead ? 'checked' : ''}></td>
        <td><a href="#" class="delete btn btn-danger btn-sm 
        "></a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();

        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(),
        3000);
    }

    //Clear Fields functionality
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#bookid').value = '';
    }
}

// Store Class: Handles Storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(bookid){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.bookid === bookid){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent actual submit
    e.preventDefault();

    //Get form values
    const title = document.querySelector('#title').value;
    const author= document.querySelector('#author').value;
    const bookid = document.querySelector('#bookid').value;

    //Validate
    if(title === '' || author === '' || bookid === ''){
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        //Instatiate book
        const book = new Book(title, author, bookid);

        // Add book to UI
        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);

        // Show success message
        UI.showAlert('Book Added', 'success');

        //Clear Fields
        UI.clearFields();
    }


});

// Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {

    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.parentElement.querySelector('td:nth-child(3)').textContent);

    // Show remove message
    UI.showAlert('Book Removed', 'info');
    }
});

// Event: Toggle read status
document.querySelector('#book-list').addEventListener('change', (e) => {
    if (e.target.classList.contains('read-toggle')) {
        const bookid = e.target.getAttribute('data-id');

        const books = Store.getBooks();
        books.forEach(book => {
            if (book.bookid === bookid) {
                book.isRead = e.target.checked;
            }
        });

        localStorage.setItem('books', JSON.stringify(books));

        UI.showAlert(`Marked as ${e.target.checked ? 'Read' : 'Unread'}`, 'secondary');
    }
});