# ilw-image-gallery

Links: **[ilw-image-gallery in Builder](https://builder3.toolkit.illinois.edu/component/ilw-image-gallery/index.html)** | 
[Illinois Web Theme](https://webtheme.illinois.edu/) | 
[Toolkit Development](https://github.com/web-illinois/toolkit-management)

## Overview

The image gallery provides a thumbnail display of images in a grid. When you click on an image, a modal will open to display the image larger and allow you to advance to the next image. The image gallery uses `ilw-grid` and `ilw-card` for the image thumbnail layout.
## Code Examples
Image Gallery with captions in the gallery and the modal
```html
<ilw-image-gallery label="Campus photo gallery" caption="true">
 <ilw-grid width="page" gap="25px" padding="0">
    <a
      data-gallery-item
      href="/images/photo-1-large.jpg"
      data-gallery-alt="A boathouse beside the lake at night"
    >
      <ilw-card aspectratio="16/10">
        <img
          slot="image"
          src="/images/photo-1-thumbnail.jpg"
          alt=""
          width="570"
          height="428"
        >
        <p>Boathouse at night</p>
      </ilw-card>
    </a>

    <!-- Additional items -->
  </ilw-grid>
</ilw-image-gallery>
```
Image Gallery with no captions in the gallery or modal
```html
<ilw-image-gallery label="Campus photo gallery" theme="blue">
  <ilw-grid width="page" gap="25px" padding="0">
    <a data-gallery-item href="https://picsum.photos/id/13/2500/1667"
        data-gallery-alt="A beach with pine trees in the distance"
        aria-label="A beach with pine trees in the distance">
        <ilw-card aspectratio="16/10">
            <img src="https://picsum.photos/id/13/570/300" alt="" slot="image">
        </ilw-card>
    </a>
    <!-- Additional items -->
   
  </ilw-grid>
 </ilw-image-gallery>
```
Image Gallery with caption in modal only
```html
 <ilw-image-gallery label="Campus photo gallery">
    <ilw-grid width="page" gap="25px" padding="0">
        <a data-gallery-item href="https://picsum.photos/id/13/2500/1667"
            data-gallery-alt="A beach with pine trees in the distance">
            <ilw-card aspectratio="16/10">
                <img src="https://picsum.photos/id/13/570/300" alt="" slot="image">
                <p>A beach with pine trees in the distance</p>
            </ilw-card>
        </a>
    <!-- Additional items -->

    </ilw-grid>
  </ilw-image-gallery>
```

The full-size image comes from each gallery item's `href`. Use `data-gallery-alt`
for its alternative text and `data-gallery-caption` when the modal caption should
differ from the card text. Previous and Next stop at the ends of the gallery.

Thumbnail captions are hidden by default. Add `caption="true"` to the gallery to
display them beneath the thumbnails. Captions are displayed in the modal whether
or not the `caption` attribute is enabled. Don't include captions in your html markup if you don't want any captions in the modal.

Cards display their standard border by default. Add `no-border="true"` to the
gallery to hide the border on every card in the gallery.

Inside the modal, each full-size image and its caption are rendered together as a
semantic `figure` and `figcaption`.

The modal defaults to a maximum width of `900px`. Override
`--ilw-image-gallery--modal-width` on the gallery when a different maximum is
needed. Images retain their natural proportions instead of stretching or cropping.

The gallery provides `40px` of top and bottom padding by default. Its padding can
be adjusted independently with `--ilw-image-gallery--padding-top`,
`--ilw-image-gallery--padding-right`, `--ilw-image-gallery--padding-bottom`, and
`--ilw-image-gallery--padding-left`. Set the nested grid's `padding` attribute to
`0` so its default bottom padding does not stack with the gallery padding.

## Accessibility Notes and Use

- Give the gallery a concise `label` that identifies the image collection.
- Use meaningful `data-gallery-alt` text for informative images.
- Keep the thumbnail image's `alt` empty when the surrounding link and caption text
  already provide its accessible name.
- Gallery items must be anchors so they remain keyboard accessible and open the
  full-size image normally when JavaScript is unavailable.
- Add `aria-label` to the link when there is no caption on the image gallery so that the link has an accessible name 
