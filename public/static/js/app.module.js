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
import api from './api.config.module.js';

api.get('/?count=5&lang=esp-mx').then(response => {
    console.table(response.data);
}).catch(error => {
    console.error('Error fetching user data:', error);
});

console.log('App.module.js loaded successfully');
