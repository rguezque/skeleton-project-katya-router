/**
 * Función para obtener el valor de una cookie por su nombre
 * 
 * @param {String} name Nombre de la cookie
 * @param {Any} defaultValue Valor default a devolver si no se encuentra la cookie
 * @returns {String|null} Valor de la cookie o null si no se encuentra
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

export { 
    getCookie, 
    isUndefined,
    removeLeadingSlashes,
    removeTrailingSlashes,
};