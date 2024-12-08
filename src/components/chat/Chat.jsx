import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import io from 'socket.io-client';

function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

    socketRef.current.emit('join-chat', user._id);

    socketRef.current.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user._id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = {
        senderId: user._id,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      socketRef.current.emit('send-message', messageData);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="h-96 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.senderId === user._id ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.senderId === user._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {message.content}
              <div className="text-xs mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;