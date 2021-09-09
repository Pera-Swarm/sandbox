import $ from 'dom7';
import * as _ from 'lodash';
import Framework7 from 'framework7/bundle';

import App from '../app.f7.html';
// import config, { getCredentials, saveConfig } from './config';

// Import F7 Styles
import 'framework7/framework7-bundle.css';
// import 'bootstrap';

import routes from './routes.js';
import MQTTClient from './mqttClient.js';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
import { init } from '../css/index.css';

// logs store
import store from './store';
const config = store.getters.config.value;

// new mqtt client
window.mqtt = new MQTTClient(config, () => {
    // $("#status").text("Trying to connect...");
    // console.log('SHOW TOAST');
});

window.isAuthenticated =
JSON.parse(localStorage.getItem(document.location.origin + '.isAuthenticated')) ||
false;

// Added patch by Nuwan, to fix a bug
// if(window.isAuthenticated){
const storedConfig = JSON.parse(
    localStorage.getItem(document.location.origin + '.config')
);

try {
    window.password = storedConfig.password;
    window.username = storedConfig.username;
} catch (e) {
    console.error(e);
}


// import main app component
var app = new Framework7({
    name: 'PeraSwarm Sandbox', // App name
    theme: 'md', // Automatic theme detection
    autoDarkTheme: true, // Automatic dark theme detection
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
    // App stores,
    store,
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
        // Nuwan: Simple Fix to update issue
        authenticate(function () {
            // console.log('callback');
            // window.location.reload();
            alert('Connected');

            // TODO: Connection button should be updated
        });
    });

    // Patch by Nuwan to fix errors
    $('.disconnect-button-cls').on('click', () => {
        disconnect(onConnectionCallback);
    });
    // $('#disconnect-button').on('click', () => {
    //     disconnect(onConnectionCallback);
    // });
    $('#settings-popup-save-button').on('click', () => {
        changeConfig(onConnectionCallback);
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
    // console.log(config);
    const username = $('#mqtt-username').value();
    const password = $('#mqtt-password').value();

    window.username = username;
    window.password = password;
    connectMQTT(username, password, onConnectionCallback);
}

function reauthenticate(updatedConfig, onConnectionCallback) {
    const selectedConfig = localStorage.getItem(document.location.origin + '.config');
    const username = $('#mqtt-username').value();
    const password = $('#mqtt-password').value();

    window.username = username;
    window.password = password;

    window.mqtt = new MQTTClient(selectedConfig, () => {
        console.log('SHOW TOAST 2');
    });
    connectMQTT(username, password, onConnectionCallback);
}

function connectMQTT(username, password, callback) {
    window.mqtt.client.connect({
        userName: username,
        password: password,
        reconnect: false,
        useSSL: true,
        keepAliveInterval: 360,
        cleanSession: false,

        onSuccess: () => {
            // console.log('MQTT: connected');
            window.mqtt.client.onMessageArrived = window.mqtt.onMessageArrived;
            window.mqtt.client.onConnectionLost = window.mqtt.onConnectionLost;
            store.dispatch('createToken');
            persistConfig(true);

            // alert('connected');
            if (callback !== undefined) callback('MQTT Connection Successful!');
        },
        onFailure: () => {
            console.log('MQTT: connection failed', username, password, '-');
            persistConfig(false);
            if (callback !== undefined) callback('MQTT Connection Failed!');
        }
    });
}

function disconnect(callback) {
    try {
        window.mqtt.client.disconnect();
    } catch (error) {
        console.error(error);
    }

    // Added patch by Nuwan to fix errors
    // alert('Disconnecting...');
    window.isAuthenticated = false;
    localStorage.setItem(document.location.origin + 'isAuthenticated', false);

    setTimeout(() => {
        if (callback !== undefined) callback('MQTT Connection Close Successful!!');
        persistConfig(false);
        window.location.reload();
    }, 1000);
}

function changeConfig(onConnectionCallback) {
    const updatedConfig = localStorage.getItem(document.location.origin + '.config');
    // console.log('changeConfig', updatedConfig);
    persistConfig(false);
    if (window.isAuthenticated) disconnect(onConnectionCallback);
    reauthenticate(updatedConfig, onConnectionCallback);
}

function getMQTTConfig() {
    // console.log(config, config || false);
}

function persistConfig(connectionStatus, token) {
    // $('#status').value(connectionStatus);
    $('.btn').prop('disabled', false);

    const server = $('#mqtt_server').value();
    const port = Number($('#mqtt_port').value());
    const channel = $('#mqtt_channel').value();
    const popUpServer = $('#input-server').value();
    const popUpPort = Number($('#input-port').value());
    const popUpChannel = $('#input-channel').value();

    // no need to change client id since it's automatically generated
    // const clientId = $('#input-client-id').value();

    const changedConfig = {
        server: _.isEqual(server, popUpServer) ? server : popUpServer,
        port: _.isEqual(port, popUpPort) ? port : popUpPort,
        channel: _.isEqual(channel, popUpChannel) ? channel : popUpChannel,
        username: window.username,
        password: window.password,
        path: '/mqtt'
    };
    if (!!token) changedConfig['token'] = token;

    // store.dispatch('saveConfig', changedConfig);
    localStorage.setItem(
        document.location.origin + '.isAuthenticated',
        JSON.stringify(connectionStatus)
    );
    localStorage.setItem(
        document.location.origin + '.config',
        JSON.stringify(changedConfig)
    );

    window.isAuthenticated = connectionStatus;
}
