const io = require("socket.io-client");
const socket = io("ws://192.168.1.16:3000/", {
    reconnectionDelayMax: 10000
});

module.exports=socket;
