const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*' // Change this to your frontend's origin
    }
});


app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // B R O A D C A S T C O N N E C T
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      });

      socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
      });

      socket.on('codeChange', (roomId, message) => {
        console.log(`Received message from client in room ${roomId}:`, message);
        console.log('message:',message);
        io.to(roomId).emit('codeChange', message); // Broadcast the message to all clients in the room
      });

    //socket recieve & emit to all
    // socket.on('codeChange', (message) => {
    //     console.log('Received message from client:', message);
    //     // Here you can handle the message as needed, e.g., broadcast to all clients
    //     io.emit('codeChange', message); // Broadcast the message to all connected clients
    // });
});

app.get('/', (req, res) => res.json({ msg: 'This is from backend' }))

server.listen(4000, () => {
    console.log('Server running on port 4000');
});
