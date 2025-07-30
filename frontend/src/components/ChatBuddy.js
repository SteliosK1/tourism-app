import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Input, HStack, Text, VStack } from '@chakra-ui/react';

const ChatBuddy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableDestinations, setAvailableDestinations] = useState([]); // ✅ ΝΕΟ
  const messagesEndRef = useRef(null);

  // 🔥 Φόρτωση destinations από το backend
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch('http://localhost:5050/api/destinations');
        const data = await res.json();
        setAvailableDestinations(data);
      } catch (error) {
        console.error('Failed to load destinations:', error);
      }
    };
    fetchDestinations();
  }, []);

  // Αυτόματο scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Άνοιγμα/κλείσιμο chat με welcome message
  const toggleChat = () => {
    if (!isOpen) {
      setMessages([{ role: 'assistant', content: "Hi there! Looking for travel inspiration or help with your trips?" }]);
    }
    setIsOpen(!isOpen);
  };

  // Αποστολή μηνύματος
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
  
    // ✅ Έλεγχος για destination
    const matchedDestination = availableDestinations.find((dest) =>
      input.toLowerCase().includes(dest.name.toLowerCase().split(",")[0])
    );
  
    if (matchedDestination) {
      // ✅ Ελέγχουμε keywords
      const lowerInput = input.toLowerCase();
      let responseParts = [];
  
      if (lowerInput.includes("click")) {
        responseParts.push(`It currently has **${matchedDestination.clicks} clicks** 🔥`);
      }
      if (lowerInput.includes("rating")) {
        responseParts.push(`Its rating is **${matchedDestination.rating}/5 ⭐**`);
      }
      if (lowerInput.includes("language")) {
        responseParts.push(`The main language is **${matchedDestination.language}** 🗣️`);
      }
      if (lowerInput.includes("cost") || lowerInput.includes("price")) {
        responseParts.push(`The average cost to visit is **${matchedDestination.average_cost}** 💰`);
      }
  
      // ✅ Αν βρήκαμε στοιχεία → φτιάχνουμε απάντηση
      if (responseParts.length > 0) {
        const combinedMessage = {
          role: 'assistant',
          content: `${matchedDestination.name}: ${responseParts.join(" • ")}`
        };
        setMessages([...newMessages, combinedMessage]);
        return;
      }
  
      // ✅ Αν δεν βρέθηκε keyword, εμφανίζουμε link
      const linkMessage = {
        role: 'assistant',
        content: `I found **${matchedDestination.name}**! 👉 <a href="/destination/${matchedDestination.id}" style="color: teal; text-decoration: underline;">View details</a>`
      };
      setMessages([...newMessages, linkMessage]);
      return;
    }
  
    // ✅ Αν δεν ταιριάζει με destination → AI
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5050/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a travel assistant for TravelGuide. Only provide information about these destinations: ${availableDestinations
                .map((d) => d.name)
                .join(', ')}. If asked about anything else, respond: "Sorry, I can only help with our listed destinations."`,
            },
            ...newMessages.map((m) => ({ role: m.role, content: String(m.content) })),
          ],
        }),
      });
  
      const data = await res.json();
      setMessages([...newMessages, data.reply]);
    } catch (error) {
      console.error('Chat request failed:', error);
      setMessages([...newMessages, { role: 'assistant', content: "Oops! Something went wrong. Please try again." }]);
    }
  
    setLoading(false);
  };
  
  
  

  return (
    <>
      {/* Floating Button */}
      <Button
        position="fixed"
        bottom="20px"
        right="20px"
        colorScheme="teal"
        borderRadius="full"
        size="lg"
        zIndex="999"
        onClick={toggleChat}
      >
        🤖
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Box
          position="fixed"
          bottom="80px"
          right="20px"
          w="320px"
          h="420px"
          bg="white"
          border="1px solid #ccc"
          borderRadius="md"
          boxShadow="lg"
          display="flex"
          flexDirection="column"
          zIndex="1000"
        >
          {/* Header */}
          <Box bg="teal.500" color="white" p={2} borderTopRadius="md" textAlign="center" fontWeight="bold">
            ChatBuddy
          </Box>

          {/* Messages */}
          <VStack flex="1" spacing={2} align="stretch" overflowY="auto" p={3} bg="gray.50">
            {messages.map((m, i) => (
              <Box
                key={i}
                alignSelf={m.role === 'user' ? 'flex-end' : 'flex-start'}
                bg={m.role === 'user' ? 'teal.100' : 'gray.200'}
                px={3}
                py={2}
                borderRadius="lg"
                maxW="80%"
                boxShadow="sm"
              >
                <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: m.content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: teal; text-decoration: underline;">$1</a>') }} />

              </Box>
            ))}
            {loading && <Text fontSize="sm" color="gray.500">Bot is typing...</Text>}
            <div ref={messagesEndRef} />
          </VStack>

          {/* Input */}
          <HStack p={2} borderTop="1px solid #ccc">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              size="sm"
            />
            <Button size="sm" onClick={sendMessage} colorScheme="teal">
              Send
            </Button>
          </HStack>
        </Box>
      )}
    </>
  );
};

export default ChatBuddy;
