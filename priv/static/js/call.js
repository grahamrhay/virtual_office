VO_CALL = (function(socket) {
    var module = {};
    var pc1;

    module.call = function(id) {
        pc1 = new RTCPeerConnection();
        var onError = pc1.close;
        pc1.onaddstream = function(obj) {
            // TODO: put the video somewhere
        }
        navigator.getUserMedia(
        {
            video: true,
            audio: true
        },
        function(stream) {
            pc1.addStream(stream);

            pc1.createOffer(function(offer) {
                pc1.setLocalDescription(new RTCSessionDescription(offer), function() {
                    socket.send({type: 'call', who: id, offer: JSON.stringify(offer)});
                }, onError);
            }, onError);
        },
        function(err) {
            console.log("An error occured! " + err);
        });
    }

    socket.on("initiate_call", function(msg) {
        var pc = new RTCPeerConnection();
        var onError = pc.close;
        navigator.getUserMedia({video: true, audio: true}, function(stream) {
            pc.addStream(stream);
            var offer = JSON.parse(msg.offer);
            pc.setRemoteDescription(new RTCSessionDescription(offer), function() {
                pc.createAnswer(function(answer) {
                    pc.setLocalDescription(new RTCSessionDescription(answer), function() {
                        socket.send({type: 'answer', who: msg.from, answer: JSON.stringify(answer)});
                    }, onError);
                }, onError);
            });
        }, function(err) {
            console.log("Error getting video stream: " + err);
        });
    });

    socket.on("answer_call", function(msg) {
        var answer = JSON.parse(msg.answer);
        pc1.setRemoteDescription(new RTCSessionDescription(answer), function() {
            console.log('answered call');
        }, function(err) {
            console.log('setRemoteDescription', err);
        });
    });

    return module;
})(VO_SOCKET);
