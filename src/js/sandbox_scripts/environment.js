import $ from 'jquery';

export function setup() {
    // console.log('Setup: Color');

    var color_robot_id = null;

    // Active the buttons
    $('.btn').prop('disabled', false);
    $('.channel').text(window.mqtt.channel);

    $('#robot-id')
        .change(function () {
            const robotId = this.value;
            const topic = `sensor/color/${robotId}`;

            if (color_robot_id != robotId && color_robot_id !== null) {
                // unsubscribe from previous topic
                mqtt.unsubscribe(`sensor/color/${color_robot_id}`);
            }
            mqtt.subscribeToTopic(topic, (topic, msg) => {
                $('#color-robot-text').text(msg);
                console.log(topic, ':', msg);
            });

            color_robot_id = robotId;
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
    $('#amb-bar')
        .change(function () {
            $('#amb-val').val(this.value);
            $('.amb-val').text(this.value);
        })
        .change();

    // Subscribe: v1/sensor/color
    mqtt.subscribeToTopic('sensor/color', (topic, msg) => {
        $('#color-sub-text').text(msg);
    });

    // Publish: sensor/color/{robotId}
    $('#color-btn-send-robot').click(function () {
        const robotId = $('#robot-id').val();
        const r = $('#red-bar').val();
        const g = $('#green-bar').val();
        const b = $('#blue-bar').val();
        const amb = $('#amb-bar').val();

        mqtt.publish(`sensor/color/${robotId}`, `${r} ${g} ${b} ${amb}`);
    });

    // Publish: sensor/color
    $('#color-btn-send-server').click(function () {
        const robotId = $('#robot-id').val();
        const r = $('#red-bar').val();
        const g = $('#green-bar').val();
        const b = $('#blue-bar').val();
        const amb = $('#amb-bar').val();
        const msgString = { id: robotId, R: r, G: g, B: b, ambient: amb };
        mqtt.publish(`sensor/color`, JSON.stringify(msgString));
    });

    // Publish: sensor/color/{robotId}/?
    $('#color-btn-req').click(function () {
        const robotId = $('#robot-id').val();
        mqtt.publish(`sensor/color/${robotId}/?`, '?');
    });

    function updateColorBox() {
        const r = $('#red-bar').val();
        const g = $('#green-bar').val();
        const b = $('#blue-bar').val();
        $('#color-box').css('background-color', `rgb(${r},${g},${b})`);
    }
}
