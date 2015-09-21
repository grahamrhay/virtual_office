V_OFFICE_WS = (function() {
  var module = {};

  function startup() {
      var socket = new WebSocket("ws://" + location.host + "/connect");

      socket.onmessage = function(ev) {
          var msg = JSON.parse(ev.data);
          if (msg.type === 'snapshot') {
              updateSnapshot(msg.from, msg.data);
          } else {
              console.error("Unexpected message: ", msg);
          }
      };

      module.send = function(msg) {
          var data = JSON.stringify(msg);
          socket.send(data);
      }
  }

  window.addEventListener('load', startup, false);

  function addUser(id) {
      var div = document.createElement("div");
      div.setAttribute('class', 'output');
      var img = document.createElement('img');
      img.setAttribute('id', id);
      div.appendChild(img);
      var room = document.getElementById('room');
      room.appendChild(div);
      return img;
  }

  function updateSnapshot(id, data) {
      var photo = document.getElementById(id);
      if (!photo) {
          photo = addUser(id);
      }
      photo.setAttribute('src', data);
  }

  return module;
})();
