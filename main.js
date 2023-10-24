const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
 
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', function () {
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
        books.length = 0;
      for (const book of data) {
        books.push(book);
      }
      renderBooks();
    }
   
}


function generateId() {
    return +new Date();
}

function addBook(title, author, year, isComplete) {
    const id = generateId();
    const book = {
        id,
        title,
        author,
        year,
        isComplete
    };

    books.push(book);
    renderBooks();
    saveData();
}

function removeBook(bookId) {
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        const isConfirmed = window.confirm("Ingin menghapus buku ini?");
        if (isConfirmed) {
            books.splice(index, 1);
            renderBooks();
        }
    }
    saveData();
}

function moveBookToComplete(bookId) {
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books[index].isComplete = true;
        renderBooks();
    }
    saveData();
}

function moveBookToIncomplete(bookId) {
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books[index].isComplete = false;
        renderBooks();
    }
    saveData();
}

function makeBookElement(book) {
    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');

    const text = document.createElement('div');
    text.classList.add('text')

    const titleElement = document.createElement('h3');
    titleElement.innerText = book.title;

    const authorElement = document.createElement('p');
    authorElement.innerText = `Author: ${book.author}`;

    const yearElement = document.createElement('p');
    yearElement.innerText = `Tahun: ${book.year}`;

    text.append(titleElement,authorElement,yearElement)

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');


    const removeButton = document.createElement('button');
    removeButton.classList.add('trash-button')
    removeButton.addEventListener('click', () => removeBook(book.id));
    actionContainer.appendChild(removeButton);
    

    if (book.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.classList.add('green');
        undoButton.addEventListener('click', () => moveBookToIncomplete(book.id));
        actionContainer.appendChild(undoButton);
    } else {
        const completeButton = document.createElement('button');
        completeButton.classList.add('check-button');
        completeButton.classList.add('red');
        completeButton.addEventListener('click', () => moveBookToComplete(book.id));
        actionContainer.appendChild(completeButton);
    }

    bookItem.appendChild(text);
    bookItem.appendChild(actionContainer);

    return bookItem;
    
}

function renderBooks() {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    books.forEach(book => {
        const bookItem = makeBookElement(book);
        if (book.isComplete) {
            completeBookshelfList.appendChild(bookItem);
        } else {
            incompleteBookshelfList.appendChild(bookItem);
        }
    });
}

function performSearch(query) {
    const searchResultsList = document.getElementById('searchResultsList');
    searchResultsList.innerHTML = '';

    const lowerCaseQuery = query.toLowerCase();

    books.forEach(book => {
        if (book.title.toLowerCase().includes(lowerCaseQuery)) {
            const bookItem = makeBookElement(book);
            searchResultsList.appendChild(bookItem);
        }
    });
}

const submitBukuForm = document.getElementById('inputbuku');
submitBukuForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('tittle').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    addBook(title, author, year, isComplete);

    document.getElementById('tittle').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
    
});



const searchInput = document.getElementById('searchBookTitle');
searchInput.addEventListener('input', function (e) {
    const query = e.target.value;
    if (query) {
        document.getElementById('searchResults').style.display = 'block';
        performSearch(query);
    } else {
        document.getElementById('searchResults').style.display = 'none';
    }
});

const showSearchButton = document.getElementById('showSearchButton');


showSearchButton.addEventListener('click', function () {
    searchInput.style.display = 'inline';
    showSearchButton.style.display = 'none';

    searchInput.focus();
});


function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}
document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

renderBooks();

