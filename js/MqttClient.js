import MQTT from 'paho-mqtt';
import $ from 'jquery';

export default class MqttClient {
    constructor(callback) {
        const mqtt_server = process.env.MQTT_HOST;
        const mqtt_port = 8883;
        const mqtt_path = process.env.MQTT_PATH;
        const client_id = 'client_' + Math.random().toString(36).substring(2, 15);
        this.client = new MQTT.Client(mqtt_server, mqtt_port, mqtt_path, client_id);
        this.channel = 'v1';

        $('#status').text('Trying to connect...');
        window.mqtt = this.client;
        window.subList = {};

        this.client.connect({
            userName: process.env.MQTT_USER,
            password: process.env.MQTT_PASS,
            reconnect: false,
            useSSL: true,
            keepAliveInterval: 360,
            cleanSession: false,

            onSuccess: () => {
                console.log('MQTT: connected');

                this.client.onMessageArrived = this.onMessageArrived;
                this.client.onConnectionLost = this.onConnectionLost;

                $('#status').text('Connected');

                if (callback !== undefined) {
                    callback();
                }
            },
            onFailure: () => {
                console.log('MQTT: connection failed');
            }
        });
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
        }
    }

    unsubscribe(topic) {
        this.client.unsubscribe(topic);
        const t = this.channel + '/' + topic;
        console.log('unsubscribed from', t);
    }

    onMessageArrived(packet) {
        const msg = packet.payloadString.trim();
        const topic = packet.destinationName;
        const action = window.subList[topic];

        if (action !== undefined) {
            action(topic, msg);
        }
    }

    publish(topic, message, callback) {
        // TODO: call this.publish_channel(...)

        if (topic !== '' && message !== '') {
            const pubTopic = this.channel + '/' + topic;
            let payload = new MQTT.Message(message);

            payload.destinationName = pubTopic;
          
            // TODO: temp, apply to all messages
            paylod.qos = 1;
          
            this.client.send(payload);
            console.log('MQTT: published', pubTopic, message);

            if (callback != null) callback();
        }
    }

    publish_channel(channel, topic, message, callback) {
        //console.log(topic, message);

        if (topic !== '' && message !== '') {
            const pubTopic = channel + '/' + topic;
            let payload = new MQTT.Message(message);

            payload.destinationName = pubTopic;
            this.client.send(payload);
            console.log('MQTT: published', pubTopic, message);

            if (callback != null) callback();
        }
    }
}
