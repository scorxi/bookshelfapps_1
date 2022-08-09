const books = []; // array to store book data
const RENDER_EVENT = 'render_page';

document.addEventListener('DOMContentLoaded', function () {
    const insertForm = document.getElementById('inputBook');
    insertForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBooks();
    })
})

function addBooks() {
    const textTitle = document.getElementById('bookTitle').value;
    const textAuthor = document.getElementById('bookAuthor').value;
    const yearBook = document.getElementById('yearPublished').value;

    const generatedId = generateId();

    const radioButtons = document.querySelectorAll('input[name="radioReadOption"]');
    let radioChecked;
    for (const radioBtn of radioButtons) {
        if (radioBtn.checked) {
            radioChecked = radioBtn.value;
        }
    }

    let bookObject;

    if (radioChecked == 'unfinishedBookOption') {
        bookObject = generateBookObject(generatedId, textTitle, textAuthor, yearBook, false);
    } else {
        bookObject = generateBookObject(generatedId, textTitle, textAuthor, yearBook, true);
    }
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isFinished) {
    return {
        id,
        title,
        author,
        year,
        isFinished
    }
};

document.addEventListener(RENDER_EVENT, function () {
    const unfinishedBooks = document.getElementById('unfinishedBooks');
    unfinishedBooks.innerHTML = "";

    const finishedBooks = document.getElementById('finishedBooks');
    finishedBooks.innerHTML = "";

    for (const bookItem of books) {
        const bookElements = makeBooks(bookItem);
        if (!bookItem.isFinished) {
            unfinishedBooks.append(bookElements);
        } else {
            finishedBooks.append(bookElements);
        }
    }
});

function makeBooks(bookObject) {
    const textBookTitle = document.createElement('h3');
    textBookTitle.innerText = bookObject.title;

    const textBookAuthor = document.createElement('p');
    textBookAuthor.innerText = `Author : ${bookObject.author}`;

    const textBookYear = document.createElement('p');
    textBookYear.innerText = `Year : ${bookObject.year}`;

    const container = document.createElement('article');
    container.classList.add('bookItem');
    container.setAttribute('id', `book-${bookObject.id}`);
    container.append(textBookTitle, textBookAuthor, textBookYear);

    // lanjutin function ini
    // buat function moveBookToFinished.

    return container;
}