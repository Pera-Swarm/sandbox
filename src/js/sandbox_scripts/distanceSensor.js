import $ from 'jquery';

export function setup() {
    // console.log('Setup: Distance');

    var dist_robot_id = null;

    // Active the buttons
    $('.btn').prop('disabled', false);
    $('.channel').text(window.mqtt.channel);

    $('#distance-sensor-robot-id')
        .change(function () {
            const robotId = this.value;
            const topic = `sensor/distance/${robotId}`;

            if (dist_robot_id != robotId && dist_robot_id !== null) {
                // unsubscribe from previous topic
                mqtt.unsubscribe(`sensor/distance/${dist_robot_id}`);
            }
            mqtt.subscribeToTopic(topic, (topic, msg) => {
                $('#dist-robot-text').text(msg);
                console.log(topic, ':', msg);
            });

            dist_robot_id = robotId;
            $('.distance-sensor-robot-id').text(robotId);
        })
        .change();

    $('#distance-sensor-dist-bar')
        .change(function () {
            $('#dist-val').val(this.value);
            $('.dist-val').text(this.value);
        })
        .change();

    // Subscribe: v1/sensor/distance
    mqtt.subscribeToTopic('sensor/distance', (topic, msg) => {
        $('#dist-sub-text').text(msg);
    });

    // Publish: sensor/distance/${robotId}/?
    $('#dist-btn-req').click(function () {
        const robotId = $('#distance-sensor-robot-id').val();
        mqtt.publish(`sensor/distance/${robotId}/?`, '?');
    });

    // Publish: sensor/distance/${robotId}
    $('#dist-btn-send-robot').click(function () {
        const robotId = $('#distance-sensor-robot-id').val();
        const distance = $('#dist-val').val();
        mqtt.publish(`sensor/distance/${robotId}`, distance);
    });

    // Publish: sensor/distance/
    $('#dist-btn-send-server').click(function () {
        const robotId = $('#distance-sensor-robot-id').val();
        const distance = $('#dist-val').val();
        const msgString = { id: robotId, dist: distance };
        mqtt.publish('sensor/distance', JSON.stringify(msgString));
    });
}
