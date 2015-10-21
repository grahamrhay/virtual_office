VO_CALL = (function(socket) {
    var module = {};
    var pc;

    var config= {
        'iceServers': [
            {'url':'stun:stun.l.google.com:19302'},
            {'url':'stun:stun1.l.google.com:19302'},
            {'url':'stun:stun2.l.google.com:19302'},
            {'url':'stun:stun3.l.google.com:19302'},
            {'url':'stun:stun4.l.google.com:19302'}
        ]
    };

    module.call = function(id) {
        startPeerConnection(id);
        var onError = pc.close;
        navigator.getUserMedia({video: true, audio: true}, function(stream) {
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

    socket.on("initiate_call", function(msg) {
        startPeerConnection(msg.from);
        var onError = pc.close;
        navigator.getUserMedia({video: true, audio: true}, function(stream) {
            var div = document.getElementById('you');
            div.setAttribute('class', 'user inCall');
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
        pc.setRemoteDescription(new RTCSessionDescription(answer), function() {
            console.log('answered call');
        }, function(err) {
            console.log('setRemoteDescription', err);
        });
    });

    socket.on("ice_candidate", function(msg) {
        var candidate = JSON.parse(msg.candidate);
        pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    function startPeerConnection(id) {
        pc = new RTCPeerConnection(config);
        pc.onicecandidate = function(e) {
            console.log('ice candidate', e.candidate);
            if (e.candidate) {
                socket.send({type: 'ice_candidate', who: id, candidate: JSON.stringify(e.candidate)});
            }
        };
        pc.oniceconnectionstatechange = function(e) {
            console.log('ice connection state change', e);
        };
        pc.onaddstream = function(e) {
            var div = document.getElementById(id).parentNode;
            div.setAttribute('class', 'user inCall');
            var video = div.getElementsByTagName('video')[0];
            video.src = URL.createObjectURL(e.stream);
            video.play();
        };
    }

    return module;
})(VO_SOCKET);
