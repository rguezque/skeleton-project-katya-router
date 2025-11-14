# Skeleton Project for `katya-router`

*Skeleton para proyectos, utilizando katya-router*

>[!TIP]
>Después de clonar este repo elimina la carpeta `.git`; así podrás gestionar desde cero el control de versiones de tu proyecto.

---

**Tabla de contenidos**

- [Instalar dependencias](#instalar-dependencias)
  - [Composer (PHP)](#composer-(php))
    - [Bootstrap](#bootstrap)
    - [Font Awesome](#font-awesome)
  - [NPM (JS)](#npm-(js))
    - [Configurar Axios](#configurar-axios)
    - [Configurar Alpine](#configurar-alpine)
- [Servidor de prueba](#servidor-de-prueba)
- [Producción](#producción)
- [i18n](#i18n)
- [Ambiente de desarrollo](#ambiente-de-desarrollo)
- [Helpers](#helpers)

---

## Instalar dependencias

### Composer (PHP)

Ejecuta en la terminal:

```bash
composer install
```

Se instalarán las dependencias de producción/desarrollo y se copiaran automáticamente los archivos necesarios dentro de `public/`. Si por algún motivo no se copian los archivos, hazlo de forma manual como se describe a continuación.

>[!IMPORTANT]
>Para el caso de `Axios` y `Alpine`, estos se intentarán descargar desde su respectivo CDN en `cdn.jsdelivr.net`. Si llegará a fallar, intenta descargarlos desde el CDN en `unpkg.com` ejecutando en la terminal `composer run download-from-unpkg-assets`. Si todo lo anterior falla, puedes intentar descargarlos usando el gestor de paquetes NPM de NodeJS; se incluye un archivo de configuración `package.json` (Ver la sección [NPM (JS)](#npm-(js)) para más información sobre configuración para el proyecto.

#### Bootstrap

Copia los archivos `.css` y `.js` según el siguiente mapeo:

- `vendor/twbs/bootstrap/dist/css/bootstrap.min.css`: Se copia al directorio `public/static/css/bootstrap/`
- `vendor/twbs/bootstrap/dist/js/bootstrap.bundle.min.js`: Se copia al directorio `public/static/js/bootstrap/`

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

>[!NOTE]
>
>- Para usar los estilos de Bootstrap: Solo necesitas `bootstrap.min.css`.
>- Para usar las funcionalidades interactivas de Bootstrap: Necesitas `bootstrap.bundle.min.js` (además de `bootstrap.min.css`) que ya incluye la dependencia `Popper.js`.

#### Font Awesome

Copia el archivo `.css` y el directorio `webfonts/` según el siguiente mapeo:

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

Se instalarán las dependencias de producción/desarrollo y se copiaran automáticamente los archivos necesarios dentro de `public/`. Si por algún motivo no se copian los archivos, hazlo de forma manual como se describe a continuación.

>[!NOTE]
>Después de copiar las depéndencias a `public/` puedes eliminar el directorio `node_modules/`

#### Configurar Axios

Copia el archivo `axios.min.js` según el siguiente mapeo:

- `node_modules/axios/dist/axios.min.js`: Se copia al directorio `public/static/js/axios/`

Alternativamente puede configurarse para llamarse desde un CDN en `app.module.js`:

```javascript
import 'https://unpkg.com/axios@1.6.7/dist/axios.min.js';
```

Para este proyecto se aplican las siguientes configuraciones de axios en `public/static/js/app.module.js`:

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

## i18n

Configura la internacionalización en el archivo `bootstrap/app.php` y coloca los archivos JSON con las traducciones en el directorio `i18n/`. Los archivos de traducción deben nombrase con los dos primeros caracteres del idioma. Ej. `es`, `en`, etc.

El método `i18n::configure` detectará automáticamente el idioma del navegador, sin embargo se cargará por default el idioma español `es` en caso de que por algún motivo no sea detectado. Puedes cambiar el idioma default enviandolo como primer argumento.

```php
use Project\Core\i18n;

// En este caso se cargara el idioma inglés en caso de que no se pueda detectar el idioma nativo del navegador web
i18n::configure(lang: 'en', path: __DIR__.'/i18n');
```

A partir de aquí se puede acceder a la función `i18n()` en las vistas; de esta forma se accede a las claves con las traducción correspondiente.

```json
{
    "title": "Mi aplicación",
    "description": "Bienvenido al sistema."
}
```

En un archivo de vista se carga la traducción así:

```php
<!DOCTYPE html>
<html lang="es">

<head>
    <title><?= i18n('title'); ?></title>
</head>

<body>
    <?= i18n('description'); ?>
</body>

</html>
```

> [!IMPORTANT]
> Los archivos de idioma que se espera que se detecten automáticamente deben existir obligatoriamente. Para cualquier otro idioma que no se espera ofrecer soporte, el archivo de idioma default también debe existir.

## Ambiente de desarrollo

Para configurar el ambiente de desarrollo y manejo de errores utiliza la clase estática `Environment`. El método `Environment::register` buscará automáticamente la variable de entorno `APP_ENV`, si no existe asignará el entorno `development`; aunque también puedes definir directamente el entorno de desarrollo.

```php
Environment::register(); // O explicitamente Environment::register('production')
Environment::setLogPath(dirname(__DIR__) . '/logs');
```

Para los bloques `try-catch` utiliza `Environment::handleException` en el `catch`, de esta forma los logs se guardarán con información detallada, pero el mensaje mostrado al usuario cambiará dependiendo del entorno de desarrollo; en `development` mostrará todo el *trace string* mientras que en `production` solo mostrará un error `500 Internal Error Server`.

Consulta el [`README.md`](./vendor/rguezque/katya-router/README.md#environment-management) del router para más información.

## Helpers

Los *helpers* son funciones cargadas automáticamente al inicio y que facilitan ciertas tareas específicas:

- `url(string $path)`: Genera la URL completa para un recurso dada su ruta relativa dentro del dominio.
- `i18n(string $key)`: Obtiene una traducción por su clave. Si no existe, se devuelve el string de la clave. Esta función es un atajo del método `i18n::get` para recuperar traducciones previamente cargadas por la clase `Pressmark\App\Config\i18n`.
- `env(string $key, mixed $default = null, ?int $cast_to = null)`: Devuelve variables de entorno previamente cargadas en `$_ENV`, si el valor no existe devuelve el valor *default* especificado; opcionalmente se puede enviar un número entero como *flag* para especificar a que tipo de dato castear el valor a devolver. Las *flags* posibles son `CAST_INT`, `CAST_STR`, `CAST_FLOAT`, `CAST_ARRAY`, `CAST_BOOL`, `CAST_OBJECT`. Es un atajo de la función `env()` del router.
- `resources(array $styles = [], array $scripts = [])`: Imprime las etiquetas `<link>` y `<script>` para los recursos especificados relativos a `/public/static`, o el directorio que se haya definido como 'estático'. Si los scripts tienen la extensión `.module.js`, se les añade el atributo `type="module"`.
- `metadata(array $metadata = [])`: Genera multiples etiquetas `<meta>` HTML a partir de metadatos globales (previamente cargados con `App::setMetadata`) y adicionales.
- `metatag(array $attributes = [])`: Genera una etiqueta `<meta>` HTML.
- `pipe(...$fns)`: Devuelve el resultado de ejecutar una secuencia de funciones en *pipeline* sobre un valor específico. Ej. `pipe('strtolower', 'ucwords', 'trim')('  jOHn dOE  ')` devuelve 'John Doe'.
- `sanitize_input(string|array $data)`: Sanitiza recursivamente un valor o un arreglo de valores. Aplica el filtro `FILTER_SANITIZE_FULL_SPECIAL_CHARS` para codificar caracteres especiales HTML y prevenir ataques XSS.
- `generate_csrf_token()`: Genera un token CSRF, lo guarda en la sesión y lo devuelve. Si ya existe un token en la sesión, lo devuelve.
- `csrf_field()`: Genera el campo input hidden con el token CSRF para el formulario. Ej. `<form><? csrf_field() ?></form>`.
- `validate_csrf_token(Parameters $request)`: Valida el token enviado en la solicitud (`$_POST` o `$_GET`) contra el token guardado en la sesión activa.

También están disponibles los *helpers* definidos en la libreria de `katya-router`. Consulta el [`README.md`](./vendor/rguezque/katya-router/README.md#helpers) del router.