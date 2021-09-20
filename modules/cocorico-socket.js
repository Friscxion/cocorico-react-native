const io = require("socket.io-client");
const socket = io("ws://raspberrypi:3000/", {
    reconnectionDelayMax: 10000
});

module.exports=socket;
