/**
 * Ejecuta un callback después de cargarse todos los elementos del DOM
 * 
 * @param {function} fn Callback a ejecutar
 */
function onDocumentReady(fn) {
    document.addEventListener('DOMContentLoaded', fn);
}

/**
 * Crea una cookie
 * 
 * @param {string} name Nombre de la cookie
 * @param {*} value Valor de la cookie
 * @param {object} options Opciones de configuración de la cookie
 */
function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        // Agregar otros valores predeterminados si es necesario
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

/**
 * Función para obtener el valor de una cookie por su nombre
 * 
 * @param {string} name Nombre de la cookie
 * @param {*} defaultValue Valor default a devolver si no se encuentra la cookie
 * @returns {*|null} Valor de la cookie o null si no se encuentra
 */
function getCookie(name, defaultValue = null) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';'); // Split the cookie string into an array of individual cookies
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') { // Remove leading whitespace
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) { // Check if this cookie starts with the desired name
            return decodeURIComponent(c.substring(nameEQ.length, c.length)); // Return the decoded value
        }
    }

    return defaultValue; // Return null if the cookie is not found
}

/**
 * Elimina una cookie por su nombre
 * 
 * @param {string} name Nombre de la cookie
 */
function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    });
}

/**
 * Borra todas las cookies
 */
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let name = cookie.split('=')[0];
        deleteCookie(name);
    }
}

/**
 * Devuelve la cantidad de elementos que contiene un objeto o un array
 * 
 * @param {object|array} obj Objeto o array a calcular total de elementos que contiene
 * @returns {number}
 */
function sizeof(obj) {
    const type = typeof obj;

    if(!['object', 'array'].includes(type)) {
        throw new Error(`The argument must be type "object" javascript, or "array". Catched "${type}"`);
    }

    return 'object' == type ? Object.keys(obj).length : obj.length;
}

/**
 * Define propiedades o funciones y las asigna al scope global de `window`
 * 
 * @param {array} properties Listado de propiedades o funciones a fijar a `window`
 */
function attachWindowProperties(properties) {
    const props = {};

    properties.forEach(prop => {
        props[prop.name] = { value: prop, writable:false }
    });

    Object.defineProperties(window, props);
}

/**
 * Define una propiedad o función y la asigna al scope global de `window`
 * 
 * @param {*} property Propiedad a asignar a `window`
 */
function attachWindowProperty(property) {
    Object.defineProperty('window', { value: property, writable: false });
}

/**
 * Verifica si un valor es undefined
 * 
 * @param {*} value  El valor a evaluar
 * @description Verifica si un valor es undefined
 * @returns  {boolean} true si el valor es undefined, false en caso contrario
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}

/**
 * Devuelve `true` si un valor es `null`, false en caso contrario
 * 
 * @param {*} value Valor a evaluar
 * @returns {boolean}
 */
function isNull(value) {
    return null === value;
}

/**
 * Elimina uno o más slashes finales de un string.
 * 
 * @param {string} str El string a limpiar.
 * @description Elimina uno o más slashes finales de un string.
 * @returns {string} El string sin slashes finales.
 */
function removeTrailingSlashes(str) {
    return str.replace(/\/+$/, '');
}

/**
 * Elimina uno o más slashes iniciales de un string.
 * 
 * @param {string} str El string a limpiar.
 * @description Elimina uno o más slashes iniciales de un string.
 * @returns {string} El string sin slashes iniciales.
 */
function removeLeadingSlashes(str) {
    return str.replace(/^\/+/, '');
}

/**
 * Limita la ejecución de una función a una vez en cada intervalo de tiempo especificado.
 * 
 * @param {function} func El callback del evento (event listener)
 * @param {number} limit El intervalo de ejecución del callback del evento en milisegundos
 * @returns {function} La función del throttle
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;

    return function() {
        const context = this, args = arguments;
        if(!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeOut(() => {
                if((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

/**
 * Retrasa la ejecución de una función hasta que el usuario deja de realizar una determinada acción durante un período de tiempo específico.
 * 
 * @param {function} func El callback del evento (event listener)
 * @param {number} delay El retraso de ejecución del callback en milisegundos
 * @returns {function} El callback del debounce
 */
function debounce(func, delay) {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

/**
 * Simula el comportamiento de useState de React, para manejar estados en aplicaciones JS.
 * 
 * @param {*} initialValue  Valor inicial del estado
 * @description Hook que simula el comportamiento de useState de React, para manejar estados en aplicaciones JS
 * @returns {array<function>} Un array con dos funciónes; una que devuelve un valor o estado actual y una función para actualizarlo
 * @example
 * const [count, setCount] = useState(0);
 * setCount(count() + 1); // Actualiza el estado
 * console.log(count()); // Imprime el valor actualizado
 */
function useState(initialValue) {
    let value = initialValue;

    const get = () => value;
    const set = (newValue) => {
        value = newValue;
    };

    return [get, set];
}

export { 
    attachWindowProperties,
    attachWindowProperty,
    debounce,
    deleteAllCookies,
    deleteCookie,
    getCookie, 
    isNull,
    isUndefined,
    onDocumentReady,
    removeLeadingSlashes,
    removeTrailingSlashes,
    setCookie,
    sizeof,
    throttle,
    useState,
};