/**
 * Representa la caché de datos
 * 
 * @class
 */
export default class CacheManager {
    /** @type {Object|null} */
    #axiosInstance

    /** @type {Boolean} */
    #axiosDataOnly

    /** @type {String} */
    #storageKey

    /** @type {Number} */
    #defaultTTL

    /**
     * @param {Object} [config] - (Opcional) Objeto de configuración opcional
     * @param {Object|null} [config.axiosInstance=null] - (Opcional) Instancia de axios configurada
     * @param {Boolean} [config.axiosDataOnly=false] - (Opcional) Especifica si devolver solamente los datos del response de Axios (Axios envuelve los datos en `.data`). Si es false devolverá todo.
     * @param {String} [config.storageKey='api_cache_data'] - (Opcional) Clave para localStorage (default: 'api_cache_data')
     * @param {Number} [config.defaultTTL=5] - (Opcional) Tiempo de vida en ms (default: 5 minutos)
     */
    constructor(config = {}) {
        const {
            axiosInstance = null,
            axiosDataOnly = false, // devuelve todo el response de Axios por defecto
            storageKey = 'api_cache_data',
            defaultTTL = 5 // 5 minutos por defecto
        } = config;

        this.#axiosInstance = axiosInstance;
        this.#axiosDataOnly = Boolean(axiosDataOnly);
        this.#storageKey = storageKey;
        this.#defaultTTL = parseInt(defaultTTL, 10) * 60 * 1000; // Convierte a milisegundos
    }

    /**
     * Obtiene los datos. Si no existen o han expirado, llama a la API.
     * 
     * @param {String} url - La URL de la API.
     * @param {Object} [options] - Objeto de configuracion opcional
     * @param {Boolean} [options.forceRefresh=false] - Si es `true`, ignora la caché y pide a la API.
     * @param {Number} [options.ttl=this.#defaultTTL] - Tiempo de vida personalizado para esta petición (opcional).
     * @param {String} [options.cacheKey=url] - Identificador para los datos de cache de esta petición
     */
    async getData(url, options = {}) {
        const {
            forceRefresh = false,
            ttl = this.#defaultTTL,
            cacheKey = url,
        } = options;
        const now = Date.now();
        
        // Intentar obtener de la caché si no se fuerza la actualización
        if (!forceRefresh) {
            const cachedData = this.#readFromCache(cacheKey);
            
            if (cachedData) {
                const isExpired = now > cachedData.timestamp + ttl;
                
                if (!isExpired) {
                    console.log('🟢 Datos obtenidos de la caché local');
                    return cachedData.data;
                } else {
                    console.log('⚠️ Caché expirada, actualizando...');
                }
            }
        }

        // Si no hay caché o está expirada, llamar a la API
        try {
            console.log('🔵 Realizando petición a la API...');
            let data;

            // --- LÓGICA CONDICIONAL: AXIOS VS FETCH ---
            if (this.#axiosInstance) {
                // Usar Axios
                const response = await this.#axiosInstance.get(url);
                data = this.#axiosDataOnly ? response.data : response; // Axios envuelve los datos en .data
            } else {
                // Usar Fetch nativo
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                data = await response.json();
            }
            // -------------------------------------------

            // Guardar en caché
            this.#saveToCache(cacheKey, data, now);
            
            return data;

        } catch (error) {
            console.error('❌ Error al obtener datos:', error.message);
            throw error;
        }
    }

    /**
     * Fuerza la actualización de los datos
     * 
     * @param {String} url - La URL de la API
     * @param {Number} [ttl=this.#defaultTTL] - Tiempo de vida personalizado para esta petición (opcional).
     */
    async refreshData(url, ttl = this.#defaultTTL) {
        return await this.getData(url, true, ttl);
    }

    /**
     * Borra un dato específico de la caché
     * 
     * @param {String} url - El índice a eliminar. Por default suele ser la url relacionada 
     * a los datos en caché, a menos que se especifique `cacheKey` en `CacheManager.getData`
     */
    invalidate(url) {
        const allCache = this.#getAllCache();
        delete allCache[url];
        localStorage.setItem(this.#storageKey, JSON.stringify(allCache));
        console.log('🗑️ Caché invalidada para:', url);
    }

    /**
     * Borra toda la caché
     */
    clearAll() {
        localStorage.removeItem(this.#storageKey);
        console.log('🧹 Toda la caché ha sido limpiada.');
    }

    // --- Métodos privados de utilidad ---

    /**
     * Recupera toda la caché
     * 
     * @private
     * @returns {Object}
     */
    #getAllCache() {
        const stored = localStorage.getItem(this.#storageKey);
        return stored ? JSON.parse(stored) : {};
    }

    /**
     * Recupera un dato específico desde caché
     * 
     * @private
     * @param {String} url La URL de la API
     * @returns {*}
     */
    #readFromCache(url) {
        const allCache = this.#getAllCache();
        return allCache[url] || null;
    }

    /**
     * Almacena datos en caché
     * 
     * @private
     * @param {String} url La URL de la API o un identificador
     * @param {*} data Datos a almacenar
     * @param {Number} timestamp Marca de fecha-hora de guardado de los datos
     */
    #saveToCache(url, data, timestamp) {
        const allCache = this.#getAllCache();
        allCache[url] = {
            data,
            timestamp: timestamp
        };
        localStorage.setItem(this.#storageKey, JSON.stringify(allCache));
    }
}