VO_CALL = (function(socket) {
    var module = {};

    module.call = function(id) {
        var pc = new RTCPeerConnection();
        var onError = pc.close;
        pc.onaddstream = function(obj) {
            // TODO: put the video somewhere
        }
        navigator.getUserMedia(
        {
            video: true,
            audio: true
        },
        function(stream) {
            pc.addStream(stream);

            pc.createOffer(function(offer) {
                pc.setLocalDescription(new RTCSessionDescription(offer), function() {
                    socket.send({type: 'call', who: id, offer: JSON.stringify(offer)});
                }, onError);
            }, onError);
        },
        function(err) {
            console.log("An error occured! " + err);
        });
    }

    return module;
})(VO_SOCKET);
