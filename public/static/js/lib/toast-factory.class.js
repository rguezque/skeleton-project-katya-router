/**
 * Sigue el patrón factory, para crear toasts que se eliminan del DOM al desaparecer de pantalla; utilizando la libreria Boostrap
 */
class ToastFactory {
    /**
     * Inicializa la creación de toasts
     * 
     * @param {string} containerId Nombre ID del contenedor de los toast generados (sin el simbolo # inicial)
     * @param {number} delay Tiempo en milisegundos para desvanecer los toasts, si se omite se asigna por default `5500`
     */
    constructor(containerId, delay = 5500) {
        this.containerId = containerId;
        this.delay = delay;
        this.types = ['primary', 'success', 'info', 'warning', 'danger', 'dark'];
    }

    /**
     * Crea un toast que se elimina del DOM despues del tiempo de espera especificado al crear la instancia de clase
     * 
     * @param {Object} options  Objeto JS con definición de argumentos del toast.
     * 
     * Donde:
     * - `title`: (Opcional) Define el texto de título del toast.
     * - `content`: Define el texto de contenido del toast.
     * - `type`: Es el tipo de toast, `primary`, `success`, `info`, `warning`, `danger`, `dark`.
     * - `delay`:  Tiempo en milisegundos para desvanecer y eliminar el toast. Solo aplica al toast actual. No modifica el delay global preestablecido.
     */
    create(options) {
        // Si se definió un atributo "title" es un toast completo, si no, se aplica estilos para toast mínimo
        const withTitle = options.hasOwnProperty('title');
        // Verifica si tiene el atributo "type", si no, se aplica "primary" por default. 
        // Si existe pero no es un tipo válido, tambien se asigna "primary" por default.
        const type = options.hasOwnProperty('type') ? (this.types.includes(options.type) ? options.type : 'primary') : 'primary';
        
        if(!options.hasOwnProperty('content')) {
            throw new Error('Argumentos insuficientes. No se definió la clave "content" con el mensaje del toast.');
        }

        const toastContainer = document.getElementById(this.containerId);
        const toastElement = document.createElement('div');
        const uuid = crypto.randomUUID();
        const delay = options.delay || this.delay || 5500;
    
        toastElement.classList.add('toast', `text-bg-${type}`, 'z-index-9999');
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('id', uuid);
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        toastElement.setAttribute('data-bs-delay', delay);
    
        const fullContent = [
            '<div class="toast-header">',
            `<strong class="me-auto">${options.title}</strong>`,
            '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>',
            '</div>',
            '<div class="toast-body">',
            options.content,
            '</div>',
        ].join('');

        const minimalContent = [
            '<div class="d-flex">',
            '<div class="toast-body">',
            options.content,
            '</div>',
            '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>',
            '</div>',
        ].join('');

        toastElement.innerHTML = withTitle ? fullContent : minimalContent;
    
        toastContainer.append(toastElement);
    
        const getToast = document.getElementById(uuid);
        const toast = new bootstrap.Toast(getToast);
        toast.show();
    
        // Elimina el toast para evitar sobrecarga de apilamiento en el DOM. 
        // Se agrega medio segundo para dar tiempo al efecto de desvanecimiento que aplica bootstrap.
        setTimeout(() => {
            getToast.remove()
        }, delay+500);
    }

    /**
     * Crea un contenedor para los toasts y lo agrega en el DOM como un `lastChild` de `body`. 
     * Devuelve el objeto creado para permitir asignarle atributos.O bien se puede enviar un 
     * objeto con defnición de atributos a aplicar
     * 
     * @param {object} attrs Un objeto JS con definición de atributos a aplicar al contenedor de los toasts
     * @returns {HTMLDivElement} El objeto html creado
     */
    createContainer(attrs = {}) {
        const toastContainer = document.createElement('div');
        toastContainer.setAttribute('class', 'toast-container position-fixed bottom-0 end-0 p-3');
        toastContainer.setAttribute('id', this.containerId);
        if(0 !== Object.keys(attrs).length) {
            for(const [prop, value] of Object.entries(attrs)) {
                toastContainer.setAttribute(prop, value);
            }
        }
        document.body.appendChild(toastContainer);
        return toastContainer;
    }
}

export default ToastFactory;