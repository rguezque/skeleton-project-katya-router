# Converter-XML *frontend*

*Frontend para el sistema de captura y procesado de artículos científicos a XML*



---

**Tabla de contenidos**

- [Instalar dependencias](#instalar-dependencias)
  - [Composer (PHP)](#composer-(php))
    - [Bootstrap](#bootstrap)
    - [Font Awesome](#font-awesome)
  - [NPM (JS)](#npm-(js))
    - [Configurar Axios](#configurar-axios)
    - [Configurar Alpine](#configurar-alpine)
    - [Configurar Vite](#configurar-vite)
- [Servidor de prueba](#servidor-de-prueba)
- [Producción](#producción)

---

## Instalar dependencias

### Composer (PHP)

Ejecuta en la terminal:

```bash
composer install
```

Se instalarán las dependencias de producción/desarrollo y se copiaran automáticamente los archivos necesarios dentro de `/public`. Si por algún motivo no se copian los archivos, hazlo de forma manual como se describe a continuación.

#### Bootstrap

Copia los archivos `.css` y `.js` según el siguiente mapeo:

- `vendor/twbs/bootstrap/dist/css/bootstrap.min.css`: Se copia al directorio `/public/static/css/bootstrap/`
- `vendor/twbs/bootstrap/dist/js/bootstrap.bundle.min.js`: Se copia al directorio `/public/static/js/bootstrap/`

También puede llamarse desde un CDN en `app.css`:

```css
/* filepath: /public/static/css/app.css */
@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css");
```

Y en `app.module.js`:

```javascript
// filepath: /public/static/js/app.module.js
import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js'
```

#### Font Awesome

Copia el archivo `.css` y el directorio `/webfonts` según el siguiente mapeo:

- `vendor/components/font-awesome/css/all.min.css`: Se copia al directorio `public/static/css/fontawesome/css/`
- `vendor/components/font-awesome/webfonts`: Se copia al directorio `public/static/css/fontawesome/`

También puede llamarse desde un CDN en `app.module.js`:

```javascript
import 'https://kit.fontawesome.com/7b35949868.js'
```

### NPM (JS)

Ejecuta en la terminal:

```bash
npm install
```

Se instalarán las dependencias de producción/desarrollo y se copiaran automáticamente los archivos necesarios dentro de `/public`. Si por algún motivo no se copian los archivos, hazlo de forma manual como se describe a continuación.

#### Configurar Axios

Copia el archivo `axios.min.js` según el siguiente mapeo:

- `node_modules/axios/dist/axios.min.js`: Se copia al directorio `public/static/js/axios/`

Alternativamente puede configurarse para llamarse desde un CDN en `app.module.js`:

```javascript
import 'https://unpkg.com/axios@1.6.7/dist/axios.min.js';
```

Para este proyecto se aplican las siguientes configuraciones de axios en `/public/static/js/app.module.js`:

```javascript
// Crea una instancia de Axios y configura la URL base para las peticiones a la API
const api = axios.create({
    baseURL: getCookie('API_URL'),
    timeout: 10000, // Tiempo máximo de espera para una petición
});

// Por default se enviará el header 'X-Requested-With' en cada petición 
api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Desactiva el cache, lo que significa que las peticiones no se almacenarán en caché. 
// Garantiza que cada petición sea fresca desde el server.
api.defaults.headers.get = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
};

// y el Content-Type para peticiones POST
api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

#### Configurar Alpine

Copia el archivo `cdn.min.js` y renómbralo según el siguiente mapeo:

- `node_modules/alpinejs/dist/cdn.min.js`: Se copia al directorio `public/static/js/alpine/alpine.min.js`

Alternativamente puede configurarse para llamarse desde un CDN en `app.module.js`:

```javascript
import 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js';
```

#### Configurar Vite

La configuración básica del empaquetador Vite se encuentra en el archivo `vite.config.js` en la raíz del proyecto.

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    root: 'public',
    base: './', 
    build: {
        outDir: 'compiled', 
        rollupOptions: {
            input: [
                'public/static/css/app.css',
                'public/static/js/app.module.js',
            ],
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                chunkFileNames: '[name].[ext]',
            },
        },
    },
});
```

Donde:

- `defineConfig.root`: Es el directorio raíz donde Vite buscará por los archivos fuente a empaquetar.
- `defineConfig.base`: Base pública para el proyecto. Es importante para archivos que referencian otros assets. Esto es útil cuando tu proyecto se despliega en una subcarpeta de un servidor.
- `defineConfig.build.outDir`: Directorio de salida dentro de `defineConfig.root` para los archivos compilados. Si no se especifica, el valor por defecto es 'dist'.
- `defineConfig.build.rollupOptions.input`: Se agregan los archivos que desean ser empaquetados, las rutas deben ser relativas a `defineConfig.root`.
- `defineConfig.build.rollupOptions.output`: (Opcional) Configura los nombres de los archivos de salida dentro de `defineConfig.build.outDir`. Si no se define esta sección, el directorio por default será `/assets` dentro de `build.outDir` y los archivos tendrán nombres aleatorios.
- `defineConfig.build.rollupOptions.output.dir`: (Opcional) Directorio de salida de los archivos compilados. Si no se define `output.dir` se tomará `build.outDir`.

Configurar nombres de salida de los archivos en `defineConfig.build.rollupOptions.output`:

- `output.entryFileNames`: Directorio y nombre para los archivos JS.
- `output.assetFileNames`: Para los assets (imágenes, CSS, etc.).
- `output.chunkFileNames`: Para los trozos de código.

>[!NOTE]
> Se puede utilizar el placeholder `[name]` para conservar el nombre del archivo y combinarse con un hash `[hash]`, seguido de la extensión original `[ext]`. Ej: `[name]-[hash].[ext]`

Compila los assets desde la terminal con `npx vite build`.

## Servidor de prueba

Ejecuta en la terminal:

```bash
composer run dev
```

Luego abre el navegador en `http://localhost:8000`. Para terminar el proceso pulsa <kbd>CTRL+c</kbd>.

>[!IMPORTANT]
>Si al volver a ajecutar el servidor de prueba arroja error de que el puerto sigue ocupado, ejecuta: `sudo lsof -i :8000` y luego `sudo kill -9 <PID>`

## Producción

Ejecuta en la terminal:

```bash
composer install --no-dev
```

