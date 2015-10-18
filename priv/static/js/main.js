(function(socket, caller) {
    socket.on('snapshot', function(msg) {
        updateSnapshot(msg.from, msg.data);
    });

    socket.on('left', function(msg) {
        removeUser(msg.id);
    });

    function addUser(id) {
        var div = document.createElement("div");
        div.setAttribute('class', 'output');
        var img = document.createElement('img');
        img.setAttribute('id', id);
        img.setAttribute('class', 'photo');
        div.appendChild(img);
        var caption = document.createElement('div');
        caption.setAttribute('class', 'caption');
        caption.textContent = id;
        div.appendChild(caption);
        var callButton = document.createElement('button');
        callButton.setAttribute('class', 'callButton');
        callButton.textContent = "Call";
        callButton.onclick = initiateCall(id);
        div.appendChild(callButton);
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
        if (photo) {
            var div = photo.parentElement;
            var room = document.getElementById('room');
            room.removeChild(div);
        }
    }

    function initiateCall(id) {
        return function() {
            caller.call(id);
        };
    }
})(VO_SOCKET, VO_CALL);
