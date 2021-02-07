import $ from 'dom7';
import Framework7 from 'framework7/bundle';

// Import F7 Styles
import 'framework7/framework7-bundle.css';
// import 'bootstrap';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
import '../css/index.css';

// Import Routes
import routes from './routes.js';
import index from './index.js';
import MQTTClient from './mqttClient.js';

// Import main app component
import App from '../app.f7.html';

var app = new Framework7({
    name: 'PeraSwarm Sandbox', // App name
    theme: 'auto', // Automatic theme detection
    el: '#app', // App root element
    component: App, // App main component


    // App routes
    routes: routes,
    // Register service worker
    serviceWorker: {
        path: '/service-worker.js',
    },
});
