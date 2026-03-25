// filepath: /public/static/js/utils.module.js
// Aqui se definen utilidades que ayudan en el desarrollo del proyecto

/**
 * Ejecuta un callback después de cargarse todos los elementos del DOM
 * 
 * @param {Function} fn Callback a ejecutar
 */
function onDocumentReady(fn) {
    document.addEventListener('DOMContentLoaded', fn);
}

/**
 * Objeto JS que contiene propiedades para manejo de cookies
 */
const cookieStorage = Object.freeze({
    /**
     * Crea una cookie
     * 
     * @param {String} name Nombre de la cookie
     * @param {*} value Valor de la cookie
     * @param {object} options Opciones de configuración de la cookie
     */
    set: function (name, value, options = {}) {
        options = {
            path: '/',
            SameSite: 'Strict',
            Secure: true,
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
    },

    /**
     * Función para obtener el valor de una cookie por su nombre
     * 
     * @param {String} name Nombre de la cookie
     * @param {*} defaultValue Valor default a devolver si no existe la cookie
     * @returns {*} Valor por defecto si no existe la cookie
     */
    get: function (name, defaultValue = null) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';'); // Split the cookie string into an array of individual cookies
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            c = c.trimStart(); // Remove leading whitespace

            if (c.indexOf(nameEQ) === 0) { // Check if this cookie starts with the desired name
                return decodeURIComponent(c.substring(nameEQ.length, c.length)); // Return the decoded value
            }
        }

        return defaultValue; // Return null if the cookie is not found
    },

    /**
     * Elimina una cookie específica por su nombre.
     * @param {String} name - El nombre de la cookie a eliminar.
     * @param {String} [path='/'] - La ruta (path) de la cookie. Por defecto es '/', que cubre la mayoría de las cookies.
     * @param {String} [domain] - El dominio de la cookie. Opcional.
     */
    remove: function (name, path = '/', domain) {
        // Para eliminar la cookie, la establecemos con una fecha de expiración 
        // en el pasado (por ejemplo, el 1 de enero de 1970).
        let cookieString = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;Max-Age=-99999999;path=' + path;

        // Si se proporciona un dominio, lo añadimos.
        if (domain) {
            cookieString += ';domain=' + domain;
        }

        // Sobrescribir la cookie, forzando al navegador a eliminarla.
        document.cookie = cookieString;
    },

    /**
     * Elimina todas las cookies del navegador.
     * Nota: Solo puede eliminar cookies para el dominio y la ruta actual, 
     * y si no están marcadas como HttpOnly.
     */
    clear: function () {
        // Obtener todas las cookies como una sola cadena.
        const cookies = document.cookie.split(';');

        // Iterar sobre cada cookie.
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            // Quitar espacios en blanco al inicio.
            const eqPos = cookie.indexOf('=');
            // Obtener solo el nombre de la cookie.
            const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

            // Establecer la fecha de expiración en el pasado.
            // Esto hace que el navegador elimine la cookie.
            // Se establecen la ruta ('/') y el dominio para asegurar la eliminación.
            this.remove(name, '/', location.hostname);

            // **Consideración adicional:** A veces, las cookies pueden haber sido 
            // establecidas sin la ruta ('/') o con un subdominio específico.
            // Esta línea intenta eliminarlas en la ruta actual si la anterior falla.
            this.remove(name, '/');
        }
    }

});

/**
 * Devuelve la cantidad de elementos que contiene un objeto o un array
 * 
 * @param {Object|Array} obj Objeto o array a calcular total de elementos que contiene
 * @returns {Number}
 */
function sizeof(obj) {
    const type = typeof obj;

    if (!['object', 'array'].includes(type)) {
        throw new Error(`The argument must be type "object" javascript, or "array". Catched "${type}"`);
    }

    return 'object' == type ? Object.keys(obj).length : obj.length;
}

/**
 * Define propiedades o funciones y las asigna al scope global de `window`
 * 
 * @param {Array} properties Listado de propiedades o funciones a fijar a `window`
 */
