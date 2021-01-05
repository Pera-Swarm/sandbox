import MQTTClient from './MqttClient';
import $ from "jquery";

var channel = 'v1';

$(document).ready(function () {

  $('.channel').text(channel);

  // Disable all buttons by default
  $('.btn').prop("disabled", true);
  window.$ = $;

  mqtt = new MQTTClient(() => {
    // Add the topics to be subscribe with their actions here

    // Active the buttons
    $('.btn').prop("disabled", false);


    $('#comm-out-publish').click(function () {
      const robotId = $('#comm-out-id').val()
      const msg = $('#comm-out-msg').val();
      mqtt.publish(`comm/in/${robotId}`, msg);
    });

    $('#comm-out-broadcast').click(function () {
      const robotId = $('#comm-out-id').val()
      const msg = $('#comm-out-msg').val();
      const msgProtocol = $('#comm-out-protocol').val();
      const msgString = {id: robotId, msg: msg};
      mqtt.publish(`comm/out/${msgProtocol}`, JSON.stringify(msgString));
    });

    $('#comm-in-subscribe').click(function () {
      const robotId = $('#comm-in-id').val()
      const topic = `comm/in/${robotId}`;
      mqtt.subscribeToTopic(topic, (topic, msg) => {
        $('#comm-in-text').text(msg);
        console.log(topic, ':', msg);
      });
    });

    $('#robot-msg-send-btn').click(function () {
      const robotId = $('#robot-msg-id').val()
      const msgString = $('#robot-msg-value').val();
      mqtt.publish(`robot/msg/${robotId}`, msgString);
      //alert(msgString);
    });

    $('#robot-msg-broadcast-btn').click(function () {
      const msgString = $('#robot-msg-value').val();
      mqtt.publish('robot/msg/broadcast', msgString);
    })

    $('#robot-btn-create').click(function () {
      const msg = {
        id: $('#robot-create-id').val(),
        x: $('#robot-create-x-val').val(),
        y: $('#robot-create-y-val').val(),
        heading: $('#robot-create-heading-val').val(),
      };
      const msgString = JSON.stringify(msg);
      mqtt.publish('robot/create', msgString);
      //alert(msgString);
    })

    $('#robot-btn-delete').click(function () {
      const msg = {id: $('#robot-create-id').val()};
      const msgString = JSON.stringify(msg);
      mqtt.publish('robot/delete', msgString);
      //alert(msgString);
    })

    $('#robot-btn-update').click(function () {
      const msg = [{
        id: $('#robot-create-id').val(),
        x: $('#robot-create-x-val').val(),
        y: $('#robot-create-y-val').val(),
        heading: $('#robot-create-heading-val').val(),
      }];
      const msgString = JSON.stringify(msg);
      mqtt.publish('localization/info', msgString);
      //alert(msgString);
    })
  });


});
