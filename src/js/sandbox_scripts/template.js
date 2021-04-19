// import MQTTClient from '../mqttClient';
import $ from 'jquery';

export function setup() {
    console.log('Setup: Template');

    $('.btn').prop('disabled', false);
    $('.channel').text(window.mqtt.channel);
}
