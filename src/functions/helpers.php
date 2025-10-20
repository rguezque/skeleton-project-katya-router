<?php declare(strict_types = 1);

use Project\Core\App;
use Project\Core\i18n;
use rguezque\Parameters;
use rguezque\Session;

use function rguezque\functions\env as get_env_var;

if(!function_exists('url')) {
    /**
     * Genera la URL completa para un recurso dada su ruta relativa dentro del dominio.
     * 
     * @param string $path La ruta relativa del recurso (por ejemplo, 'favicn_io/site.webmanifest').
     * @return string La URL completa del recurso.
     */
    function url(string $path): string {
        $path = DIRECTORY_SEPARATOR . trim($path, '/\\'); // Asegura que la ruta sea relativa al basepath
        $baseurl = App::getBaseUrl();
        return $baseurl . htmlspecialchars($path, ENT_QUOTES);
    }
}

if(!function_exists('i18n')) {
    /**
     * Obtiene una traducción por su clave. Si no existe, se devuelve el string de la clave.
     * Esta función es un atajo para recuperar traducciones previamente cargadas por la clase Pressmark\App\Config\i18n
     * 
     * @param string $key La clave de la traducción
     * @return string La palabra traducida
     */
    function i18n(string $key) {
        return i18n::get($key);
    }
}

if(!function_exists('resources')) {
    /**
     * Imprime las etiquetas `<link>` y `<script>` para los recursos especificados relativos a /public/static. 
     * Si los scripts tienen la extensión .module.js, se les añade el atributo type="module".
     * 
     * @param array $styles Array de rutas a hojas de estilo CSS.
     * @param array $scripts Array de rutas a archivos JavaScript.
     * @return void
     */
    function resources(array $styles = [], array $scripts = []) : void {
        if (empty($styles) && empty($scripts)) {
            return; // No hay recursos que cargar
        }

        $manifest_path = App::getBasePath() . '/public/compiled/.vite/manifest.json';
        if('production' == env('app.env') && file_exists($manifest_path)) {
            $manifest = json_decode(file_get_contents($manifest_path), true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($manifest)) {
                loadCompiledResources($styles, $scripts, $manifest);
                return;
            }
        }

        $static_url = App::getStaticDirectory();

        foreach ($styles as $style) {
            $style = DIRECTORY_SEPARATOR . ltrim($style, '/\\'); // Asegura que la ruta sea relativa al basepath
            echo '<link rel="stylesheet" href="' . $static_url . htmlspecialchars($style, ENT_QUOTES) . '">' . PHP_EOL;
        }

        foreach ($scripts as $option => $script) {
            $script = DIRECTORY_SEPARATOR . ltrim($script, '/\\'); // Asegura que la ruta sea relativa al basepath
            $is_module = preg_match('/\.module\.js$/i', $script);
            $type_attr = $is_module ? ' type="module"' : '';
            $attrs = ''; // Por defecto, sin atributos adicionales
            if(!is_numeric($option)) {
                $attrs = ' '.$option;
            }
            echo '<script src="' . $static_url . htmlspecialchars($script, ENT_QUOTES) . '"' . $type_attr . $attrs .'></script>' . PHP_EOL;
        }
    }
}

if(!function_exists('env')) {
    /**
     * Obtiene el valor de una variable de entorno. Si la variable no está definida, devuelve el valor por defecto proporcionado.
     * La variable se invoca en minúsculas y con puntos en vez de los guiones bajos (si los tiene). Ej: app.name en vez de APP_NAME
     * 
     * @param string $key La clave de la variable de entorno.
     * @param mixed $default (Opcional) Valor por defecto si la variable no está definida.
     * @param int $cast_to Número entero que identifica el tipo de casteo a aplicar a la variable
     * @return mixed El valor de la variable de entorno o el valor por defecto.
     */
    function env(string $key, mixed $default = null, ?int $cast_to = null): mixed {
        return get_env_var($key, $default, $cast_to);
    }
}

if(!function_exists('metadata')) {
    /**
     * Genera etiquetas `<meta>` HTML a partir de metadatos globales y adicionales.
     * 
     * @param array $metadata (Opcional) Un array de arrays asociativos, cada uno representando los atributos de una etiqueta <meta>.
     * @return string Las etiquetas `<meta>` generadas.
     */
    function metadata(array $metadata = []): string {
        $meta = '';
        foreach (array_merge(App::getMetadata(), $metadata) as $attributes) {
            $meta .= metatag($attributes) . PHP_EOL;
        }

        return $meta;
    }
}

if(!function_exists('metatag')) {
    /**
     * Genera una etiqueta `<meta>` HTML.
     *
     * @param array $attributes Un array asociativo de atributos y sus valores para la etiqueta <meta>.
     * @return string La etiqueta `<meta>` generada.
     */
    function metatag(array $attributes = []): string {
        if([] === $attributes) return '';
        $html_attributes = '';
        foreach ($attributes as $key => $value) {
            // Sanitiza los atributos para evitar inyecciones de código.
            $safe_key = htmlspecialchars($key, ENT_QUOTES, 'UTF-8');
            $safe_value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
            $html_attributes .= " {$safe_key}=\"{$safe_value}\"";
        }

        return "<meta{$html_attributes}>";
    }
}

