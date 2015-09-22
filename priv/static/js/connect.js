VO_SOCKET = (function() {
  var module = {};
  var callbacks = {};
  var socket;
  var reconnectAttempts;
  var MAX_RECONNECT_DELAY = 30 * 1000;
  var protocol = location.protocol === "https:" ? "wss:" : "ws:";
  var uri = protocol + "//" + location.host + "/connect";

  module.on = function(type, cb) {
      callbacks[type] = cb;
  };

  module.send = function(msg) {
      if (socket.readyState === 1) {
        var data = JSON.stringify(msg);
        socket.send(data);
      }
  };

  function connect() {
      socket = new WebSocket(uri);

      socket.onopen = function() {
          reconnectAttempts = 1;
      };

      socket.onclose = function() {
          var delay = calculateDelay(reconnectAttempts);
          setTimeout(function() {
              reconnectAttempts++;
              connect();
          }, delay);
      };

      function calculateDelay() {
          var maxInterval = Math.min(((Math.pow(2, reconnectAttempts) - 1) * 1000), MAX_RECONNECT_DELAY);
          return Math.random() * maxInterval;
      }

      socket.onmessage = function(ev) {
          var msg = JSON.parse(ev.data);
          var cb = callbacks[msg.type];
          if (cb) {
              cb(msg);
          } else {
              console.error("Unexpected message: ", msg);
          }
      };
  }

  window.addEventListener('load', connect, false);

  return module;
})();
