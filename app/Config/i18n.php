<?php declare(strict_types = 1);

namespace Project\App\Config;

use rguezque\Exceptions\NotFoundException;

class i18n {

    /**
     * El idioma actual
     * 
     * @var string
     */
    private static string $lang = '';

    /**
     * La ruta al directorio con los archivos de idioma
     * 
     * @var array
     */
    private static array $translations = [];

    /**
     * Define si las traducciones están cargadas también en la variable global $GLOBALS
     * 
     * @var bool
     */
    private static bool $load2globals = false;

    /**
     * Configura la carga de idioma
     * 
     * @param string $lang El idioma a cargar.
     * @param string $path La ruta a la carpeta de traducciones.
     * @param bool $load2globals Define si las traducciones deben cargarse también a $GLOBALS
     * @return void
     */
    public static function configure(string $lang = 'es', string $path = 'i18n/', bool $load2globals = false): void {
        self::$lang = self::detectBrowserLanguage(strtolower(trim($lang)));
        self::$translations = self::loadTranslations($path);
        self::$load2globals = $load2globals;
        if($load2globals) {
            $GLOBALS['i18n'] = self::$translations;
        }
    }

    /**
     * Detecta el idioma del navegador web y compara si es aceptado o asigna uno especificado por default, y lo devuelve.
     * 
     * @param string $lang Idioma default a asignar
     * @return string El idioma del navegador o el idioma default
     */
    private static function detectBrowserLanguage(string $lang = 'es'): string {
        if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
            $locale = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
            if (in_array($locale, ['es', 'en'])) {
                $lang = $locale;
            }
        }

        return $lang;
    }

    /**
     * Carga las traducciones desde el archivo JSON.
     * 
     * @param string $path La ruta a la carpeta de traducciones.
     * @return array Un array con las traducciones.
     */
    private static function loadTranslations(string $path): array {
        $file = rtrim($path, '/\\') . DIRECTORY_SEPARATOR . self::$lang . '.json';

        if(!file_exists($file)) {
            throw new NotFoundException(sprintf('No se encontró el archivo especificado en: "%s"', $file));
        }

        $json = file_get_contents($file);
        return json_decode($json, true) ?? [];
    }

    /**
     * Obtiene una traducción por su clave. Si no existe, se devuelve el string de la clave.
     * 
     * @param string $key La clave de la traducción.
     * @return string La traducción o la clave si no se encuentra.
     */
    public static function get(string $key): string {
        $key = trim($key);

        if(strstr($key, '.')) {
            return self::findNestedValue(self::$translations, $key, '.');
        }

        $value = self::$translations[$key] ?? null;
        return isset($value) ? $value : $key;
    }

    /**
     * Obtiene el idioma actual.
     * 
     * @return string El idioma actual.
     */
    public static function getLang(): string {
        return self::$lang;
    }

    /**
     * Busca una clave anidada a partir del formato "<section>.<subsection>..."
     * 
     * @param array $collection Array asociativo a recorrer
     * @param string $expression Cadena de texto con las claves anidadas
     * @param string $delimiter Simbolo delimitador de las claves
     * @return string El valor de la clave
     */
    private static function findNestedValue(array $collection, string $expression, string $delimiter = '.') {
        $keys = explode($delimiter, $expression);
        $current = $collection;

        foreach ($keys as $key) {
            if (is_array($current) && array_key_exists($key, $current)) {
                $current = $current[$key];
            } else {
                return $key; // The key does not exist
            }
        }

        return $current;
    }
}

?>