import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-lit";
import { html, nothing } from "lit";
import "../src/ilw-image-gallery";
import type ImageGallery from "../src/ilw-image-gallery";

const galleryMarkup = (caption = false) => html`
    <ilw-image-gallery label="Test gallery" caption=${caption ? "true" : nothing}>
        <a data-gallery-item href="/large-one.jpg"
            data-gallery-alt="First image alt" data-gallery-caption="First caption">
            <ilw-card>
                <img slot="image" src="/thumb-one.jpg" alt="" />
                <p>First caption</p>
            </ilw-card>
        </a>
        <a data-gallery-item href="/large-two.jpg"
            data-gallery-alt="Second image alt" data-gallery-caption="Second caption">
            <ilw-card>
                <img slot="image" src="/thumb-two.jpg" alt="" />
                <p>Second caption</p>
            </ilw-card>
        </a>
    </ilw-image-gallery>
`;

const deepestActiveElement = (): Element | null => {
    let activeElement: Element | null = document.activeElement;
    while (activeElement?.shadowRoot?.activeElement) {
        activeElement = activeElement.shadowRoot.activeElement;
    }
    return activeElement;
};

describe("ilw-image-gallery", () => {
    test("hides thumbnail captions by default but keeps them in the modal", async () => {
        const { container } = await render(galleryMarkup());
        const gallery = container.querySelector("ilw-image-gallery") as ImageGallery;
        const thumbnailCaption = gallery.querySelector("ilw-card")?.querySelector("p");

        await expect.poll(
            () => getComputedStyle(thumbnailCaption as HTMLParagraphElement).display,
        ).toBe("none");

        (gallery.querySelector("a") as HTMLAnchorElement).click();
        await gallery.updateComplete;

        expect(gallery.shadowRoot?.querySelector("figcaption")?.textContent).toBe("First caption");
    });

    test('shows thumbnail captions when caption="true"', async () => {
        const { container } = await render(galleryMarkup(true));
        const gallery = container.querySelector("ilw-image-gallery") as ImageGallery;
        const thumbnailCaption = gallery.querySelector("ilw-card")?.querySelector("p");

        expect(getComputedStyle(thumbnailCaption as HTMLParagraphElement).display).not.toBe("none");

        (gallery.querySelector("a") as HTMLAnchorElement).click();
        await gallery.updateComplete;

        expect(gallery.shadowRoot?.querySelector("figcaption")?.textContent).toBe("First caption");
    });

    test("makes captioned cards in the same desktop grid row equal height", async () => {
        const { container } = await render(html`
            <ilw-image-gallery caption="true" style="display: block; width: 900px;">
                <ilw-grid padding="0">
                    <a data-gallery-item href="/large-one.jpg">
                        <ilw-card aspectratio="16/10">
                            <img slot="image" src="/thumb-one.jpg" alt="" />
                            <p>A caption long enough to wrap onto several lines in this card.</p>
                        </ilw-card>
                    </a>
                    <a data-gallery-item href="/large-two.jpg">
                        <ilw-card aspectratio="16/10">
                            <img slot="image" src="/thumb-two.jpg" alt="" />
                            <p>Short caption.</p>
                        </ilw-card>
                    </a>
                    <a data-gallery-item href="/large-three.jpg">
                        <ilw-card aspectratio="16/10">
                            <img slot="image" src="/thumb-three.jpg" alt="" />
                            <p>Another short caption.</p>
                        </ilw-card>
                    </a>
                </ilw-grid>
            </ilw-image-gallery>
        `);
        const cards = Array.from(container.querySelectorAll<HTMLElement>("ilw-card"));

        await expect.poll(() => cards.map((card) => card.getBoundingClientRect().height))
            .toSatisfy((heights: number[]) => new Set(heights).size === 1);
    });

    test('hides card borders when no-border="true" on the blue theme', async () => {
        const { container } = await render(html`
            <ilw-image-gallery theme="blue" no-border="true">
                <a data-gallery-item href="/large-one.jpg">
                    <ilw-card>
                        <img slot="image" src="/thumb-one.jpg" alt="First image" />
                    </ilw-card>
                </a>
            </ilw-image-gallery>
        `);
        const card = container.querySelector("ilw-card") as HTMLElement;

        expect(getComputedStyle(card).borderTopWidth).toBe("0px");
    });

    test("opens the selected image in its modal", async () => {
        const { container } = await render(galleryMarkup());
        const gallery = container.querySelector("ilw-image-gallery") as ImageGallery;
        (gallery.querySelector("a") as HTMLAnchorElement).click();
        await gallery.updateComplete;

        const modal = gallery.shadowRoot?.querySelector("ilw-modal") as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        await modal.updateComplete;
        const image = gallery.shadowRoot?.querySelector(".gallery-image") as HTMLImageElement;
        expect(modal.hasAttribute("open")).toBe(true);
        expect(image.src).toContain("/large-one.jpg");
        expect(image.alt).toBe("First image alt");
        expect(gallery.shadowRoot?.querySelector("figure")).toBeTruthy();
        expect(gallery.shadowRoot?.querySelector("figcaption")?.textContent).toBe("First caption");
        expect(gallery.shadowRoot?.textContent).toContain("Image 1 of 2");
    });

    test("keeps the modal on the default white theme", async () => {
        const { container } = await render(html`
            <ilw-image-gallery
                theme="blue"
                style="--ilw-color--background: #13294b; --ilw-color--text: #fff;">
                <a data-gallery-item href="/large-one.jpg" data-gallery-alt="First image alt">
                    <ilw-card>
                        <img slot="image" src="/thumb-one.jpg" alt="" />
                    </ilw-card>
                </a>
            </ilw-image-gallery>
        `);
        const gallery = container.querySelector("ilw-image-gallery") as ImageGallery;
        (gallery.querySelector("a") as HTMLAnchorElement).click();
        await gallery.updateComplete;

        const modal = gallery.shadowRoot?.querySelector("ilw-modal") as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        await modal.updateComplete;

        const modalSurface = modal.shadowRoot?.querySelector(".modal") as HTMLElement;
        const controls = gallery.shadowRoot?.querySelector(".gallery-controls") as HTMLElement;
        expect(getComputedStyle(modalSurface).backgroundColor).toBe("rgb(255, 255, 255)");
        expect(getComputedStyle(controls).color).not.toBe("rgb(255, 255, 255)");
    });

    test("moves to the next and previous images", async () => {
        const { container } = await render(galleryMarkup());
        const gallery = container.querySelector("ilw-image-gallery") as ImageGallery;
        (gallery.querySelector("a") as HTMLAnchorElement).click();
        await gallery.updateComplete;

        let buttons = gallery.shadowRoot?.querySelectorAll(".gallery-controls button");
        expect(buttons?.[0].classList.contains("ilw-button")).toBe(true);
        expect(buttons?.[1].classList.contains("ilw-button")).toBe(true);
        (buttons?.[1] as HTMLButtonElement).click();
        await gallery.updateComplete;

        let image = gallery.shadowRoot?.querySelector(".gallery-image") as HTMLImageElement;
        expect(image.src).toContain("/large-two.jpg");
        expect(gallery.shadowRoot?.textContent).toContain("Image 2 of 2");
        buttons = gallery.shadowRoot?.querySelectorAll(".gallery-controls button");
        expect((buttons?.[1] as HTMLButtonElement).disabled).toBe(true);

        (buttons?.[0] as HTMLButtonElement).click();
        await gallery.updateComplete;
        image = gallery.shadowRoot?.querySelector(".gallery-image") as HTMLImageElement;
        expect(image.src).toContain("/large-one.jpg");
    });

    test("supports arrow-key navigation while open", async () => {
        const { container } = await render(galleryMarkup());
        const gallery = container.querySelector("ilw-image-gallery") as ImageGallery;
        (gallery.querySelector("a") as HTMLAnchorElement).click();
        await gallery.updateComplete;

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
        await gallery.updateComplete;

        const image = gallery.shadowRoot?.querySelector(".gallery-image") as HTMLImageElement;
        expect(image.src).toContain("/large-two.jpg");
    });

    test("tabs from the next button to the close button", async () => {
        const { container } = await render(galleryMarkup());
        const gallery = container.querySelector("ilw-image-gallery") as ImageGallery;
        (gallery.querySelector("a") as HTMLAnchorElement).click();
        await gallery.updateComplete;

        const modal = gallery.shadowRoot?.querySelector("ilw-modal") as HTMLElement & {
            updateComplete: Promise<boolean>;
        };
        await modal.updateComplete;

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", cancelable: true }));
        const nextButton = gallery.shadowRoot?.querySelectorAll<HTMLButtonElement>(
            ".gallery-controls button",
        )[1];
        expect(deepestActiveElement()).toBe(nextButton);

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", cancelable: true }));
        const closeButton = modal.shadowRoot?.querySelector(".close-btn");
        expect(deepestActiveElement()).toBe(closeButton);
    });
});
