import $ from 'jquery';

export function setup() {
    // console.log('Setup: Proximity');

    var dist_robot_id = null;

    // Active the buttons
    $('.btn').prop('disabled', false);
    $('.channel').text(window.mqtt.channel);

    $('#proximity-sensor-robot-id')
        .change(function () {
            const robotId = this.value;
            const topic = `sensor/proximity/${robotId}`;

            if (dist_robot_id != robotId && dist_robot_id !== null) {
                // unsubscribe from previous topic
                mqtt.unsubscribe(`sensor/proximity/${dist_robot_id}`);
            }
            mqtt.subscribeToTopic(topic, (topic, msg) => {
                $('#dist-robot-text').text(msg);
                console.log(topic, ':', msg);
            });

            dist_robot_id = robotId;
            $('.proximity-sensor-robot-id').text(robotId);
        })
        .change();

    $('#proximity-sensor-dist-bar')
        .change(function () {
            $('#dist-val').val(this.value);
            $('.dist-val').text(this.value);
        })
        .change();

    // Subscribe: v1/sensor/proximity
    mqtt.subscribeToTopic('sensor/proximity', (topic, msg) => {
        $('#dist-sub-text').text(msg);
    });

    // Publish: sensor/proximity/${robotId}/?
    $('#dist-btn-req').click(function () {
        const robotId = $('#proximity-sensor-robot-id').val();
        mqtt.publish(`sensor/proximity/${robotId}/?`, '?');
    });

    // Publish: sensor/proximity/${robotId}
    $('#dist-btn-send-robot').click(function () {
        const robotId = $('#proximity-sensor-robot-id').val();
        const proximity = $('#dist-val').val();
        mqtt.publish(`sensor/proximity/${robotId}`, proximity);
    });

    // Publish: sensor/proximity/
    $('#dist-btn-send-server').click(function () {
        const robotId = $('#proximity-sensor-robot-id').val();
        const proximity = $('#dist-val').val();
        const msgString = { id: robotId, dist: proximity };
        mqtt.publish('sensor/proximity', JSON.stringify(msgString));
    });
}
