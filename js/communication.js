import MQTTClient from './MqttClient';
import $ from "jquery";


$(document).ready(function () {

    mqtt = new MQTTClient(() => {

        var comm_in_id = null;

        // Active the buttons
        $('.btn').prop("disabled", false);

        // Subscribe: v1/comm/out/simple
        mqtt.subscribeToTopic('comm/out/simple', (topic, msg) => {
            $('#com-out-simple').text(msg);
        });
        // Subscribe: v1/comm/out/directional
        mqtt.subscribeToTopic('comm/out/directional', (topic, msg) => {
            $('#com-out-directional').text(msg);
        });

        // Event listeners for select box updates
        $('#comm-out-protocol').change(function () {
            $('.com-out-protocol-lable').text(this.value);
        }).change();

        $('#robot-id').change(function () {
            const robotId = this.value;
            const topic = `comm/in/${robotId}`;

            if(comm_in_id != robotId && comm_in_id!==null){
                // unsubscribe from previous topic
                mqtt.unsubscribe(`comm/in/${comm_in_id}`);
            }
            mqtt.subscribeToTopic(topic, (topic, msg) => {
                $('#com-in-msg').text(msg);
                console.log(topic, ':', msg);
            });

            comm_in_id = robotId;
            $('.robot-id').text(robotId);

        }).change();

        $('#comm-out-msg').change(function () {
            $('.comm-msg').text(this.value);
        }).change();


        // Publish Button
        $('#comm-out-publish').click(function () {
            const robotId = $('#robot-id').val()
            const msg = $('#comm-out-msg').val();
            mqtt.publish(`comm/in/${robotId}`, msg);
        });

        // broadcast Button
        $('#comm-out-broadcast').click(function () {
            const robotId = $('#robot-id').val()
            const msg = $('#comm-out-msg').val();
            const msgProtocol = $('#comm-out-protocol').val();
            const msgString = {id: robotId, msg: msg};
            mqtt.publish(`comm/out/${msgProtocol}`, JSON.stringify(msgString));
        });





    });
});
