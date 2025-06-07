import React, { useState } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ChatAssistant = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const toggleChat = () => {
    setChatOpen((prev) => !prev);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { user: "You", message }]);
      setMessage("");
      
      try {
        // Call the API with the message
        const response = await axios.post(`${API_BASE_URL}/openai/chatbot`, {
          question: message,
        });
        
        // Update chat history with the API response
        setChatHistory((prev) => [
          ...prev,
          { user: "AI", message: response.data.response },
        ]);
      } catch (error) {
        console.error("Error calling chatbot API:", error);
        setChatHistory((prev) => [
          ...prev,
          { user: "AI", message: "Sorry, there was an error processing your request." },
        ]);
      }
    }
  };

  const fetchChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/openai/chatbot/history`);
      setChatHistory((prev) => [
        ...prev,
        { user: "System", message: "Chat history loaded:" },
        { user: "AI", message: JSON.stringify(response.data, null, 2) },
      ]);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatHistory((prev) => [
        ...prev,
        { user: "System", message: "Failed to load chat history." },
      ]);
    } finally {
      setLoadingHistory(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && message.trim()) {
      e.preventDefault(); // Prevent newline on Enter
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <IconButton
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#1976d2",
          color: "#fff",
        }}
      >
        <ChatIcon />
      </IconButton>

      {/* Chat Box */}
      {chatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            height: "400px",
            bgcolor: "#fff",
            boxShadow: 3,
            borderRadius: 2,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" mb={1} textAlign="center">
            AI Assistant
          </Typography>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              p: 1,
              mb: 2,
            }}
          >
            {chatHistory.map((chat, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  mb: 1,
                  textAlign: chat.user === "You" ? "right" : "left",
                }}
              >
                <strong>{chat.user}:</strong> {chat.message}
              </Typography>
            ))}
          </Box>
          <Box display="flex" gap={1} mb={2}>
            <TextField
              size="small"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && message.trim()) {
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              Send
            </Button>
          </Box>
          <Button
            variant="outlined"
            onClick={fetchChatHistory}
            disabled={loadingHistory}
          >
            {loadingHistory ? "Loading..." : "Load History"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default ChatAssistant;
