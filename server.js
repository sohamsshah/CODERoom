const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')

// init
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder

app.use(express.static(path.join(__dirname, 'public')));
const name = 'Coderoom'

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        //Welcome User
        socket.emit('message', formatMessage(name, 'Welcome to Coderoom'));

        // Broadcast when user connects
        socket.broadcast.emit('message', formatMessage(name, 'User has joined a chat'));

    });


    //Listen chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('User', msg));
    });

    // When client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(name, 'A user has left the chat'));
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));