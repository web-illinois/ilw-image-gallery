# ilw-image-gallery

Links: **[ilw-image-gallery in Builder](https://builder3.toolkit.illinois.edu/component/ilw-image-gallery/index.html)** | 
[Illinois Web Theme](https://webtheme.illinois.edu/) | 
[Toolkit Development](https://github.com/web-illinois/toolkit-management)

## Overview

The image gallery provides a thumbnail display of images in a grid. When you click on an image, a modal will open to display the image larger and allow you to advance to the next image. The image gallery uses `ilw-grid` and `ilw-card` for the image thumbnail layout.
## Code Examples

```html
<ilw-image-gallery label="Campus photo gallery" caption="true">
 <ilw-grid>
    <a
      data-gallery-item
      href="/images/photo-1-large.jpg"
      data-gallery-alt="A boathouse beside the lake at night"
    >
      <ilw-card aspectratio="4/3">
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

The full-size image comes from each gallery item's `href`. Use `data-gallery-alt`
for its alternative text and `data-gallery-caption` when the modal caption should
differ from the card text. Previous and Next stop at the ends of the gallery.

Thumbnail captions are hidden by default. Add `caption="true"` to the gallery to
display them beneath the thumbnails. Captions are displayed in the modal whether
or not the `caption` attribute is enabled. Don't include captions in your html markup if you don't want any captions on the modal.

The gallery creates one shared modal internally. It also supports Left and Right
navigation while the modal is open; Escape closes it and returns focus to
the thumbnail that opened it.

Inside the modal, each full-size image and its caption are rendered together as a
semantic `figure` and `figcaption`.

The modal defaults to a maximum width of `900px`. Override
`--ilw-image-gallery--modal-width` on the gallery when a different maximum is
needed. Images retain their natural proportions instead of stretching or cropping.

## Accessibility Notes and Use

- Give the gallery a concise `label` that identifies the image collection.
- Use meaningful `data-gallery-alt` text for informative images.
- Keep the thumbnail image's `alt` empty when the surrounding link and card text
  already provide its accessible name.
- Gallery items must be anchors so they remain keyboard accessible and open the
  full-size image normally when JavaScript is unavailable.

## External References
