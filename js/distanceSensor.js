import MQTTClient from './MqttClient';
import $ from "jquery";


$(document).ready(function () {
    mqtt = new MQTTClient(() => {
        // Active the buttons
        $('.btn').prop("disabled", false);

        // Request: v1/sensor/distance/{robotId}/?

        $('#dist-req-id').change(function(){
            $('#dist-req-robot-id').text(this.value)
        }).change();
        $('#dist-request').click(function(){
            // publish to sensor/distance/${robotId}/?
            const robotId = $('#dist-req-id').val()
            mqtt.publish(`sensor/distance/${robotId}/?`, '?');
        });


        // Reply: v1/sensor/distance/{robotId}

        $('#dist-reply-id').change(function(){
            $('#dist-reply-robot-id').text(this.value)
        }).change();
        $('#dist-reply-btn').click(function(){
            // publish to sensor/distance/${robotId}
            const robotId = $('#dist-reply-id').val()
            const distance = $('#dist-reply-value').val()
            mqtt.publish(`sensor/distance/${robotId}`, distance);
        });

        // Subscribe: v1/sensor/distance
        $('#dist-sub-btn').click(function(){
            mqtt.subscribeToTopic('sensor/distance', (topic, msg) => {
              $('#dist-sub-text').text(msg);
            });
        });
        $('#dist-pub-btn').click(function(){
            const robotId = $('#dist-pub-id').val()
            const distance = $('#dist-pub-value').val()
            const msgString = {id: robotId, dist: distance};
            mqtt.publish('sensor/distance', JSON.stringify(msgString));
        });
    });
});
