import MQTTClient from './MqttClient';
import $ from "jquery";


$(document).ready(function () {

    mqtt = new MQTTClient(() => {

        // Active the buttons
        $('.btn').prop("disabled", false);

        // Event listener for RobotId on msg
        $('#robot-msg-id').change(function (){
            $('#robot-msg-id-lbl').text(this.value);
        }).change();

        // Event listeners for Range Sliders
        $('#robot-create-x-range').change(function (){
            $('#robot-create-x-val').val(this.value);
        }).change();
        $('#robot-create-y-range').change(function (){
            $('#robot-create-y-val').val(this.value);
        }).change();
        $('#robot-create-heading-range').change(function (){
            $('#robot-create-heading-val').val(this.value);
        }).change();

        // Event listeners for Text boxes
        $('#robot-create-x-val').change(function (){
            $('#robot-create-x-range').val(this.value);
        }).change();
        $('#robot-create-y-val').change(function (){
            $('#robot-create-y-range').val(this.value);
        }).change();
        $('#robot-create-heading-val').change(function (){
            $('#robot-create-heading-range').val(this.value);
        }).change();

        // Send Button
        $('#robot-msg-send-btn').click(function () {
            const robotId = $('#robot-msg-id').val()
            const msgString = $('#robot-msg-value').val();
            mqtt.publish(`robot/msg/${robotId}`, msgString);
        });

        // Broadcast Message
        $('#robot-msg-broadcast-btn').click(function () {
            const msgString = $('#robot-msg-value').val();

            if(msgString=='RESET -1'){
                // TODO: finalize this 
                console.log('send refresh request');
                mqtt.publish('management/visualizer/refresh', '?');
            }

            mqtt.publish('robot/msg/broadcast', msgString);
        });

        var  current_loc_id = undefined;
        $('#robot-localization-id').change(function () {
            const id = this.value;

            mqtt.unsubscribe(`localization/${current_loc_id}`);
            mqtt.subscribeToTopic(`localization/${id}`, (topic, msg) => {
                // Obtain the current coordinates and update the sliders
                const coord = msg.split(' ');
                $('#robot-create-x-val').val(coord[0]).change();
                $('#robot-create-y-val').val(coord[1]).change();
                $('#robot-create-heading-val').val(coord[2]).change();
            });
            mqtt.publish('localization', JSON.stringify({id: id}));

            current_loc_id = id;
        }).change();

        // Create Button
        $('#robot-btn-create').click(function () {
            const msg = {
                id: $('#robot-localization-id').val(),
                x: $('#robot-create-x-val').val(),
                y: $('#robot-create-y-val').val(),
                heading: $('#robot-create-heading-val').val(),
            };
            mqtt.publish('robot/create', JSON.stringify(msg));
        });

        // Update Button
        $('#robot-btn-update').click(function () {
            const msg = [{
                id: $('#robot-localization-id').val(),
                x: $('#robot-create-x-val').val(),
                y: $('#robot-create-y-val').val(),
                heading: $('#robot-create-heading-val').val(),
            }];
            mqtt.publish('localization/info', JSON.stringify(msg));
        });

        // Delete Button
        $('#robot-btn-delete').click(function () {
            const msg = {id: $('#robot-localization-id').val()};
            mqtt.publish('robot/delete', JSON.stringify(msg));
        });

    });
});
