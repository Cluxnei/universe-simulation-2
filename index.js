import Simulation from "./public/js/Simulation.js";
import {timeDifference} from "./public/js/Constants.js";
import express from 'express';
import http from 'http';
import io from 'socket.io';
import path from 'path';

const app = express();
const HTTP = http.createServer(app);
const IO = io(HTTP);

const __dirname = path.resolve();

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const simulation = new Simulation();

IO.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('start', () => {
        console.log('Start simulation');
        setInterval(() => {
            simulation.update(timeDifference)
            IO.emit('render', simulation.getSnapshot());
        }, 50);
    });
});

HTTP.listen(3000, () => {
    console.log('listening on *:3000');
});