if(!function_exists('pipe')) {
    /**
     * Devuelve el resultado de ejecutar una secuencia de funciones en pipeline sobre un valor específico.
     * Ej. `pipe('strtolower', 'ucwords', 'trim')('  jOHn dOE  ')` devuelve 'John Doe'
     * 
     * @param array<Closure> $fns Listado de funciones a ejecutar en cadena
     * @return mixed El resultado de aplicar las funciones sobre un valor
     */
    function pipe(...$fns) {
        return fn($initial_value) => 
            array_reduce($fns, function($accumulator, $func) {
                return call_user_func($func, $accumulator);
            }, $initial_value);
    }
}

if(!function_exists('sanitize_input')) {
    /**
     * Sanitiza recursivamente un valor o un arreglo de valores.
     *
     * Aplica el filtro FILTER_SANITIZE_FULL_SPECIAL_CHARS para codificar
     * caracteres especiales HTML y prevenir ataques XSS.
     *
     * @param mixed $data La variable (string o array) a sanitizar.
     * @return mixed Los datos sanitizados.
     */
    function sanitize_input($data) {
        if (is_array($data)) {
            // Si es un arreglo, aplica la función a cada elemento.
            return array_map('sanitize_input', $data);
        }

        if (is_string($data)) {
            // Usa FILTER_SANITIZE_FULL_SPECIAL_CHARS para codificar caracteres especiales HTML,
            // lo que es la principal defensa contra XSS.
            return filter_var($data, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        }

        // Devuelve otros tipos de datos (como números enteros, booleanos) sin modificar,
        // ya que no contienen scripts.
        return $data;
    }
}

if(!function_exists('generate_csrf_token')) {
    /**
     * Genera el token CSRF, lo guarda en la sesión y lo devuelve.
     * Si ya existe un token en la sesión, lo devuelve.
     * 
     * @return string El token CSRF actual.
     */
    function generate_csrf_token() {
        $session = Session::create();
        // Verifica si el token ya existe en la sesión
        if (!$session->has('csrf_token')) {
            // Genera un token criptográficamente seguro
            // bin2hex convierte bytes aleatorios en una cadena hexadecimal
            $session->set('csrf_token', bin2hex(random_bytes(32))); 
        }

        return $session->get('csrf_token');
    }
}

if(!function_exists('csrf_field')) {
    /**
     * Genera el campo input hidden con el token CSRF para el formulario.
     * 
     * @return void Imprime directamente el campo HTML.
     */
    function csrf_field() {
        $token = generate_csrf_token();
        // Usa htmlspecialchars para asegurar que el token se imprima de forma segura
        echo '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token) . '">';
    }
}

if(!function_exists('validate_csrf_token')) {
    /**
     * Valida el token enviado en la solicitud (`$_POST` o `$_GET`) contra el token de la sesión.
     * 
     * @param Parameters $request El objeto de la solicitud. Normalmente `$_POST` (`Request::getBody()`) o `$_GET` (`Request::getQuery()`).
     * @return bool True si el token es válido, false si no lo es o falta.
     */
    function validate_csrf_token(Parameters $request) {
        $session = Session::create();
        // 1. Verificar que el token de la sesión existe
        if (!$session->valid('csrf_token')) {
            return false; // No hay token de sesión para validar
        }
        
        // 2. Verificar que el token de la solicitud existe
        if (!$request->valid('csrf_token')) {
            return false; // El formulario no envió el token
        }
    
        // 3. Comparar de forma segura
        // hash_equals previene ataques de sincronización (timing attacks)
        if (hash_equals($session->get('csrf_token'), $request->get('csrf_token'))) {
            // Opcional y recomendado: Consumir el token después de usarlo
            $session->remove('csrf_token'); 
            return true;
        }
        
        return false; // Los tokens no coinciden
    }
}

function loadCompiledResources($styles, $scripts, $manifest) {
    $compiled_dir = App::getBaseUrl() . '/compiled/';
    
    foreach($styles as $style) {
        $style = App::getStaticDirectory() . DIRECTORY_SEPARATOR . ltrim($style, '/\\'); // Asegura que la ruta sea relativa al basepath
        $compiled_style = $manifest[trim($style, '/\\')]['file'];
        echo '<link rel="stylesheet" href="' . $compiled_dir . htmlspecialchars($compiled_style, ENT_QUOTES) . '">' . PHP_EOL;
    }
    
    foreach($scripts as $option => $script) {
        $script = App::getStaticDirectory() . DIRECTORY_SEPARATOR . ltrim($style, '/\\'); // Asegura que la ruta sea relativa al basepath
        $compiled_script = $manifest[trim($style, '/\\')]['file'];
        $is_module = preg_match('/\.module\.js$/i', $script);
        $type_attr = $is_module ? ' type="module"' : '';
        $attrs = ''; // Por defecto, sin atributos adicionales
        if(!is_numeric($option)) {
            $attrs = ' '.$option;
        }
        echo '<script src="' . $compiled_dir . htmlspecialchars($compiled_script, ENT_QUOTES) . '"' . $type_attr . $attrs .'></script>' . PHP_EOL;
    }
}


?>