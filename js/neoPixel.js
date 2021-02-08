import MQTTClient from './MqttClient';
import $ from 'jquery';

$(document).ready(function () {
    const mqtt = new MQTTClient(() => {
        let robot_id = 0;

        // Active the buttons
        $('.btn').prop('disabled', false);

        $('#robot-id')
            .change(function () {
                const robotId = this.value;
                const topic = `output/neopixel/${robotId}`;

                if (robot_id !== robotId && robot_id !== null) {
                    // unsubscribe from previous topic
                    mqtt.unsubscribe(`output/neopixel/${robot_id}`);
                }
                mqtt.subscribeToTopic(topic, (topic, msg) => {
                    $('#neopixel-sub-robot-text').text(msg);
                    console.log(topic, ':', msg);
                });

                robot_id = robotId;
                $('.robot-id').text(robotId);
            })
            .change();

        $('#red-bar')
            .change(function () {
                $('#red-val').val(this.value);
                $('.red-val').text(this.value);
                updateColorBox();
            })
            .change();
        $('#green-bar')
            .change(function () {
                $('#green-val').val(this.value);
                $('.green-val').text(this.value);
                updateColorBox();
            })
            .change();
        $('#blue-bar')
            .change(function () {
                $('#blue-val').val(this.value);
                $('.blue-val').text(this.value);
                updateColorBox();
            })
            .change();

        // Subscribe: output/neopixel
        mqtt.subscribeToTopic('output/neopixel', (topic, msg) => {
            $('#neopixel-sub-text').text(msg);
        });

        // Publish: output/neopixel/{robotId}
        $('#neopixel-btn-send-robot').click(function () {
            const robotId = $('#robot-id').val();
            const r = $('#red-bar').val();
            const g = $('#green-bar').val();
            const b = $('#blue-bar').val();

            mqtt.publish(`output/neopixel/${robotId}`, `${r} ${g} ${b}`);
        });

        // Publish: output/neopixel
        $('#neopixel-btn-send-server').click(function () {
            const robotId = $('#robot-id').val();
            const r = $('#red-bar').val();
            const g = $('#green-bar').val();
            const b = $('#blue-bar').val();
            const msgString = { id: robotId, R: r, G: g, B: b };
            mqtt.publish(`output/neopixel`, JSON.stringify(msgString));
        });

        // Publish: output/neopixel/{robotId}/?
        $('#neopixel-btn-req').click(function () {
            const robotId = $('#robot-id').val();
            mqtt.publish(`output/neopixel/${robotId}/?`, '?');
        });
    });

    function updateColorBox() {
        const r = $('#red-bar').val();
        const g = $('#green-bar').val();
        const b = $('#blue-bar').val();
        $('#color-box').css('background-color', `rgb(${r},${g},${b})`);
    }
});
