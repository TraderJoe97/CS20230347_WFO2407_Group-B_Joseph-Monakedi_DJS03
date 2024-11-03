/**
 * A custom element that displays a preview of a book.
 *
 * @attr {string} title - The title of the book.
 * @attr {string} author - The author of the book.
 * @attr {string} image - The URL of the book's cover image.
 * @attr {string} id - The ID of the book.
 */
export class BookPreview extends HTMLElement {
    /**
     * The list of attributes that trigger an update of the component when changed.
     * @returns {string[]} The list of attributes that trigger an update of the component when changed.
     */
    static get observedAttributes() {
        return ['title', 'author', 'image', 'id'];
    }

    /**
     * The constructor of the component.
     */
    constructor() {
        super();
        // Attach a shadow DOM for encapsulation
        this.attachShadow({ mode: 'open' });
        
        // Component template
        this.shadowRoot.innerHTML = `
            <style>
                /* preview */

                .preview {
                border-width: 0;
                width: 100%;
                font-family: Roboto, sans-serif;
                padding: 0.5rem 1rem;
                display: flex;
                align-items: center;
                cursor: pointer;
                text-align: left;
                border-radius: 8px;
                border: 1px solid rgba(var(--color-dark), 0.15);
                background: rgba(var(--color-light), 1);
                }

                @media (min-width: 60rem) {
                .preview {
                    padding: 1rem;
                }
                }

                .preview_hidden {
                display: none;
                }

                .preview:hover {
                background: rgba(var(--color-blue), 0.05);
                }

                .preview__image {
                width: 48px;
                height: 70px;
                object-fit: cover;
                background: grey;
                border-radius: 2px;
                box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
                    0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
                }

                .preview__info {
                padding: 1rem;
                }

                .preview__title {
                margin: 0 0 0.5rem;
                font-weight: bold;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;  
                overflow: hidden;
                color: rgba(var(--color-dark), 0.8)
                }

                .preview__author {
                color: rgba(var(--color-dark), 0.4);
                }

            </style>
            <button class="preview">
                <img class="preview__image" src="" alt="Book Cover"/>
                <div class="preview__info">
                    <h3 class="preview__title"></h3>
                    <div class="preview__author"></div>
                </div>
            </button>
        `;
    }

    /**
     * The method that is called when the component is connected to the DOM.
     */
    connectedCallback() {
        this.updateComponent();
    }

    /**
     * The method that is called when an attribute of the component is changed.
     * @param {string} name - The name of the attribute that was changed.
     * @param {string} oldValue - The old value of the attribute.
     * @param {string} newValue - The new value of the attribute.
     */
    attributeChangedCallback() {
        this.updateComponent();
    }

    /**
     * The method that updates the component based on the current attributes.
     */
    updateComponent() {
        const title = this.getAttribute('title');
        const author = this.getAttribute('author');
        const image = this.getAttribute('image');
        
        this.shadowRoot.querySelector('.preview__title').textContent = title;
        this.shadowRoot.querySelector('.preview__author').textContent = author;
        this.shadowRoot.querySelector('.preview__image').src = image;
    }
}


