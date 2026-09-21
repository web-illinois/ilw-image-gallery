// The gallery expects consumers to register and style its companion web
// components. Register them here so browser tests exercise the same setup
// without adding those imports back to the published gallery module.
import "@illinois-toolkit/ilw-card";
import "@illinois-toolkit/ilw-card/ilw-card.css";
import "@illinois-toolkit/ilw-grid";
import "@illinois-toolkit/ilw-grid/ilw-grid.css";
import "@illinois-toolkit/ilw-modal";
import "@illinois-toolkit/ilw-modal/ilw-modal.css";

if (typeof document !== 'undefined') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.toolkit.illinois.edu/ilw-global/3/ilw-global.css';
  document.head.appendChild(link);
}
