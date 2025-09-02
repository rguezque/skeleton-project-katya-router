<?php declare(strict_types = 1);

namespace Project\App\Config;

use rguezque\CorsConfig;
use rguezque\Katya;
use rguezque\Services;

class App {
    private static ?Katya $app = null;
    private static ?string $base_path = null;
    private static ?string $base_url = null;
    private static ?string $domain= null;
    private static string $static_dir = '';
    public static array $metadata = [];

    /**
     * Configura la aplicación estableciendo la ruta base del proyecto, el directorio de archivos estáticos,
     * la configuración CORS y los servicios a registrar.
     * 
     * @param string $base_path La ruta base del proyecto.
     * @param string $static_dir (Opcional) El directorio donde se alojan los archivos estáticos.
     * @param CorsConfig|null $cors_config (Opcional) Configuración CORS para la aplicación.
     * @param Services|null $services (Opcional) Servicios a registrar en la aplicación.
     * 
     * @return Katya La instancia de la aplicación Katya.
     */
    public static  function configure(
        string $base_path, 
        string $static_dir = '/static', 
        ?CorsConfig $cors_config = null, 
        ?Services $services = null
    ): Katya {
        self::setBasePath($base_path);
        self::setBaseUrl();
        self::setStaticDirectory($static_dir);
        self::getApplication();
        
        if(null !== $cors_config) {
            self::$app->setCors($cors_config);
        }
        
        if(null !== $services) {
            self::$app->setServices($services);
        }
        
        return self::$app;
    }

    /**
     * Crea y devuelve la instancia singleton de la aplicación Katya de forma global en toda la aplicación.
     * 
     * @return Katya La instancia de la aplicación Katya.
     */
    public static function getApplication(): Katya {
        if (self::$app === null) {
            self::$app = new Katya();
        }

        return self::$app;
    }

    /**
     * Establece los servicios de la aplicación.
     */
    public static function setServices(Services $services): void {
        self::$app->setServices($services);
    }

    /**
     * Establece la ruta completa del directorio base del proyecto
     * 
     * @param string $base_path La ruta completa del directorio base del proyecto.
     */
    public static function setBasePath(string $base_path): void {
        self::$base_path = $base_path;
    }

    /**
     * Devuelve la ruta completa del directorio base del proyecto
     * 
     * @return string
     */
    public static function getBasePath(): string {
        return self::$base_path;
    }


    /**
     * Establece el nombre de la carpeta estática.
     *
     * @param string $static_dir nombre del directorio estático (por ejemplo, 'static' o 'assets').
     */
    public static function setStaticDirectory(string $static_dir = '/static') {
        // Asegura que la ruta termine con una barra inclinada
        self::$static_dir = DIRECTORY_SEPARATOR . trim($static_dir, '/\\');
    }

    /**
     * Devuelve el nombre del directorio estático. Ej: 'static' o 'assets'.
     * @return string
     */
    public static function getStaticDirectory(): string {
        return self::$static_dir;
    }

    /**
     * Devuelve la url completa donde se aloja contenido estático. Ej: http://example.com/static/
     * 
     * @return string
     */
    public static function getStaticUrl(): string {
        $baseurl = self::getBaseUrl();
        return trim($baseurl, '/\\') . DIRECTORY_SEPARATOR . trim(self::$static_dir, '/\\');
    }

    /**
     * Detecta y establece automáticamente la URL base del dominio. Ej: http://example.com o http://example.com/subdir
     * 
     * @return void
     */
    public static function setBaseUrl(): void {
        if (self::$base_url === null) {
            self::setDomain();
            
            // Detección del directorio base (subdirectorio)
            $script_name = $_SERVER['SCRIPT_NAME'];
            $script_dir = dirname($script_name); // ejemplo: dirname('/etc/password') => '/etc'
            $base_dir = ($script_dir === '.' || $script_dir === '/') ? '' : $script_dir;
            
            self::$base_url = self::$domain . $base_dir;
        }
    }

    /**
     * Devuelve la URL base del dominio con el subdirectorio (si aplica). Ej: http://example.com o http://example.com/subdir
     * 
     * @return string|null La URL base o null si no se ha podido determinar.
     */
    public static function getBaseUrl(): ?string {
        self::setBaseUrl();
        return self::$base_url;
    }
    
    /**
     * Obtiene el dominio completo (protocolo + host). Ej: http://example.com
     * 
     * @return void
     */
    public static function setDomain(): void {
        if (self::$domain === null) {
            // Determine the protocol (http or https)
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
            
            // Get the host (domain name)
            $host = $_SERVER['HTTP_HOST'];

            // Get the port, if it's not the default (80 for http, 443 for https)
            //$port = $_SERVER['SERVER_PORT'];
            //$display_port = ($protocol === 'http' && $port == 80) || ($protocol === 'https' && $port == 443) ? '' : ':' . $port;

            self::$domain = $protocol . '://' . $host;
        }
    }

    /**
     * Devuelve el dominio completo (protocolo + host). Ej: http://example.com
     * 
     * @return string|null El dominio completo o null si no se ha podido determinar.
     */
    public static function getDomain(): ?string {
        self::setDomain();
        return self::$domain;
    }

    /**
     * Establece metadatos globales que se incluirán en todas las vistas y 
     * habilita el uso de las funciones metatag() y metadata() en las vistas.
     * 
     * @param array $metadata Un array de arrays asociativos, cada uno representando los atributos de una etiqueta <meta>.
     * @return void
     */
    public static function setMetadata(array $metadata): void {
        self::$metadata = $metadata;
    }

    /**
     * Devuelve los metadatos globales establecidos para la aplicación.
     * 
     * @return array Un array de arrays asociativos, cada uno representando los atributos de una etiqueta <meta>.
     */
    public static function getMetadata(): array {
        return self::$metadata;
    }

}

?>