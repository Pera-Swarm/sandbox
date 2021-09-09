import $ from 'jquery';

export function setup() {
    // console.log('Setup: Proximity');

    var proximity_robot_id = null;

    // Active the buttons
    $('.btn').prop('disabled', false);
    $('.channel').text(window.mqtt.channel);

    $('#proximity-sensor-robot-id')
        .change(function () {
            const robotId = this.value;
            const topic = `sensor/proximity/${robotId}`;

            if (proximity_robot_id != robotId && proximity_robot_id !== null) {
                // unsubscribe from previous topic
                mqtt.unsubscribe(`sensor/proximity/${proximity_robot_id}`);
            }
            mqtt.subscribeToTopic(topic, (topic, msg) => {
                $('#dist-robot-text').text(msg);
                console.log(topic, ':', msg);
            });

            proximity_robot_id = robotId;
            $('.proximity-sensor-robot-id').text(robotId);
        })
        .change();

    $('.proximity-sensors')
        .change(function () {
            const dist1 = $('#proximity-sensor-dist1-bar').val();
            const dist2 = $('#proximity-sensor-dist2-bar').val();
            const dist3 = $('#proximity-sensor-dist3-bar').val();
            const dist4 = $('#proximity-sensor-dist4-bar').val();
            const dist5 = $('#proximity-sensor-dist5-bar').val();

            $('.proximity-val').text(
                dist1 + ' ' + dist2 + ' ' + dist3 + ' ' + dist4 + ' ' + dist5
            );
            $('#proximity-val').text(
                dist1 + ' ' + dist2 + ' ' + dist3 + ' ' + dist4 + ' ' + dist5
            );
        })
        .change();

    // Subscribe: v1/sensor/proximity
    mqtt.subscribeToTopic('sensor/proximity', (topic, msg) => {
        $('#dist-sub-text').text(msg);
    });

    // Publish: sensor/proximity/${robotId}
    $('#dist-btn-send-robot').click(function () {
        const robotId = $('#proximity-sensor-robot-id').val();

        // This is not functioning ???
        const proximity = $('#proximity-val').val();
        alert(proximity);
        mqtt.publish(`sensor/proximity/${robotId}`, proximity);
    });

    // Publish: sensor/proximity/
    $('#dist-btn-send-server').click(function () {
        const robotId = $('#proximity-sensor-robot-id').val();
        const msgString = { id: robotId, reality: 'V' };
        mqtt.publish('sensor/proximity', JSON.stringify(msgString));
    });
}
