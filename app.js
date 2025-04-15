/**function showMenu() {
    let choice;
    do {
        choice = prompt(
            "📚 Book Menu:\n" +
            "1. Show all books\n" +
            "2. Show read books\n" +
            "3. Show unread books\n" +
            "4. Exit\n\n" +
            "Enter your choice (1-4):"
        );

        switch (choice) {
            case '1':
                displayBooksAlert(Store.getBooks(), "All Books");
                break;
            case '2':
                displayBooksAlert(Store.getBooks().filter(book => book.isRead), "Read Books");
                break;
            case '3':
                displayBooksAlert(Store.getBooks().filter(book => !book.isRead), "Unread Books");
                break;
            case '4':
                alert("Goodbye! 👋");
                break;
            default:
                alert("Invalid choice. Please enter a number from 1 to 4.");
        }
    } while (choice !== '4');
}

function displayBooksAlert(books, title) {
    if (books.length === 0) {
        alert(`No ${title.toLowerCase()} to display.`);
        return;
    }

    let message = `${title}:\n\n`;
    books.forEach((book, index) => {
        message += `${index + 1}. ${book.title} by ${book.author} (ID: ${book.bookid})\n`;
    });

    alert(message);
}**/



// Book Class: Represents a book
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

