import MQTTClient from './MqttClient';
import $ from "jquery";
import {v4 as uuidv4} from 'uuid';

let obstacles = [];
let env = {};

$(document).ready(function () {
  mqtt = new MQTTClient(() => {

    var robot_id = 0;

    // Active the buttons
    $('.btn').prop("disabled", false);

    // Event listeners for Range Sliders
    $('#obstacle-x-range').change(function () {
      $('#obstacle-x-val').val(this.value);
    }).change();
    $('#obstacle-y-range').change(function () {
      $('#obstacle-y-val').val(this.value);
    }).change();
    $('#obstacle-orientation-range').change(function () {
      $('#obstacle-orientation-val').val(this.value);
    }).change();

    // Event listeners for Text boxes
    $('#obstacle-x-val').change(function () {
      $('#obstacle-x-range').val(this.value);
    }).change();
    $('#obstacle-y-val').change(function () {
      $('#obstacle-y-range').val(this.value);
    }).change();
    $('#obstacle-orientation-val').change(function () {
      $('#obstacle-orientation-range').val(this.value);
    }).change();

    // Obstacles data structure

    // Build env.config.json file
    $('#btnEnvUpdate').click(function () {
      env = generateEnvJSON(obstacles);
      $('#environment-json').val(JSON.stringify(env, null, "\t"));

      if (obstacles.length >= 0) {
        // publish obstacles in current list
        mqtt.publish_channel('obstacles', 'obstacles', JSON.stringify(obstacles));
      }
      // update the list in GUI
      updateObstacleList(obstacles);

    }).click();

    // Obstacle creations
    $('#btnCreateWall').click(function () {
      const id = uuidv4();
      const width = $('#wall-width').val();
      const height = $('#wall-height').val();
      const depth = $('#wall-depth').val();

      const x = $('#obstacle-x-val').val();
      const y = $('#obstacle-y-val').val();
      const orientation = $('#obstacle-orientation-val').val();

      const color = '#505050';

      const geometry = {type: 'BoxGeometry', width: width, height: height, depth: depth};
      const position = {x: x, y: y};
      const rotation = {x: 0, y: orientation, z: 0};

      obstacles.push(generateObstacle(id, 'wall', geometry, color, position, rotation));
      console.log(obstacles);
      $('#btnEnvUpdate').click();
    });
    $('#btnCreateBox').click(function () {
      const id = uuidv4();
      const width = $('#box-width').val();
      const height = $('#box-height').val();
      const depth = $('#box-depth').val();

      const x = $('#obstacle-x-val').val();
      const y = $('#obstacle-y-val').val();
      const orientation = $('#obstacle-orientation-val').val();

      const color = '#505050';

      const geometry = {type: 'BoxGeometry', width: width, height: height, depth: depth};
      const position = {x: x, y: y};
      const rotation = {x: 0, y: orientation, z: 0};

      obstacles.push(generateObstacle(id, 'box', geometry, color, position, rotation));
      console.log(obstacles);
      $('#btnEnvUpdate').click();
    });
    $('#btnCreateCylinder').click(function () {
      const id = uuidv4();
      const radius = $('#cylinder-radius').val();
      const height = $('#cylinder-height').val();

      const x = $('#obstacle-x-val').val();
      const y = $('#obstacle-y-val').val();
      const orientation = $('#obstacle-orientation-val').val();

      const color = '#505050';

      const geometry = {type: 'CylinderGeometry', radiusTop: radius, radiusBottom: radius, height: height};
      const position = {x: x, y: y};
      const rotation = {x: 0, y: orientation, z: 0};

      obstacles.push(generateObstacle(id, 'cylinder', geometry, color, position, rotation));
      console.log(obstacles);
      $('#btnEnvUpdate').click();
    });

    // Obstacle Remove Event
    $('#obstacle-list').on('click', 'span', function () {
      const index = $(this).data('index');
      if (obstacles.length > 0) {
        obstacles.forEach(function (item, key) {
          if ((item.id) === index) {
            obstacles.splice(key, 1);
            const removeMsg = JSON.stringify({id: index});
            // Remove from both 'preview' and 'active' environments
            mqtt.publish_channel('obstacles', 'obstacles/delete', removeMsg);
            mqtt.publish('obstacles/delete', removeMsg);
          }
        });
      }
      //console.log( index );
      $('#btnEnvUpdate').click();
      //updateObstacleList(obstacles);
    });


    // Send Button Click Event
    $('#btn-obstacle-refresh').click(function () {
      mqtt.publish('obstacles', JSON.stringify(obstacles));
    });

    // Delete Button Click Event
    $('#btn-obstacle-delete').click(function () {
    });

    // DeleteAll Button Click Event
    $('#btn-obstacle-delete-all').click(function () {
    });

  });
});


function generateEnvJSON(obs) {

  // TODO: validate limits; xMin < xMax, yMin < yMax

  return {
    arena: {
      xMin: $('#txtXMin').val(),
      xMax: $('#txtXMax').val(),
      yMin: $('#txtYMin').val(),
      yMax: $('#txtYMax').val()
    },
    obstacles: obs,
    channel: 'v' + $('#channel-id').val() + '/'
  }
}

function updateObstacleList(obs) {
  $("#obstacle-list").empty();
  if (obs.length > 0) {
    obs.forEach(function (item) {
      $("#obstacle-list").append(`<li class="list-group-item">${item.name} - ${item.id}<span data-index="${item.id}" class="close">x</span></li>`);
    });
  }
}

function generateObstacle(id, name, geometry, color, position, rotation) {
  return {
    id: id,
    name: name,
    geometry: geometry,
    material: {
      type: 'MeshStandardMaterial',
      properties: {color: color}
    },
    position: position,
    rotation: rotation
  };
}
