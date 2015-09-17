(function() {
  function startup() {
      var socket = new WebSocket("ws://" + location.host + "/connect");

      setTimeout(function() {
          send({
              type: 'snapshot',
              data: 'ohai!'
          });
      }, 5000);

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
