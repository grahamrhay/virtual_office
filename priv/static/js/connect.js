(function() {
  function startup() {
      var socket = new WebSocket("ws://" + location.host + "/connect");

      socket.onmessage = function(ev) {
          console.log('Received data: ' + ev.data);
      };

      function send(msg) {
          var data = JSON.stringify(msg);
          console.log('Sent msg: ' + data);
          socket.send(data);
      }
  }

  window.addEventListener('load', startup, false);
})();
