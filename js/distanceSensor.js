import MQTTClient from './MqttClient';
import $ from "jquery";


$(document).ready(function () {
    mqtt = new MQTTClient(() => {
        // Active the buttons
        $('.btn').prop("disabled", false);

        $('#robot-id').change(function(){
            $('.robot-id').text(this.value)
        }).change();

        $('#dist-bar').change(function (){
            $('#dist-val').val(this.value);
            $('.dist-val').text(this.value);
        }).change();

        // Subscribe: v1/sensor/distance
        mqtt.subscribeToTopic('sensor/distance', (topic, msg) => {
            $('#dist-sub-text').text(msg);
        });

        // Publish: sensor/distance/${robotId}/?
        $('#dist-btn-req').click(function(){
            const robotId = $('#robot-id').val()
            mqtt.publish(`sensor/distance/${robotId}/?`, '?');
        });

        // Publish: sensor/distance/${robotId}
        $('#dist-btn-send-robot').click(function(){
            const robotId = $('#robot-id').val()
            const distance = $('#dist-val').val()
            mqtt.publish(`sensor/distance/${robotId}`, distance);
        });

        // Publish: sensor/distance/
        $('#dist-btn-send-server').click(function(){
            const robotId = $('#robot-id').val()
            const distance = $('#dist-val').val()
            const msgString = {id: robotId, dist: distance};
            mqtt.publish('sensor/distance', JSON.stringify(msgString));
        });
    });
});
