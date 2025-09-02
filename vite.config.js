// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    root: 'public', // Directorio raíz donde buscarán los archivos fuente a empaquetar
    // Base pública para el proyecto. 
    // Es importante para archivos CSS que referencian otros assets. 
    // Esto es útil cuando tu proyecto se despliega en una subcarpeta de un servidor.
    base: './', 
    //publicDir: 'static', // Directorio para archivos estáticos que no serán procesados por Vite
    build: {
        manifest: true, // Genera un archivo manifest.json que mapea los archivos fuente a los archivos compilados
        emptyOutDir: true, // Limpia el directorio de salida antes de cada compilación
        // Directorio de salida dentro de /public para los archivos compilados
        // Si no se especifica, el valor por defecto es 'dist'
        // Si rollupOptions.output.dir está definido, se usará ese valor en lugar de outDir
        outDir: 'compiled', 
        rollupOptions: {
            input: [
                'public/static/css/app.css',
                'public/static/js/app.module.js',
            ],
            // Configura los nombres de los archivos de salida dentro de build.outDir
            // Si rollupOptions.output.dir no está definido, se usará outDir
            // rollupOptions.output.dir no es relativo a outDir
            // Si rollupOptions.output no está definido, se usará 'assets'
            output: {
                entryFileNames: '[name].js', // Directorio y nombre para los archivos JS
                assetFileNames: '[name].[ext]', // Para los assets (imágenes, CSS, etc.)
                chunkFileNames: '[name].[ext]', // Para los trozos de código
            },
        },
    },
});