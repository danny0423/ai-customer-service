/** @jsxImportSource @emotion/react */
// import React from 'react';
// ChatUI.jsx
import  { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';




// import getResult from './getResult'; // 🔁 這裡請導入你的 GPT 回應邏輯



export default function ChatsMui() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // const aiReply = await getResult(input);
    const aiReply = 'test';

    const aiMessage = { from: 'bot', text: aiReply || 'AI 回覆失敗。' };

    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        mt: 5,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        bgcolor: '#fafafa',
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" mb={2} textAlign="center">AI 智能客服</Typography>

      <Box sx={{ maxHeight: 400, overflowY: 'auto', mb: 2 }}>
        <Stack spacing={1}>
          {messages.map((msg, i) => (
            <Paper
              key={i}
              elevation={2}
              sx={{
                p: 1.5,
                bgcolor: msg.from === 'user' ? '#e3f2fd' : '#fffde7',
                alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              <Typography variant="body2">
                <strong>{msg.from === 'user' ? '你' : '客服'}：</strong>
              </Typography>
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          ))}
        </Stack>
      </Box>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="輸入訊息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading}
          endIcon={<SendIcon />}
        >
          發送
        </Button>
      </Box>
    </Box>
  );
}
