import $ from 'jquery';

export function setup() {
    // console.log('Setup: Robot');

    $('.btn').prop('disabled', false);
    $('.channel').text(window.mqtt.channel);

    // Event listener for RobotId on msg
    $('#robot-msg-id')
        .change(function () {
            $('#robot-msg-id-lbl').text(this.value);
        })
        .change();

    // Event listeners for Range Sliders
    $('#robot-create-x-range')
        .change(function () {
            $('#robot-create-x-val').val(this.value);
            $('.robot-loc-x').text(this.value);
        })
        .change();
    $('#robot-create-y-range')
        .change(function () {
            $('#robot-create-y-val').val(this.value);
            $('.robot-loc-y').text(this.value);
        })
        .change();
    $('#robot-create-heading-range')
        .change(function () {
            $('#robot-create-heading-val').val(this.value);
            $('.robot-loc-heading').text(this.value);
        })
        .change();

    // Event listeners for Text boxes
    $('#robot-create-x-val')
        .change(function () {
            $('#robot-create-x-range').val(this.value);
        })
        .change();
    $('#robot-create-y-val')
        .change(function () {
            $('#robot-create-y-range').val(this.value);
        })
        .change();
    $('#robot-create-heading-val')
        .change(function () {
            $('#robot-create-heading-range').val(this.value);
        })
        .change();

    $('#robot-reality')
        .change(function () {
            //alert('*');
            $('.robot-loc-reality').text(this.value);
        })
        .change();

    // Send Button
    $('#robot-msg-send-btn').click(function () {
        const robotId = $('#robot-msg-id').val();
        const msgString = $('#robot-msg-value').val();
        window.mqtt.publish(`robot/msg/${robotId}`, msgString);
    });

    // Broadcast Message
    $('#robot-msg-broadcast-btn').click(function () {
        const msgString = $('#robot-msg-value').val();

        // if(msgString=='RESET -1'){
        //     // TODO: finalize this
        //     console.log('send refresh request');
        //     window.mqtt.publish('management/visualizer/refresh', '?');
        // }

        window.mqtt.publish('robot/msg/broadcast', msgString);
    });

    let current_loc_id = undefined;
    $('#robot-localization-id')
        .change(function () {
            const id = this.value;

            $('.robot-loc-id').text(id);
            // Commented because an issue in simulation-server

            // window.mqtt.unsubscribe(`localization/${current_loc_id}`);
            // window.mqtt.subscribeToTopic(`localization/${id}`, (topic, msg) => {
            //     // Obtain the current coordinates and update the sliders
            //     const coord = msg.split(' ');
            //     $('#robot-create-x-val').val(coord[0]).change();
            //     $('#robot-create-y-val').val(coord[1]).change();
            //     $('#robot-create-heading-val').val(coord[2]).change();
            // });
            //window.mqtt.publish('localization', JSON.stringify({ id: id }));
            current_loc_id = id;
        })
        .change();

    // Create Button
    $('#robot-btn-create').click(function () {
        const msg = {
            id: $('#robot-localization-id').val(),
            x: $('#robot-create-x-val').val(),
            y: $('#robot-create-y-val').val(),
            heading: $('#robot-create-heading-val').val(),
            reality: $('#robot-reality').val()
        };
        window.mqtt.publish('robot/create', JSON.stringify(msg));
    });

    // Update Button
    $('#robot-btn-update').click(function () {
        const msg = [
            {
                id: $('#robot-localization-id').val(),
                x: $('#robot-create-x-val').val(),
                y: $('#robot-create-y-val').val(),
                heading: $('#robot-create-heading-val').val(),
                reality: $('#robot-reality').val()
            }
        ];
        window.mqtt.publish('localization/update', JSON.stringify(msg));
    });

    // Delete Button
    $('#robot-btn-delete').click(function () {
        const msg = { id: $('#robot-localization-id').val() };
        window.mqtt.publish('robot/delete', JSON.stringify(msg));
    });
}
