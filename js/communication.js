import MQTTClient from './MqttClient';
import $ from "jquery";


$(document).ready(function () {

    mqtt = new MQTTClient(() => {

        // Active the buttons
        $('.btn').prop("disabled", false);

        // Event listeners for select box updates
        $('#comm-out-protocol').change(function () {
            $('.com-out-protocol-lable').text(this.value);
        }).change();

        $('#comm-in-id').change(function () {
            $('#com-out-robot-id').text(this.value);
        }).change();

        $('#comm-out-id').change(function () {
            $('#com-in-robot-id').text(this.value);
        }).change();

        // Publish Button
        $('#comm-out-publish').click(function () {
            const robotId = $('#comm-out-id').val()
            const msg = $('#comm-out-msg').val();
            mqtt.publish(`comm/in/${robotId}`, msg);
        });

        // broadcast Button
        $('#comm-out-broadcast').click(function () {
            const robotId = $('#comm-out-id').val()
            const msg = $('#comm-out-msg').val();
            const msgProtocol = $('#comm-out-protocol').val();
            const msgString = {id: robotId, msg: msg};
            mqtt.publish(`comm/out/${msgProtocol}`, JSON.stringify(msgString));
        });

        var comm_in_id = null;

        // Subscribe Button
        $('#comm-in-subscribe').click(function () {
            const robotId = $('#comm-in-id').val()
            const topic = `comm/in/${robotId}`;

            if(comm_in_id != robotId && comm_in_id!==null){
                // unsubscribe from previous topic
                mqtt.unsubscribe(`comm/in/${comm_in_id}`);
            }
            comm_in_id = robotId;
            mqtt.subscribeToTopic(topic, (topic, msg) => {
                $('#comm-in-text').text(msg);
                console.log(topic, ':', msg);
            });
        });
    });
});
