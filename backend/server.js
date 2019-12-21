const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let sockets = [];
let recognitions = {};

// GET endpoint for getting simple recognitions data
app.get('/recognition', function (req, res) {
    return res.send(recognitions);
});

// POST endpoint for sending recognitions data from python script
app.post('/recognition', function (req, res) {
    recognitions = req.body;
    try {
        // send updated data to every established websocket
        sockets.forEach(function (socket) {
            socket.send(JSON.stringify(recognitions))
        })
    } catch (e) {
        console.log(e.message)
        return res.send("false");
    }
    return res.send("true");
});

// web socket endpoint
app.ws('/ws', function (ws, req) {

    // connection has opened. Add socket to sockets list
    sockets.push(ws);
    console.log("Added new socket");

    // connection has closed. Delete socket from sockets list
    ws.on('close', function (msg) {
        let index = sockets.indexOf(ws);
        sockets.splice(index, 1);
        console.log("Deleted disconnected socket");
    })
});

// start server on port 8080
app.listen(8080, function () {
    console.log('Smart mirror server listening on port 8080!')
});
