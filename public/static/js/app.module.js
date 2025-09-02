// filepath: /public/static/js/app.module.js

// From CDN
//import 'https://unpkg.com/axios@1.6.7/dist/axios.min.js';
//import 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js';
//import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js';
//import 'https://kit.fontawesome.com/7b35949868.js'

// From local third party libraries
import './axios/axios.min.js';
import './alpine/alpine.min.js';
import './bootstrap/bootstrap.bundle.min.js';

// custom modules
import { getCookie } from './utils.js';

// Crea una instancia de Axios y configura la URL base para las peticiones a la API
const api = axios.create({
    baseURL: getCookie('API_URL'),
    timeout: 10000, // Tiempo máximo de espera para una petición
});

// Por default se enviará el header 'X-Requested-With' en cada petición 
api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Desactiva el cache, lo que significa que las peticiones no se almacenarán en caché. 
// Garantiza que cada petición sea fresca desde el server.
/* api.defaults.headers.get = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
}; */

// y el Content-Type para peticiones POST
api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

api.get('/?count=5&lang=esp-mx').then(response => {
    console.table(response.data);
}).catch(error => {
    console.error('Error fetching user data:', error);
});

console.log('App.module.js loaded successfully');
