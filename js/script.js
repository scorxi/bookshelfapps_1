const books = []; // array to store book data
const RENDER_EVENT = 'render_page';

document.addEventListener('DOMContentLoaded', function () {
    const insertForm = document.getElementById('inputBook');
    insertForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBooks();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }


    const btnResetData = document.getElementById('resetBtn');
    btnResetData.addEventListener('click', function () {
        Swal.fire({
            title: `Remove All Books`,
            text: "Are you sure to remove all books?",
            icon: 'warning',
            confirmButtonText: 'Yes, Remove All!',
            confirmButtonColor: '#2C3333',
            showCancelButton: true,
            cancelButtonColor: '#395B64'
        }).then((result) => {
            if (result.isConfirmed) {
                removeAllBooks();
            }
        });
    })
});

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
    } else if (radioChecked == 'finishedBookOption') {
        bookObject = generateBookObject(generatedId, textTitle, textAuthor, yearBook, true);
    } else {
        Swal.fire({
            title: 'Oops, Somethin isn\'t quite right.',
            text: 'You may need to check if the book is Finished or Unifinshed.',
            icon: 'info',
            confirmButtonText: "OK"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        })
    }
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function generateId() {
    return +new Date();
};

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
            unfinishedBooks.append(bookElements)
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

    if (bookObject.isFinished) {
        const moveToUnfinishedBtn = document.createElement('button');
        moveToUnfinishedBtn.classList.add('moveToUnfinishedBtn');
        moveToUnfinishedBtn.innerText = "Move to Unfinished Reading";

        moveToUnfinishedBtn.addEventListener('click', function () {
            moveBookToUnfinished(bookObject.id);
        });

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('removeBtn');
        removeBtn.innerText = "Remove Book";

        removeBtn.addEventListener('click', function () {
            const bookTitle = bookObject.title;
            Swal.fire({
                title: `Delete ${bookTitle}?`,
                text: "You won't be able to revert this.",
                icon: 'warning',
                confirmButtonText: 'Delete Book',
                confirmButtonColor: '#2C3333',
                showCancelButton: true,
                cancelButtonColor: '#395B64'
            }).then((result) => {
                if (result.isConfirmed) {
                    removeBook(bookObject.id);
                    Swal.fire(
                        "Deleted",
                        `Book ${bookTitle} has been removed`,
                        'success'

                    )
                }
            });
        });

        container.append(moveToUnfinishedBtn, removeBtn);
    } else {
        const moveToFinishedBtn = document.createElement('button');
        moveToFinishedBtn.classList.add('moveToFinishedBtn');
        moveToFinishedBtn.innerText = "Move To Finished Reading";

        moveToFinishedBtn.addEventListener('click', function () {
            moveBookToFinished(bookObject.id);
        });

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('removeBtn');
        removeBtn.innerText = "Remove Book";

        removeBtn.addEventListener('click', function () {
            const bookTitle = bookObject.title;
            Swal.fire({
                title: `Delete ${bookTitle}?`,
                text: "You won't be able to revert this.",
                icon: 'warning',
                confirmButtonText: 'Delete Book',
                confirmButtonColor: '#2C3333',
                showCancelButton: true,
                cancelButtonColor: '#395B64'
            }).then((result) => {
                if (result.isConfirmed) {
                    removeBook(bookObject.id);
                    Swal.fire(
                        "Deleted",
                        `Book ${bookTitle} has been removed`,
                        'success'

                    )
                }
            });
        });

        container.append(moveToFinishedBtn, removeBtn);
    }

    return container;
};

const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', function (event) {
    const searchBar = document.querySelector('input[name="searchBar"]');
    const valueSearch = searchBar.value;
    const bookItems = document.querySelectorAll('article h3');

    for (const book of bookItems) {
        if (book.innerText.toLowerCase().includes(valueSearch.toLowerCase())) {
            book.parentElement.style.display = "block";
        } else {
            book.parentElement.style.display = "none";
        }
    }
    event.preventDefault();
})

function removeBook(bookId) {
    const itemTarget = findBookIndex(bookId)

    if (itemTarget === -1) {
        return;
    }

    books.splice(itemTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id == bookId) {
            return index;
        }
    }

    return -1 // elemen yang dicari adalah index - 1
};

function removeAllBooks() {
    const collectionOfData = localStorage.getItem('STORAGE_KEY');
    let data = JSON.parse(collectionOfData);
    const bookData = books;

    if (bookData.length == 0) {
        Swal.fire(
            "No Book Deleted",
            "You need to add at least one book to the shelf",
            'info'
        )
    } else if (data !== null) {
        for (const book of data) {
            books.pop(book);
            Swal.fire(
                "Deleted",
                `All Books has been removed`,
                'success'

            )
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function moveBookToFinished(bookId) {
    const itemTarget = findBook(bookId);

    if (itemTarget == null) {
        return;
    }

    itemTarget.isFinished = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
};

function moveBookToUnfinished(bookId) {
    const itemTarget = findBook(bookId);

    if (itemTarget == null) {
        return;
    }

    itemTarget.isFinished = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
};

const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BookShelf_Apps';

function isStorageExist() {
    if (typeof (Storage) === 'undefined') {
        alert("Oops, Your browser doesn't support web storage.");
        return false;
    }
    return true;
};

document.addEventListener('SAVED_EVENT', function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function saveData() {
    if (isStorageExist()) {
        const jsParsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, jsParsed);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
};

function loadDataFromStorage() {
    const collectionOfData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(collectionOfData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
};