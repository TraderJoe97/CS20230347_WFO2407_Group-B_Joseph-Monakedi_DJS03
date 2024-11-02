import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

let page = 1;
let matches = [...books];

/**
 * Creates a book element as a button with preview information.
 * 
 * @param {Object} book - The book object containing book details.
 * @param {string} book.author - The ID of the book's author.
 * @param {string} book.id - The unique identifier of the book.
 * @param {string} book.image - The URL of the book's cover image.
 * @param {string} book.title - The title of the book.
 * @returns {HTMLElement} A button element representing the book preview.
 */
const createBookElement = (book) => {
    const { author, id, image, title } = book;
    const bookElement = document.createElement('button');
    bookElement.classList = 'preview';
    bookElement.setAttribute('data-preview', id);

    bookElement.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;
    return bookElement;
};

/**
 * Appends a list of book preview elements to the list element.
 *
 * @param {Object[]} books - The books to display. Each book object should contain the
 *     following properties: author, id, image, title.
 * @returns {undefined}
 */
const displayBooks = (books) => {
    const fragment = document.createDocumentFragment();
    books.forEach(book => fragment.appendChild(createBookElement(book)));
    document.querySelector('[data-list-items]').appendChild(fragment);
};

/**
 * Populate a dropdown element with option elements based on key-value pairs.
 *
 * @param {Object} items - The key-value pairs to populate the dropdown with.
 * @param {string} elementSelector - The selector for the dropdown element to populate.
 * @param {string} defaultOption - The text to use for the default option element.
 * @returns {undefined}
 */
const populateDropdown = (items, elementSelector, defaultOption) => {
    const fragment = document.createDocumentFragment();
    const defaultElement = document.createElement('option');
    defaultElement.value = 'any';
    defaultElement.innerText = defaultOption;
    fragment.appendChild(defaultElement);

    for (const [id, name] of Object.entries(items)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        fragment.appendChild(element);
    }

    document.querySelector(elementSelector).appendChild(fragment);
};

const updateTheme = (theme) => {
    const darkColors = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
    const lightColors = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
    document.documentElement.style.setProperty('--color-dark', darkColors);
    document.documentElement.style.setProperty('--color-light', lightColors);
};

const initializeTheme = () => {
    const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
    document.querySelector('[data-settings-theme]').value = theme;
    updateTheme(theme);
};

/**
 * Sets up event listeners for various UI components in the application.
 *
 * - Handles opening and closing of search and settings overlays.
 * - Manages form submissions for search and settings, updating results and theme.
 * - Adds functionality to the "Show More" button for paginated book lists.
 * - Enables book preview display when a book item is clicked.
 * @returns {undefined}
 */
const setUpEventListeners = () => {

    // Search button in header
    document.querySelector('[data-header-search]').addEventListener('click', () => {
        // Open search overlay
        document.querySelector('[data-search-overlay]').open = true;
        // Focus title input field
        document.querySelector('[data-search-title]').focus();
    });

    // Cancel search button
    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        // Close search overlay
        document.querySelector('[data-search-overlay]').open = false;
    });

    // Settings button in header
    document.querySelector('[data-header-settings]').addEventListener('click', () => {
        // Open settings overlay
        document.querySelector('[data-settings-overlay]').open = true;
    });

    // Cancel settings button
    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        // Close settings overlay
        document.querySelector('[data-settings-overlay]').open = false;
    });

    // Close button in list overlay
    document.querySelector('[data-list-close]').addEventListener('click', () => {
        // Close list overlay
        document.querySelector('[data-list-active]').open = false;
    });

    // Settings form submission
    document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
        // Prevent default form submission
        event.preventDefault();
        // Get form data
        const formData = new FormData(event.target);
        // Extract theme value from form data
        const { theme } = Object.fromEntries(formData);
        // Update theme
        updateTheme(theme);
        // Close settings overlay
        document.querySelector('[data-settings-overlay]').open = false;
    });

    // Search form submission
    document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
        // Prevent default form submission
        event.preventDefault();
        // Get form data
        const formData = new FormData(event.target);
        // Extract filters from form data
        const filters = Object.fromEntries(formData);
        // Filter books based on filters
        const result = books.filter(book => {
            // Check if genre matches filter or if filter is 'any'
            const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
            // Check if title matches filter or if filter is empty
            const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
            // Check if author matches filter or if filter is 'any'
            const authorMatch = filters.author === 'any' || book.author === filters.author;
            // Return true if all filters match
            return (
                titleMatch && authorMatch && genreMatch
            );
        });

        // Update page number to 1
        page = 1;
        // Update matches with filtered books
        matches = result;
        // Show message if no matches found
        document.querySelector('[data-list-message]').classList.toggle('list__message_show', result.length < 1);
        // Clear list items
        document.querySelector('[data-list-items]').innerHTML = '';
        // Add first page of filtered books to list
        displayBooks(matches.slice(0, BOOKS_PER_PAGE));
        // Update show more button
        document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1;
        document.querySelector('[data-list-button]').innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE))})</span>
        `;
        // Scroll to top
        window.scrollTo({top: 0, behavior: 'smooth'});
        // Close search overlay
        document.querySelector('[data-search-overlay]').open = false;
    });

    // Show more button
    document.querySelector('[data-list-button]').addEventListener('click', () => {
        // Add next page of books to list
        displayBooks(matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE));
        // Update page number
        page += 1;
    });

    // List items
    document.querySelector('[data-list-items]').addEventListener('click', (event) => {
        // Get path array from event
        const pathArray = Array.from(event.composedPath());
        // Get id of book that was clicked
        const active = pathArray.find(node => node?.dataset?.preview)?.dataset?.preview;

        if (active) {
            // Get book from id
            const book = books.find(singleBook => singleBook.id === active);
            if (book) {
                // Open list overlay
                document.querySelector('[data-list-active]').open = true;
                // Set image sources
                document.querySelector('[data-list-blur]').src = book.image;
                document.querySelector('[data-list-image]').src = book.image;
                // Set title and subtitle
                document.querySelector('[data-list-title]').innerText = book.title;
                document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
                // Set description
                document.querySelector('[data-list-description]').innerText = book.description;
            }
        }
    });
};

// Initialize the application
displayBooks(matches.slice(0, BOOKS_PER_PAGE));
populateDropdown(genres, '[data-search-genres]', 'All Genres');
populateDropdown(authors, '[data-search-authors]', 'All Authors');
initializeTheme();
setUpEventListeners();
document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) <= 0;
