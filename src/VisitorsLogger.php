<?php declare(strict_types = 1);

namespace Project\Core;

class VisitorsLogger {
    private string $log_dir = 'logs/'; // Directorio donde se guardarán los logs
    private string $ip_data_api = 'http://ip-api.com/json/'; // API de geolocalización

    public function __construct(string $log_dir = 'logs/') {
        $this->log_dir = rtrim($log_dir, '/') . DIRECTORY_SEPARATOR;
        if (!is_dir($this->log_dir)) {
            // Intenta crear el directorio si no existe con permisos 0777
            mkdir($this->log_dir, 0777, true);
        }
    }

    /**
     * Obtiene la IP de origen del visitante.
     * 
     * @return string Retorna la IP o 'UNKNOWN' si no está disponible.
     */
    private function getVisitorIp(): string {
        $ip = 'UNKNOWN';
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        // Manejo de múltiples IPs en X-Forwarded-For
        if (strpos($ip, ',') !== false) {
            $ips = explode(',', $ip);
            $ip = trim($ips[0]);
        }
        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'INVALID_IP';
    }

    /**
     * Obtiene el User Agent (navegador/sistema operativo).
     * 
     * @return string Retorna el User Agent o 'UNKNOWN_BROWSER' si no está disponible.
     */
    private function getBrowser(): string {
        return $_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN_BROWSER';
    }

    /**
     * Intenta obtener datos sobre el visitante a partir de la IP usando una API externa.
     * 
     * @return array|string Retorna un array con los datos o un string con el error.
     */
    private function getDetailsFromIp(string $ip): array|string {
        if ($ip === 'UNKNOWN' || $ip === 'INVALID_IP' || $ip === '127.0.0.1') {
            return 'LOCAL/UNKNOWN';
        }
        
        $url = $this->ip_data_api . $ip;
        $response = false;

        // Uso de cURL para la petición (más recomendado)
        if (function_exists('curl_init')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5); // Timeout de 5 segundos
            $response = curl_exec($ch);
            curl_close($ch);
        } else {
            // Alternativa si cURL no está disponible
            $response = @file_get_contents($url);
        }

        $data = json_decode($response, true);

        if ($data && isset($data['status']) && $data['status'] === 'success') {
            return $data ?? 'FAIL_RECOVERING_VISITOR_IP_DATA';
        }

        return 'FAIL_RECOVERING_VISITOR_IP_DATA';
    }

    /**
     * Registra el acceso en el archivo de log diario en formato JSON.
     * 
     * @return void
     */
    public function logAccess(): void {
        $ip = $this->getVisitorIp();
        $details = $this->getDetailsFromIp($ip);
        $country = $details['country'] ?? 'UNKNOWN_COUNTRY';
        $browser = $this->getBrowser();
        $timestamp = time(); // Usamos timestamp UNIX
        $request_method = $_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN_METHOD';
        $request_uri = $_SERVER['REQUEST_URI'] ?? 'N/A';

        // Datos del log en formato array
        $log_data = [
            'timestamp' => $timestamp,
            'datetime' => date('Y-m-d H:i:s', $timestamp),
            'visitor_ip' => $ip,
            'visitor_hashed_ip' => hash('sha256', $ip), // IP hasheada por privacidad
            'country' => $country,
            'user_agent' => $browser,
            'request_method' => $request_method,
            'request_uri' => $request_uri, // Opcional: añade la URL
            'details' => $details
        ];

        // Codificar el array a JSON
        // JSON_UNESCAPED_UNICODE para asegurar caracteres especiales (ñ, tildes)
        // JSON_PRETTY_PRINT (opcional) si quieres que el archivo JSON sea más legible para humanos (añade saltos de línea y espacios)
        $json_entry = json_encode($log_data, JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE) . "\n";

        // Nombre del archivo de log por día
        $log_date = date('Y-m-d');
        $log_file = $this->log_dir . "$log_date.log";

        // Escribir en el archivo
        // El modo 'a' (append) asegura que se añada al final del archivo
        file_put_contents($log_file, $json_entry, FILE_APPEND | LOCK_EX);
    }
}

?>