# ilw-image-gallery

Links: **[ilw-image-gallery in Builder](https://builder3.toolkit.illinois.edu/component/ilw-image-gallery/index.html)** | 
[Illinois Web Theme](https://webtheme.illinois.edu/) | 
[Toolkit Development](https://github.com/web-illinois/toolkit-management)

## Overview

The image gallery provides a thumbnail display of images in a grid. When you click on an image, a modal will open to display the image larger and allow you to advance to the next image.

## Code Examples

```html
<ilw-image-gallery>
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

## Accessibility Notes and Use

Consider accessibility, both for building the component and for its use:

- Is there sufficient color contrast?
- Can the component be fully understood without colors?
- Does the component need alt text or ARIA roles?
- Can the component be navigated with a keyboard? Is the tab order correct?
- Are focusable elements interactive, and interactive elements focusable?
- Are form fields, figures, fieldsets and other interactive elements labelled?

## External References
