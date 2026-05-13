<?php

declare(strict_types=1);

namespace Project\Core;

/**
 * Aplica una encriptación de Dos Vías: AES-256-CBC
 * 
 * @method string encrypt($data) Encripta una cadena de texto
 * @method string decrypt($encrypted_data) Resuelve una cadena encriptada y la devuelve
 */
class AES256 {
    /**
     * Clave privada para encriptación
     * 
     * @var string 
     */
    private $key;

    /**
     * Algoritmo de encriptación
     * @var string
     */
    private $method = 'AES-256-CBC';

    /**
     * Inicializa la clase y encripta la clave privada
     * 
     * @param string $secret_key Clave privada
     */
    public function __construct(string $secret_key) {
        $this->key = hash('sha256', $secret_key, true); // 32 bytes
    }

    /**
     * Encripta una cadena de texto
     * 
     * @param string $data Datos a encriptar
     * @return string La cadena encriptada
     */
    public function encrypt($data) {
        $iv = openssl_random_pseudo_bytes(16);
        $encrypted = openssl_encrypt($data, $this->method, $this->key, OPENSSL_RAW_DATA, $iv);
        return base64_encode($iv . $encrypted);
    }

    /**
     * Resuelve una cadena encriptada y la devuelve
     * 
     * @param string $encrypted_data Datos a desencriptar
     * @return string La cadena desencriptada
     */
    public function decrypt($encrypted_data) {
        $decoded = base64_decode($encrypted_data);
        $iv = substr($decoded, 0, 16);
        $ciphertext = substr($decoded, 16);
        return openssl_decrypt($ciphertext, $this->method, $this->key, OPENSSL_RAW_DATA, $iv);
    }
}