function attachWindowProperties(properties) {
    const props = {};

    properties.forEach(prop => {
        props[prop.name] = { value: prop, writable: false }
    });

    Object.defineProperties(window, props);
}

/**
 * Define una propiedad o función y la asigna al scope global de `window`
 * 
 * @param {*} property Propiedad a asignar a `window`
 */
function attachWindowProperty(property) {
    Object.defineProperty(window, property.name, { value: property, writable: false });
}

/**
 * Verifica si un valor es undefined
 * 
 * @param {*} value  El valor a evaluar
 * @description Verifica si un valor es undefined
 * @returns  {Boolean} true si el valor es undefined, false en caso contrario
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}

/**
 * Devuelve `true` si un valor es `null`, false en caso contrario
 * 
 * @param {*} value Valor a evaluar
 * @returns {Boolean}
 */
function isNull(value) {
    return null === value;
}

/**
 * Devuelve `true` si un valor está vacío, `false` en caso contrario
 * 
 * @param {*} value El valor a evaluar
 * @returns {Boolean}
 */
function isEmpty(value) {
    // Verifica si es null o undefined (los más sencillos)
    if (isNull(value) || isUndefined(value)) {
        return true;
    }

    // Verifica si es una cadena (string) y está vacía
    if (typeof value === 'string') {
        // Trim para considerar espacios en blanco como "vacío"
        return value.trim().length === 0;
    }

    // Verifica si es un array y está vacío
    if (Array.isArray(value)) {
        return value.length === 0;
    }

    // Verifica si es un objeto y no tiene propiedades propias
    // NOTA: Esto excluye fechas, regex, etc., que son objetos pero se tratan de otra forma.
    if (typeof value === 'object' && value !== null) {
        // Usa Object.keys para obtener un array de las propiedades del objeto.
        return Object.keys(value).length === 0;
    }

    // Si pasa todas las comprobaciones anteriores, no se considera "vacío"
    return false;
}

/**
 * Elimina uno o más slashes finales de un string.
 * 
 * @param {String} str El string a limpiar.
 * @description Elimina uno o más slashes finales de un string.
 * @returns {String} El string sin slashes finales.
 */
function removeTrailingSlashes(str) {
    return str.replace(/\/+$/, '');
}

/**
 * Elimina uno o más slashes iniciales de un string.
 * 
 * @param {String} str El string a limpiar.
 * @description Elimina uno o más slashes iniciales de un string.
 * @returns {String} El string sin slashes iniciales.
 */
function removeLeadingSlashes(str) {
    return str.replace(/^\/+/, '');
}

/**
 * Limita la ejecución de una función a una vez en cada intervalo de tiempo especificado.
 * 
 * @param {Function} func El callback del evento (event listener)
 * @param {Number} limit El intervalo de ejecución del callback del evento en milisegundos
 * @returns {Function} La función del throttle
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;

    return function () {
        const context = this, args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeOut(() => {
                if ((Date.now() - lastRan) >= limit) {
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
 * @param {Function} func El callback del evento (event listener)
 * @param {Number} delay El retraso de ejecución del callback en milisegundos
 * @returns {Function} El callback del debounce
 */
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

/**
 * Simula el comportamiento de useState de React, para manejar estados en aplicaciones JS.
 * 
 * @param {*} initialValue  Valor inicial del estado
 * @description Hook que simula el comportamiento de useState de React, para manejar estados en aplicaciones JS
 * @returns {Array<Function>} Un array con dos funciónes; una que devuelve un valor o estado actual y una función para actualizarlo
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

/**
 * Ejecuta una secuencia de funciones en pipeline sobre un valor específico
 * 
 * @param  {Function[]} fns Listado de funciones a ejecutar en pipeline
 * @returns {*} El resultado de las funciones
 */
const pipe = (...fns) => initialValue => fns.reduce((acc, fn) => fn(acc), initialValue);

/**
 * Convierte una cadena de texto a formato de mayúscula inicial
 * 
 * @param {String} str La palabra a capitalizar
 * @returns {String}
 */
