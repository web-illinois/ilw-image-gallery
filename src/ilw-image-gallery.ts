import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
// @ts-ignore
import styles from "./ilw-image-gallery.styles.css?inline";
import "./ilw-image-gallery.css";
import "@illinois-toolkit/ilw-card";
import "@illinois-toolkit/ilw-card/ilw-card.css";
import "@illinois-toolkit/ilw-grid";
import "@illinois-toolkit/ilw-grid/ilw-grid.css";
import "@illinois-toolkit/ilw-modal";
import "@illinois-toolkit/ilw-modal/ilw-modal.css";

type GalleryModal = HTMLElement & { open: boolean };

interface GalleryImage {
    src: string;
    alt: string;
    caption: string;
}

let galleryId = 0;

@customElement("ilw-image-gallery")
export default class ImageGallery extends LitElement {
    @property({ type: String })
    theme = "";

    @property({ type: String })
    label = "Image gallery";

    @state()
    private currentIndex = -1;

    private readonly modalId = `ilw-image-gallery-modal-${++galleryId}`;

    static override get styles() {
        return unsafeCSS(styles);
    }

    override connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener("keydown", this.handleKeydown, true);
    }

    override disconnectedCallback(): void {
        document.removeEventListener("keydown", this.handleKeydown, true);
        super.disconnectedCallback();
    }

    private get items(): HTMLAnchorElement[] {
        return Array.from(this.querySelectorAll<HTMLAnchorElement>("a[data-gallery-item]"));
    }

    private get modal(): GalleryModal | null {
        return this.shadowRoot?.querySelector<GalleryModal>("ilw-modal") ?? null;
    }

    private imageAt(index: number): GalleryImage | null {
        const item = this.items[index];
        if (!item) return null;

        const thumbnail = item.querySelector<HTMLImageElement>("img");
        const caption =
            item.dataset.galleryCaption?.trim() ||
            item.querySelector("ilw-card")?.textContent?.trim() ||
            "";

        return {
            src: item.href,
            alt: item.dataset.galleryAlt?.trim() || thumbnail?.alt.trim() || caption,
            caption,
        };
    }

    private itemFromEvent(event: Event): HTMLAnchorElement | null {
        return event.composedPath().find(
            (node): node is HTMLAnchorElement =>
                node instanceof HTMLAnchorElement && node.matches("[data-gallery-item]"),
        ) ?? null;
    }

    private handleClick(event: MouseEvent): void {
        const item = this.itemFromEvent(event);
        if (
            !item || event.defaultPrevented || event.button !== 0 || event.metaKey ||
            event.ctrlKey || event.shiftKey || event.altKey
        ) return;

        const index = this.items.indexOf(item);
        if (index === -1) return;

        event.preventDefault();
        this.currentIndex = index;

        // ilw-modal uses this attribute to open and remember the trigger so it
        // can restore focus when the dialog closes.
        item.dataset.modalTarget = this.modalId;
    }

    private handleKeydown = (event: KeyboardEvent): void => {
        if (
            !this.modal?.open || event.defaultPrevented || event.altKey ||
            event.ctrlKey || event.metaKey
        ) return;

        const target = event.target;
        if (target instanceof Element && target.matches("input, textarea, select, [contenteditable]")) return;

        if (event.key === "Tab") {
            this.moveFocus(event);
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            this.previous();
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            this.next();
        }
    };

    private moveFocus(event: KeyboardEvent): void {
        const controls = Array.from(
            this.shadowRoot?.querySelectorAll<HTMLButtonElement>(".gallery-controls button") ?? [],
        ).filter((button) => !button.disabled);
        const closeButton = this.modal?.shadowRoot?.querySelector<HTMLButtonElement>(".close-btn");
        const focusable = closeButton ? [...controls, closeButton] : controls;
        if (!focusable.length) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        let activeElement: Element | null = document.activeElement;
        while (activeElement?.shadowRoot?.activeElement) {
            activeElement = activeElement.shadowRoot.activeElement;
        }

        const currentIndex = focusable.indexOf(activeElement as HTMLButtonElement);
        const nextIndex = event.shiftKey
            ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
            : (currentIndex + 1) % focusable.length;
        focusable[nextIndex].focus();
    }

    public previous(): void {
        this.move(-1);
    }

    public next(): void {
        this.move(1);
    }

    private move(change: number): void {
        const count = this.items.length;
        if (!count || this.currentIndex < 0) return;

        const nextIndex = this.currentIndex + change;
        if (nextIndex < 0 || nextIndex >= count) return;

        this.currentIndex = nextIndex;
    }

    protected override render() {
        const count = this.items.length;
        const image = this.imageAt(this.currentIndex);
        const atStart = this.currentIndex <= 0;
        const atEnd = this.currentIndex >= count - 1;

        return html`
            <div class="gallery" role="region" aria-label=${this.label} @click=${this.handleClick}>
                <slot></slot>
            </div>

            <ilw-modal id=${this.modalId} size="large" class="gallery-modal">
                ${image ? html`
                    <figure class="gallery-figure" slot="image">
                        <img class="gallery-image" src=${image.src} alt=${image.alt} />
                        ${image.caption
                            ? html`<figcaption>${image.caption}</figcaption>`
                            : null}
                    </figure>
                    <h2 class="visually-hidden" slot="title">${this.label}</h2>
                ` : null}

                <div class="gallery-controls">
                    <button type="button" class="ilw-button" @click=${this.previous}
                        ?disabled=${atStart} aria-label="Previous image">
                        Previous
                    </button>
                    <p class="gallery-position" aria-live="polite" aria-atomic="true">
                        ${this.currentIndex >= 0 ? `Image ${this.currentIndex + 1} of ${count}` : ""}
                    </p>
                    <button type="button" class="ilw-button" @click=${this.next}
                        ?disabled=${atEnd} aria-label="Next image">
                        Next
                    </button>
                </div>
            </ilw-modal>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-image-gallery": ImageGallery;
    }
}
