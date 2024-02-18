import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';

const BroadCast = () => {
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');

    useEffect(() => {
        // Connect to the Socket.IO server
        const socket = io('http://localhost:4000');
        setSocket(socket);

        // Clean up the socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const joinRoom = () => {
        // Join the room with the specified roomId
        socket.emit('joinRoom', roomId);
    };

    const leaveRoom = () => {
        // Leave the current room
        socket.emit('leaveRoom', roomId);
    };

    const handleMessageSend =(val) => {
        // Send a message to the current room
        socket.emit('codeChange', roomId, val);
        setMessage(val);
    }
   

    useEffect(() => {
        if (!socket) return;

        // Listen for incoming messages from the current room
        socket.on('codeChange', (msg) => {
            setMessage(msg);
        });

        // Clean up message listener on component unmount or room change
        return () => {
            socket.off('codeChange');
        };
    }, [socket, roomId]);

    return (
        <div>
            <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
            <button onClick={leaveRoom}>Leave Room</button>

            {/* <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleMessageSend}>Send</button> */}

            <CodeMirror value={message} height="100vh" theme={dracula} extensions={[javascript({ jsx: true })]} onChange={handleMessageSend} />

            <div>
                <h3>Received Message:</h3>
                <p>{receivedMessage}</p>
            </div>
        </div>
    );
};

export default BroadCast;
