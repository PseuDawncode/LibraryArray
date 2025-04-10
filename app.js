// Book Class: Represents a book
class Book{
    constructor(title, author, bookid){
        this.title = title;
        this.author = author;
        this.bookid = bookid;

    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks(){
        const StoredBooks = [
            {
                title: 'Book One',
                author: 'David W.',
                bookid: '0230027'
            },
            {
                title: 'Book Two',
                author: 'Juno The Cat',
                bookid: '0230029'
            }
        ];

        const books = StoredBooks;

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.bookid}</td>
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

    //Clear Fields functionality
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#bookid').value = '';
    }
}

// Store Class: Handles Storage

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
        alert('Please fill in all fields');
    } else {
        //Instatiate book
        const book = new Book(title, author, bookid);

        // Add book to UI
        UI.addBookToList(book);

        //Clear Fields
        UI.clearFields();
    }


});

// Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target)
});