function capitalize(str) {
    // Verifica si la cadena es nula o vacía para evitar errores.
    if (!str) {
        return "";
    }

    // Obtiene la primera letra y la convierte a mayúscula.
    const capitalLetter = str.charAt(0).toUpperCase();

    // Obtiene el resto de la cadena (desde el índice 1)
    // y la une con la primera letra en mayúscula.
    const textBody = str.slice(1);

    return capitalLetter.concat(textBody);
}

/**
 * Agrega múltiples nodos hijos a un nodo padre.
 *
 * @param {HTMLElement} parentNode El nodo padre al que se agregarán los hijos.
 * @param {Node[]} childNodesArray Un array de nodos (HTMLElement, Text, etc.) a agregar.
 */
function appendChildren(parentNode, childNodesArray) {
    if (!(parentNode instanceof Node)) {
        throw new Error(`[appendChildren] The first argument must be a valid parent node. Catched ${typeof parentNode}`);
    }

    if (!Array.isArray(childNodesArray)) {
        throw new Error(`[appendChildren] The second argument must be a nodes array. Catched ${typeof childNodesArray}`);
    }

    // Usamos DocumentFragment para una inserción más eficiente (menor reflow/repaint)
    const fragment = document.createDocumentFragment();

    // Agrega todos los nodos del array al DocumentFragment
    childNodesArray.forEach(node => {
        // Verificación opcional para asegurar que es un nodo válido antes de agregarlo
        if (node instanceof Node) {
            fragment.appendChild(node);
        } else {
            const warnmsg = `[appendChildren] A non-node element was found in the array and was omitted:`;
            console.warn(warnmsg, node);
        }
    });

    // Agrega el DocumentFragment al nodo padre
    // Esta es una sola operación de inserción en el DOM real.
    parentNode.appendChild(fragment);
    return true;
}

/**
 * Copia al clipboard el texto del elemento con el ID especificado
 * @param {String} targetId El ID del HTMLElement objetivo
 */
async function clipboardWriteText(targetId) {
    const content = document.getElementById(targetId);
    await navigator.clipboard.writeText(content.textContent);
}

// Definimos el formateador PARA `Intl.DateTimeFormat` fuera para reutilizarlo y ganar velocidad
const DEFAULT_DATETIME_OPTIONS = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
};

/**
 * Transforma un timestamp (segundos) a un formato legible.
 * 
 * @param {Number} timestamp - Tiempo en segundos.
 * @param {String} locale - Localización (ej. 'es-MX').
 * @param {String} timeZone - Zona horaria (ej. 'America/Mexico_City').
 * @returns {String} La fecha legible
 */
function humanReadableDate(timestamp, locale = 'es-MX', timeZone = 'America/Mexico_City') {
    // Validación básica
    if (!timestamp || isNaN(timestamp)) {
        return "Fecha no válida";
    }

    try {
        const date = new Date(timestamp * 1000);

        // Usamos Intl de forma dinámica pero eficiente
        return new Intl.DateTimeFormat(locale, {
            ...DEFAULT_DATETIME_OPTIONS,
            timeZone
        }).format(date);
    } catch (error) {
        console.error("Error al formatear la fecha:", error);
        return "Error de formato";
    }
}

/**
 * Coloca el focus en el primer elemento (`input`, `select` o `textarea`) dentro de un formulario
 * 
 * @param {HTMLFormElement} form Formulario a inspeccionar
 * @throws {TypeError} Cuando el argumento enviado no es un formulario
 */
function focusOnFirst(form) {
    if(!form instanceof HTMLFormElement) {
        throw new TypeError('[function:focusOnFirst] El argumento recibido no es un formulario.');
    }
    const firstInput = form.querySelector('input, select, textarea');
    if (firstInput) {
        firstInput.focus();
    }
}

export {
    appendChildren,
    attachWindowProperties,
    attachWindowProperty,
    capitalize,
    clipboardWriteText,
    cookieStorage,
    debounce,
    focusOnFirst,
    humanReadableDate,
    isEmpty,
    isNull,
    isUndefined,
    onDocumentReady,
    pipe,
    removeLeadingSlashes,
    removeTrailingSlashes,
    sizeof,
    throttle,
    useState,
};