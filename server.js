const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

// init
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder

app.use(express.static(path.join(__dirname, 'public')));
const name = 'CODERoom'

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //Welcome User
        socket.emit('message', formatMessage(name, "Welcome to CODERoom"));

        // Broadcast when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(name, `${user.username} has joined a chat`));
        // Send user info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });


    //Listen chatMessage
    socket.on('chatMessage', msg => {

        const user = getCurrentUser(socket.id);
        console.log(user);

        io.emit('message', formatMessage(user.username, msg));
    });

    // When client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(name, `${user.username} has left the chat`));
            // Send user info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));