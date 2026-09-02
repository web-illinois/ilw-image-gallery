import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        lib: {
            name: "ilw-image-gallery",
            entry: "ilw-image-gallery.ts",
            fileName: "ilw-image-gallery",
            formats: ["es"],
        },
        rollupOptions: {
            external: [/^@?lit/, /^@illinois-toolkit/],
            output: {
                assetFileNames: (chunkInfo) => {
                    return "[name][extname]"; // vite default
                },
            },
        },
    },
    server: {
        hmr: false,
    },
    plugins: [dts()],
});
