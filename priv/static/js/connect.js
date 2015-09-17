V_OFFICE_WS = (function() {
  var module = {};

  function startup() {
      var socket = new WebSocket("ws://" + location.host + "/connect");

      socket.onmessage = function(ev) {
          console.log('Received data: ' + ev.data);
      };

      module.send = function(msg) {
          var data = JSON.stringify(msg);
          console.log('Sent msg: ' + data);
          socket.send(data);
      }
  }

  window.addEventListener('load', startup, false);

  return module;
})();
