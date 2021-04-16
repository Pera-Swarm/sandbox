import $ from 'dom7';
import Framework7 from 'framework7/bundle';

import App from '../app.f7.html';
import config, { getCredentials, saveConfig } from './config';

// Import F7 Styles
import 'framework7/framework7-bundle.css';
// import 'bootstrap';

import routes from './routes.js';
import index from './index.js';
import MQTTClient from './mqttClient.js';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
import { init } from '../css/index.css';

// import Routes
window.mqtt = new MQTTClient(config, () => {
    // $("#status").text("Trying to connect...");
    console.log('SHOW TOAST');
});

window.isAuthenticated =
    JSON.parse(localStorage.getItem(document.location.origin + '.isAuthenticated')) ||
    false;

// import main app component
var app = new Framework7({
    name: 'PeraSwarm Sandbox', // App name
    theme: 'md', // Automatic theme detection
    autoDarkTheme: false, // Automatic dark theme detection
    el: '#app', // App root element
    component: App, // App main component
    // App id
    id: 'pera.swarm.sandbox.test',
    // Enable swipe panel
    panel: {
        swipe: true
    },
    // App routes
    routes: routes,
    // Register service worker
    serviceWorker: {
        path: '/service-worker.js'
    }
});

export function setup(onConnectionCallback) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    let savedValue = JSON.parse(localStorage.getItem('isDarkTheme'));
    let value = prefersDarkScheme.matches;
    if (savedValue !== null) {
        value = savedValue;
    }
    toggleColorTheme(value);
    $('#theme-toggler').click(function () {
        value = !value;
        toggleColorTheme(value);
        localStorage.setItem('isDarkTheme', JSON.stringify(value));
    });
    getMQTTConfig();
    // console.log(getCredentials());
    $('#connect-button').on('click', () => {
        authenticate(onConnectionCallback);
    });
    $('#disconnect-button').on('click', () => {
        disconnect(onConnectionCallback);
    });
}

function toggleColorTheme(value) {
    if (value) {
        $('#app').addClass('theme-dark');
        $('#theme-toggler').html(`<i class="icon f7-icons">moon_fill</i>`);
    } else {
        $('#app').removeClass('theme-dark');
        $('#theme-toggler').html(`<i class="icon f7-icons">moon</i>`);
    }
}

function authenticate(onConnectionCallback) {
    console.log(config);
    const username = $('#mqtt-username').value();
    const password = $('#mqtt-password').value();
    console.log(username, password);
    testConnection(username, password, onConnectionCallback);
}

function testConnection(username, password, callback) {
    window.mqtt.client.connect({
        userName: username,
        password,
        reconnect: false,
        useSSL: true,
        keepAliveInterval: 360,
        cleanSession: false,

        onSuccess: () => {
            console.log('MQTT: connected');
            if (callback !== undefined) callback('MQTT Connection Successful!');
            window.mqtt.client.onMessageArrived = window.mqtt.onMessageArrived;
            window.mqtt.client.onConnectionLost = window.mqtt.onConnectionLost;
            persistConfig(true);
        },
        onFailure: () => {
            if (callback !== undefined) callback('MQTT Connection Failed!');
            console.log('MQTT: connection failed', callback);
        }
    });
}

function disconnect(callback) {
    window.mqtt.client.disconnect();
    setTimeout(() => {
        if (callback !== undefined) callback('MQTT Connection Close Successful!!');
        persistConfig(false, undefined);
    }, 3000);
}

function getMQTTConfig() {
    console.log(config, config || false);
}

function persistConfig(connectionStatus, token) {
    $('#status').value(connectionStatus);
    $('.btn').prop('disabled', false);
    const server = $('#mqtt_server').value();
    const port = Number($('#mqtt_port').value());
    const channel = $('#mqtt_channel').value();
    console.log({ server, port, channel, token });
    saveConfig({ server, port, channel, token });
    localStorage.setItem(
        document.location.origin + '.isAuthenticated',
        JSON.stringify(connectionStatus)
    );
}
