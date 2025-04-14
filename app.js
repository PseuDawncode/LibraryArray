// Book Class: Represents a book
class Book{
    constructor(title, author, bookid){
        this.title = title;
        this.author = author;
        this.bookid = bookid;
        this.isRead = isReadd;
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
        <td>
            <button class="btn ${book.isRead ? 
                'btn-success' : 'btn-secondary'} 
                btn-sm read-status">
                ${book.isRead ? 'Read' : 'Unread'}
            </button>
        </td>
        <td><a href="#" class="btn btn-danger btn-sm 
        delete"></a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();

        }
    }

    static toggleReadStatus(el){
        if(el.classList.contains('read-status')){
            const bookId = el.parentElement.previousElementSibling.textContent;
            const isCurrentlyRead = el.classList.contains('btn-success');
            
            // Toggle the button appearance
            if(isCurrentlyRead){
                el.classList.replace('btn-success', 'btn-secondary');
                el.textContent = 'Unread';
            } else {
                el.classList.replace('btn-secondary', 'btn-success');
                el.textContent = 'Read';
            }
            
            // Update in storage
            Store.toggleReadStatus(bookId);
            
            // Show update message
            UI.showAlert('Book status updated', 'info');
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
    
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show remove message
    UI.showAlert('Book Removed', 'info');
});