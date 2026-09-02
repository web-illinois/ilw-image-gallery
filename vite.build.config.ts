import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist/cdn",
        lib: {
            name: "ilw-image-gallery",
            entry: "ilw-image-gallery.ts",
            fileName: "ilw-image-gallery",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                assetFileNames: () => {
                    return "[name][extname]";
                },
            },
        },
    },
    server: {
        hmr: false,
    },
});
