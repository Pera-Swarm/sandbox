import MQTTClient from './MqttClient';
import $ from "jquery";


$(document).ready(function () {

  mqtt = new MQTTClient(() => {

    // Active the buttons
    $('.btn').prop("disabled", false);

    // Event listener for RobotId on msg
    $('#robot-msg-id').change(function (){
        const oldId = $('#robot-msg-id-lbl').text();
        const newId = this.value;
        console.log(`robot-msg changed frpm ${oldId} to ${newId}`);

        // TODO: unsubscribe from previous topic if subscribed
      $('#robot-msg-id-lbl').text(newId);
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
      mqtt.publish('robot/msg/broadcast', msgString);
    });

    // Create Button
    $('#robot-btn-create').click(function () {
      const msg = {
        id: $('#robot-create-id').val(),
        x: $('#robot-create-x-val').val(),
        y: $('#robot-create-y-val').val(),
        heading: $('#robot-create-heading-val').val(),
      };
      const msgString = JSON.stringify(msg);
      mqtt.publish('robot/create', msgString);
    });

    // Update Button
    $('#robot-btn-update').click(function () {
      const msg = [{
        id: $('#robot-create-id').val(),
        x: $('#robot-create-x-val').val(),
        y: $('#robot-create-y-val').val(),
        heading: $('#robot-create-heading-val').val(),
      }];
      const msgString = JSON.stringify(msg);
      mqtt.publish('localization/info', msgString);
    });

    // Delete Button
    $('#robot-btn-delete').click(function () {
      const msg = {id: $('#robot-create-id').val()};
      const msgString = JSON.stringify(msg);
      mqtt.publish('robot/delete', msgString);
    });

  });
});
