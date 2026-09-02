import { LitElement, html, unsafeCSS } from "lit";
// @ts-ignore
import styles from './ilw-image-gallery.styles.css?inline';
import './ilw-image-gallery.css';
import { customElement, property } from "lit/decorators.js";

@customElement("ilw-image-gallery")
export default class ImageGallery extends LitElement {

    @property()
    theme = "";

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <div>
                <slot></slot>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-image-gallery": ImageGallery;
    }
}
