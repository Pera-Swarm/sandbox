import $ from 'jquery';

export function setup() {
    console.log('Setup: Communication');

    //mqtt = new MQTTClient(() => {
    var comm_in_id = null;

    // Active the buttons
    $('.btn').prop('disabled', false);
    $('.channel').text(window.mqtt.channel);

  // Subscribe: v1/comm/out/simple
  mqtt.subscribeToTopic("comm/out/simple", (topic, msg) => {
    $("#com-out-simple").text(msg);
  });
  // Subscribe: v1/comm/out/direct
  mqtt.subscribeToTopic("comm/out/direct", (topic, msg) => {
    $("#com-out-direct").text(msg);
  });

  // Event listeners for select box updates
  $("#comm-out-protocol")
    .change(function() {
      $(".com-out-protocol-label").text(this.value);
    })
    .change();

  $("#robot-id")
    .change(function() {
      const robotId = this.value;
      const topicSimple = `comm/in/simple/${robotId}`;
      const topicDirect = `comm/in/direct/${robotId}`;

      if (comm_in_id != robotId && comm_in_id !== null) {
        // unsubscribe from previous topic
        mqtt.unsubscribe(`comm/in/simple/${comm_in_id}`);
      }

      // Simple communication
      mqtt.subscribeToTopic(topicSimple, (topicSimple, msg) => {
        $("#com-in-msg").text(`simple: ${msg}`);
        console.log(topicSimple, ":", msg);
      });

      // Directed communication
      mqtt.subscribeToTopic(topicDirect, (topicDirect, msg) => {
        $("#com-in-msg").text(`simple: ${msg}`);
        console.log(topicDirect, ":", msg);
      });

            comm_in_id = robotId;
            $('.robot-id').text(robotId);
        })
        .change();

  $("#comm-out-msg")
    .change(function() {
      $(".comm-msg").text(this.value);
    })
    .change();

  // Publish Button
  $("#comm-out-publish").click(function() {
    const robotId = $("#robot-id").val();
    const msg = $("#comm-out-msg").val();
    const msgProtocol = $("#comm-out-protocol").val();
    mqtt.publish(`comm/in/${msgProtocol}/${robotId}`, msg);
  });

  // broadcast Button
  $("#comm-out-broadcast").click(function() {
    const robotId = $("#robot-id").val();
    const msg = $("#comm-out-msg").val();
    const msgProtocol = $("#comm-out-protocol").val();
    const msgString = { id: robotId, msg: msg };
    mqtt.publish(`comm/out/${msgProtocol}`, JSON.stringify(msgString));
  });

}
