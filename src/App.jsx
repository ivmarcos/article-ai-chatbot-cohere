import React, { useState } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_COHERE_API_KEY;

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessageToAI = async (message) => {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'command-xlarge-nightly',
        prompt: `User: ${message}\nBot:`,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    return data.generations[0].text.trim();
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    const botReply = await sendMessageToAI(userInput);
    setMessages([...newMessages, { sender: 'bot', text: botReply }]);
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Typing...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default App;
