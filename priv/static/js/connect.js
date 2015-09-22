VO_SOCKET = (function() {
  var module = {};
  var callbacks = {};
  var socket;

  module.on = function(type, cb) {
      callbacks[type] = cb;
  };

  module.send = function(msg) {
      var data = JSON.stringify(msg);
      socket.send(data);
  };

  function connect() {
      var protocol = location.protocol === "https:" ? "wss:" : "ws:";
      var uri = protocol + "//" + location.host + "/connect";

      socket = new WebSocket(uri);


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
