import MQTTClient from './MqttClient';
import $ from "jquery";


$(document).ready(function () {
    mqtt = new MQTTClient(() => {
        // Active the buttons
        $('.btn').prop("disabled", false);

        $('#robot-id').change(function(){
            $('.robot-id').text(this.value)
        }).change();

        $('#red-bar').change(function (){
            $('#red-val').val(this.value);
            $('.red-val').text(this.value);
        }).change();
        $('#green-bar').change(function (){
            $('#green-val').val(this.value);
            $('.green-val').text(this.value);
        }).change();
        $('#blue-bar').change(function (){
            $('#blue-val').val(this.value);
            $('.blue-val').text(this.value);
        }).change();
        $('#amb-bar').change(function (){
            $('#amb-val').val(this.value);
            $('.amb-val').text(this.value);
        }).change();


        // Subscribe: v1/sensor/color
        mqtt.subscribeToTopic('sensor/color', (topic, msg) => {
            $('#color-sub-text').text(msg);
        });

        // Publish: sensor/color/{robotId}
        $('#color-btn-send-robot').click(function(){
            const robotId = $('#robot-id').val()
            const r = $('#red-bar').val();
            const g = $('#green-bar').val();
            const b = $('#blue-bar').val();
            const amb = $('#amb-bar').val();

            mqtt.publish(`sensor/color/${robotId}`, `${r} ${g} ${b} ${amb}`);
        });

        // Publish: sensor/color
        $('#color-btn-send-server').click(function(){
            const robotId = $('#robot-id').val()
            const r = $('#red-bar').val();
            const g = $('#green-bar').val();
            const b = $('#blue-bar').val();
            const amb = $('#amb-bar').val();
            const msgString = {id: robotId, R: r, G:g, B:b, ambient:amb};
            mqtt.publish(`sensor/color`,JSON.stringify(msgString));
        });

        // Publish: sensor/color/{robotId}/?
        $('#color-btn-req').click(function(){
            const robotId = $('#dist-req-id').val()
            mqtt.publish(`sensor/color/${robotId}/?`, '?');
        });

    });
});