import { useState, useRef, useEffect } from 'react';
import { Box, VStack, Text, Button, Icon, Flex, useColorModeValue } from '@chakra-ui/react';
import { FiMessageSquare } from 'react-icons/fi';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

// Sample data for demonstration
const initialMessages = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    isAi: true,
    timestamp: '10:30 AM',
    sources: []
  }
];

const ChatInterface = () => {
  const [messages, setMessages] = useState(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      isAi: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: "Based on the documents in your Brain, I found that this information relates to your question. The data shows that RAG (Retrieval-Augmented Generation) systems combine the power of large language models with specific knowledge retrieval to provide more accurate and contextual responses.",
        isAi: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            id: 's1',
            title: 'Introduction to RAG Systems',
            type: 'pdf',
            url: 'https://example.com/rag-intro.pdf',
            relevance: 95
          },
          {
            id: 's2',
            title: 'Building Enterprise AI Solutions',
            type: 'webpage',
            url: 'https://example.com/enterprise-ai',
            relevance: 82
          },
          {
            id: 's3',
            title: 'Knowledge Base Integration Guide',
            type: 'text',
            relevance: 68
          }
        ]
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  return (
    <Box position="relative" h="calc(100vh - 80px)">
      {messages.length <= 1 ? (
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          h="calc(100vh - 200px)"
          px={4}
        >
          <Icon as={FiMessageSquare} fontSize="5xl" color="brand.500" mb={6} />
          <Text fontSize="2xl" fontWeight="bold" mb={2} textAlign="center">
            Start a conversation with your AI assistant
          </Text>
          <Text fontSize="md" color="gray.500" mb={8} textAlign="center" maxW="600px">
            Ask questions about your documents, get insights from your data, or explore new ideas with AI-powered assistance.
          </Text>
          
          <VStack spacing={4} w="full" maxW="600px">
            <Button 
              w="full" 
              p={6} 
              justifyContent="flex-start" 
              borderRadius="xl"
              bg={useColorModeValue('white', 'gray.700')}
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              boxShadow="sm"
              _hover={{
                bg: useColorModeValue('gray.50', 'gray.600'),
              }}
              onClick={() => handleSendMessage("What is a RAG system and how does it work?")}
            >
              What is a RAG system and how does it work?
            </Button>
            
            <Button 
              w="full" 
              p={6} 
              justifyContent="flex-start" 
              borderRadius="xl"
              bg={useColorModeValue('white', 'gray.700')}
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              boxShadow="sm"
              _hover={{
                bg: useColorModeValue('gray.50', 'gray.600'),
              }}
              onClick={() => handleSendMessage("How can I integrate my CRM system with this AI assistant?")}
            >
              How can I integrate my CRM system with this AI assistant?
            </Button>
            
            <Button 
              w="full" 
              p={6} 
              justifyContent="flex-start" 
              borderRadius="xl"
              bg={useColorModeValue('white', 'gray.700')}
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              boxShadow="sm"
              _hover={{
                bg: useColorModeValue('gray.50', 'gray.600'),
              }}
              onClick={() => handleSendMessage("Summarize the latest sales data from my e-commerce platform")}
            >
              Summarize the latest sales data from my e-commerce platform
            </Button>
          </VStack>
        </Flex>
      ) : (
        <Box 
          pt={4} 
          pb="120px" 
          px={4} 
          h="100%" 
          overflowY="auto"
        >
          <VStack spacing={6} align="stretch">
            {messages.map(message => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isAi={message.isAi}
                timestamp={message.timestamp}
                sources={message.sources}
              />
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
      )}
      
      <ChatInput onSendMessage={handleSendMessage} />
    </Box>
  );
};

export default ChatInterface;
