V_OFFICE_WS = (function() {
  var module = {};

  function startup() {
      var protocol = location.protocol === "https:" ? "wss:" : "ws:";
      var uri = protocol + "//" + location.host + "/connect";
      var socket = new WebSocket(uri);

      socket.onmessage = function(ev) {
          var msg = JSON.parse(ev.data);
          if (msg.type === 'snapshot') {
              updateSnapshot(msg.from, msg.data);
          } else if (msg.type === 'left') {
              removeUser(msg.id);
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
      img.setAttribute('class', 'photo');
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

  function removeUser(id) {
      var photo = document.getElementById(id);
      var div = photo.parentElement;
      var room = document.getElementById('room');
      room.removeChild(div);
  }

  return module;
})();
