V_OFFICE_WS = (function() {
  var module = {};

  function startup() {
      var socket = new WebSocket("ws://" + location.host + "/connect");

      socket.onmessage = function(ev) {
          console.log('Received data: ' + ev.data);
          var msg = JSON.parse(ev.data);
          if (msg.type === 'joined') {
              addUser(msg.id);
          } else if (msg.type === 'snapshot') {
              updateSnapshot(msg.from, msg.data);
          }
      };

      module.send = function(msg) {
          var data = JSON.stringify(msg);
          console.log('Sent msg: ' + data);
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
  }

  function updateSnapshot(id, data) {
      var photo = document.getElementById(id);
      photo.setAttribute('src', data);
  }

  return module;
})();
