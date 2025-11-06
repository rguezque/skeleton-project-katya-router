import { getCookie } from './utils.module.js';
import './axios/axios.min.js';

// Crea una instancia de Axios y configura la URL base para las peticiones a la API
const api = axios.create({
    baseURL: getCookie('API_URL'),
    timeout: 10000, // Tiempo máximo de espera para una petición
});

// Por default se enviará el header 'X-Requested-With' en cada petición 
api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
api.defaults.headers.common['Authorization'] = `Bearer ${getCookie('API_TOKEN')}`;
// y el Content-Type para peticiones POST
api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Desactiva el cache, lo que significa que las peticiones no se almacenarán en caché. 
// Garantiza que cada petición sea fresca desde el server.
/* api.defaults.headers.get = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
}; */

export default api;