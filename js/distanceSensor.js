import MQTTClient from './MqttClient';
import $ from "jquery";


$(document).ready(function () {
    mqtt = new MQTTClient(() => {
        // Active the buttons
        $('.btn').prop("disabled", false);


    });
});
