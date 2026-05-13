/**
 * Clase para encriptación y desencriptación AES-256-CBC usando Web Crypto API.
 * Compatible con implementaciones OpenSSL en PHP (AES-256-CBC).
 * 
 * @class
 * @example
 * const aes = new AES256Web('mi_clave_secreta');
 * const encrypted = await aes.encrypt('Datos sensibles');
 * const decrypted = await aes.decrypt(encrypted);
 */
export default class AES256Web {
    /**
     * Crea una instancia de AES256Web.
     * 
     * @constructor
     * @param {string} secretKey - Clave secreta para derivar la clave AES-256.
     *                             Se recomienda mínimo 32 caracteres.
     * @property {Promise<CryptoKey>} keyPromise - Promesa que resuelve con la clave CryptoKey derivada.
     */
    constructor(secretKey) {
        this.keyPromise = this.importKey(secretKey);
    }

    /**
     * Importa y deriva una clave AES-256 desde una contraseña secreta usando SHA-256.
     * 
     * @private
     * @async
     * @param {string} secretKey - La contraseña o frase secreta para derivar la clave.
     * @returns {Promise<CryptoKey>} Promesa que resuelve con un objeto CryptoKey listo para usar.
     * @throws {Error} Si falla la derivación o importación de la clave.
     */
    async importKey(secretKey) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const hash = await crypto.subtle.digest('SHA-256', keyData);
        return await crypto.subtle.importKey(
            'raw', hash, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']
        );
    }

    /**
     * Encripta un mensaje de texto usando AES-256-CBC.
     * 
     * @async
     * @param {string} data - El texto plano a encriptar.
     * @returns {Promise<string>} Promesa que resuelve con el texto encriptado en Base64.
     *                            El resultado incluye el IV (16 bytes) al inicio.
     * @throws {Error} Si falla el proceso de encriptación.
     * @example
     * const encrypted = await aes.encrypt('Información confidencial');
     * console.log(encrypted); // "Base64String..."
     */
    async encrypt(data) {
        const key = await this.keyPromise;
        const iv = crypto.getRandomValues(new Uint8Array(16));
        const encoder = new TextEncoder();
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-CBC', iv }, key, encoder.encode(data)
        );
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);
        return btoa(String.fromCharCode(...combined));
    }

    /**
     * Desencripta un mensaje previamente encriptado con AES-256-CBC.
     * 
     * @async
     * @param {string} encryptedData - El texto encriptado en formato Base64.
     *                                 Debe incluir el IV al inicio (primeros 16 bytes).
     * @returns {Promise<string>} Promesa que resuelve con el texto plano desencriptado.
     * @throws {Error} Si falla el proceso de desencriptación o los datos son inválidos.
     * @example
     * const decrypted = await aes.decrypt('Base64String...');
     * console.log(decrypted); // "Información confidencial"
     */
    async decrypt(encryptedData) {
        const key = await this.keyPromise;
        const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        const iv = combined.slice(0, 16);
        const ciphertext = combined.slice(16);
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv }, key, ciphertext
        );
        return new TextDecoder().decode(decrypted);
    }
}

// ═══════════════════════════════════════════════════════════════
// Ejemplo de uso completo con manejo de errores
// ═══════════════════════════════════════════════════════════════
// (async () => {
//     try {
//         // 🔑 Inicializar con clave secreta (mínimo recomendada: 32 caracteres)
//         const aes = new AES256Web('mi_clave_secreta_muy_segura_12345');
        
//         // 🔐 Encriptar
//         const mensajeOriginal = 'Mensaje secreto';
//         const encrypted = await aes.encrypt(mensajeOriginal);
//         console.log('✅ Encriptado:', encrypted);
        
//         // 🔓 Desencriptar
//         const decrypted = await aes.decrypt(encrypted);
//         console.log('✅ Desencriptado:', decrypted);
        
//         // ✅ Verificar integridad
//         console.log('¿Coincide?', mensajeOriginal === decrypted); // true
        
//     } catch (error) {
//         console.error('❌ Error en operación criptográfica:', error.message);
//     }
// })();