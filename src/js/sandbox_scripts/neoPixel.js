import $ from 'jquery';

export function setup() {
    console.log('Setup: NeoPixel');

    var color_robot_id = null;

    // Active the buttons
    $('.btn').prop('disabled', false);
    $('.channel').text(window.mqtt.channel);

    $('#neo-robot-id')
        .change(function () {
            const robotId = this.value;
            const topic = `output/neopixel/${robotId}`;

            if (color_robot_id !== robotId && color_robot_id !== null) {
                // unsubscribe from previous topic
                mqtt.unsubscribe(`output/neopixel/${color_robot_id}`);
            }
            mqtt.subscribeToTopic(topic, (topic, msg) => {
                $('#neopixel-sub-robot-text').text(msg);
                console.log(topic, ':', msg);
            });

            color_robot_id = robotId;
            $('.neo-robot-id').text(robotId);
        })
        .change();

    // Subscribe: output/neopixel
    mqtt.subscribeToTopic('output/neopixel', (topic, msg) => {
        $('#neopixel-sub-text').text(msg);
    });

    // Publish: output/neopixel/{robotId}
    $('#neopixel-btn-send-robot').click(function () {
        const robotId = $('#neo-robot-id').val();
        const r = $('#neo-red-bar').val();
        const g = $('#neo-green-bar').val();
        const b = $('#neo-blue-bar').val();

        mqtt.publish(`output/neopixel/${robotId}`, `${r} ${g} ${b}`);
    });

    // Publish: output/neopixel
    $('#neopixel-btn-send-server').click(function () {
        const robotId = $('#neo-robot-id').val();
        const r = $('#neo-red-bar').val();
        const g = $('#neo-green-bar').val();
        const b = $('#neo-blue-bar').val();
        const msgString = { id: robotId, R: r, G: g, B: b };
        mqtt.publish(`output/neopixel`, JSON.stringify(msgString));
    });

    // Publish: output/neopixel/{robotId}/?
    $('#neopixel-btn-req').click(function () {
        const robotId = $('#neo-robot-id').val();
        mqtt.publish(`output/neopixel/${robotId}/?`, '?');
    });
}
