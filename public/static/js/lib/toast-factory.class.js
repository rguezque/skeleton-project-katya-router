/**
 * Factory para crear toasts de Bootstrap que se auto-eliminan del DOM.
 * @class
 */
export default class ToastFactory {
    /** @type {String} */
    #containerId;

    /** @type {Number} */
    #delay;

    /** @type {Set<String>} */
    #validTypes;

    /**
     * Inicializa la fábrica de toasts.
     * @param {String} containerId - ID del contenedor (sin #).
     * @param {Number} [delay=5500] - Duración en ms antes de ocultar el toast.
     */
    constructor(containerId, delay = 5500) {
        this.#containerId = containerId;
        this.#delay = Number.parseInt(delay, 10) || 5500;
        this.#validTypes = new Set(['primary', 'success', 'info', 'warning', 'danger', 'dark']);
    }

    /**
     * Crea y muestra un toast.
     * @param {Object} options - Configuración del toast.
     * @param {String} [options.title] - Título opcional.
     * @param {String} options.content - Contenido principal (requerido).
     * @param {String} [options.type='primary'] - Tipo visual del toast.
     * @param {Number} [options.delay] - Duración específica para este toast.
     * @throws {Error} Si `content` no es válido.
     */
    create({ title = '', content, type = 'primary', delay = this.#delay } = {}) {
        if (typeof content !== 'string' || content.trim() === '') {
            throw new Error('ToastFactory.create(): "content" es requerido y debe ser un string no vacío.');
        }

        const toastType = this.#sanitizeType(type);
        const toastDelay = Number.parseInt(delay, 10) || this.#delay;
        const withTitle = title.trim() !== '';

        const toastElement = this.#buildToastElement(toastType, withTitle, toastDelay);
        this.#populateToastContent(toastElement, title.trim(), content.trim(), withTitle);

        const container = this.#getOrCreateContainer();
        container.appendChild(toastElement);

        this.#showAndAutoRemove(toastElement, toastDelay);
    }

    /**
     * Valida y normaliza el tipo de toast.
     * @param {String} type - Tipo propuesto.
     * @returns {String} Tipo válido o 'primary' por defecto.
     */
    #sanitizeType(type) {
        const normalized = String(type).trim().toLowerCase();
        return this.#validTypes.has(normalized) ? normalized : 'primary';
    }

    /**
     * Crea la estructura base del elemento toast.
     * @param {String} type - Tipo visual.
     * @param {Boolean} withTitle - Si incluye header.
     * @param {Number} delay - Duración en ms.
     * @returns {HTMLDivElement}
     */
    #buildToastElement(type, withTitle, delay) {
        const el = document.createElement('div');
        el.className = `toast text-bg-${type} z-index-9999`;
        el.setAttribute('role', 'alert');
        el.setAttribute('aria-live', 'assertive');
        el.setAttribute('aria-atomic', 'true');
        el.dataset.bsDelay = delay;
        return el;
    }

    /**
     * Inserta el contenido de forma segura (previene XSS).
     * @param {HTMLDivElement} toastElement 
     * @param {String} title 
     * @param {String} content 
     * @param {Boolean} withTitle 
     */
    #populateToastContent(toastElement, title, content, withTitle) {
        if (withTitle) {
            const header = document.createElement('div');
            header.className = 'toast-header';
            
            const strong = document.createElement('strong');
            strong.className = 'me-auto';
            strong.textContent = title;
            
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'btn-close';
            closeBtn.dataset.bsDismiss = 'toast';
            closeBtn.setAttribute('aria-label', 'Close');
            
            header.appendChild(strong);
            header.appendChild(closeBtn);
            toastElement.appendChild(header);
        } else {
            toastElement.classList.add('d-flex', 'align-items-start');
        }

        const body = document.createElement('div');
        body.className = 'toast-body';
        body.textContent = content;
        
        if (!withTitle) {
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'btn-close btn-close-white me-2 m-auto';
            closeBtn.dataset.bsDismiss = 'toast';
            closeBtn.setAttribute('aria-label', 'Close');
            toastElement.appendChild(body);
            toastElement.appendChild(closeBtn);
        } else {
            toastElement.appendChild(body);
        }
    }

    /**
     * Obtiene o crea el contenedor de toasts.
     * @returns {HTMLDivElement}
     */
    #getOrCreateContainer() {
        let container = document.getElementById(this.#containerId);
        if (!container) {
            container = this.createContainer();
        }
        return container;
    }

    /**
     * Muestra el toast y lo elimina automáticamente tras la animación.
     * @param {HTMLDivElement} element 
     * @param {Number} delay 
     */
    #showAndAutoRemove(element, delay) {
        const bsToast = new bootstrap.Toast(element, { delay });
        bsToast.show();
        element.addEventListener('hidden.bs.toast', () => element.remove(), { once: true });
    }

    /**
     * Crea y agrega el contenedor de toasts al DOM si no existe.
     * @param {Record<String, String>} [attrs] - Atributos adicionales.
     * @returns {HTMLDivElement}
     */
    createContainer(attrs = {}) {
        let container = document.getElementById(this.#containerId);
        if (container) return container;

        container = document.createElement('div');
        container.id = this.#containerId;
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';

        for (const [key, value] of Object.entries(attrs)) {
            container.setAttribute(key, value);
        }

        document.body.appendChild(container);
        return container;
    }

    /* ─────────────────────────────────────────────────────────────
     *  BLOQUE DE INICIALIZACIÓN ESTÁTICO (ES2022)
     *  Genera dinámicamente los métodos shortcut dentro de la clase
     * ───────────────────────────────────────────────────────────── */
    static {
        const shortcutTypes = ['success', 'info', 'warning', 'danger', 'dark'];
        
        for (const type of shortcutTypes) {
            // `this` aquí se refiere a la clase ToastFactory
            this.prototype[type] = function(options = {}) {
                return this.create({ ...options, type });
            };
        }
    }
}