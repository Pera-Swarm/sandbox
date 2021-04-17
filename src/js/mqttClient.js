import MQTT from 'paho-mqtt';
import $ from 'jquery';
import { saveCache, getCredentials } from './config';
import store from './store/cache';

export default class MqttClient {
    constructor(config, callback) {
        const { server, port, path, channel, token } = config;
        const client_id = 'client_' + Math.random().toString(36).substring(2, 15);
        const { user, pass, host } = getCredentials();
        this.client = new MQTT.Client(server || host, port, path, client_id);
        this.channel = channel;
        window.mqtt = this.client;
        window.subList = {};

        if (
            JSON.parse(
                localStorage.getItem(document.location.origin + '.isAuthenticated')
            ) ||
            (false && user !== undefined && pass !== undefined)
        ) {
            this.client.connect({
                userName: user,
                password: pass,
                reconnect: false,
                useSSL: true,
                keepAliveInterval: 360,
                cleanSession: false,

                onSuccess: () => {
                    console.log('MQTT: connected');
                    store.dispatch('createToken');
                    this.client.onMessageArrived = this.onMessageArrived;
                    this.client.onConnectionLost = this.onConnectionLost;

                    $('#status').text('Connected');
                    $('.btn').prop('disabled', false);

                    if (callback !== undefined) {
                        callback();
                    }
                },
                onFailure: () => {
                    console.log('MQTT: connection failed');
                    $('#status').text('Disonnected');
                    $('.btn').prop('disabled', true);
                    if (callback !== undefined) {
                        callback();
                    }
                }
            });
        }
    }

    onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log('MQTT: onConnectionLost:' + responseObject.errorMessage);
            console.log('MQTT: reconnecting');
        }
    }

    subscribeToTopic(topic, callback) {
        if (topic !== '') {
            const t = this.channel + '/' + topic;

            window.subList[t] = callback;
            console.log('subscribed to ', t);
            this.client.subscribe(t);
            saveCache('cache', {
                topic: t,
                message: '-',
                type: 'sub',
                timestamp: new Date()
            });
        }
    }

    unsubscribe(topic) {
        this.client.unsubscribe(topic);
        const t = this.channel + '/' + topic;
        console.log('unsubscribed from', t);
        saveCache('cache', {
            topic: t,
            message: '-',
            type: 'unsub',
            timestamp: new Date()
        });
    }

    onMessageArrived(packet) {
        const msg = packet.payloadString.trim();
        const topic = packet.destinationName;
        const action = window.subList[topic];

        if (action !== undefined) {
            action(topic, msg);
            saveCache('cache', {
                topic,
                message: msg,
                type: 'in',
                timestamp: new Date()
            });
        }
    }

    publish(topic, message, callback) {
        if (topic !== '' && message !== '') {
            const pubTopic = this.channel + '/' + topic;
            var payload = new MQTT.Message(message);

            payload.destinationName = pubTopic;
            this.client.send(payload);
            console.log('MQTT: published', pubTopic, message);
            saveCache('cache', {
                topic: pubTopic,
                message,
                type: 'out',
                timestamp: new Date()
            });
            if (callback != null) callback();
        }
    }
}
