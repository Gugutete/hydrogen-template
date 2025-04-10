import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  useColorModeValue,
  IconButton,
  Collapse,
  Button,
  Divider,
  Link,
  Badge,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp, FiCopy, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

interface Source {
  id: string;
  title: string;
  type: 'pdf' | 'text' | 'webpage';
  url?: string;
  relevance: number; // 0-100
}

interface ChatMessageProps {
  message: string;
  isAi: boolean;
  timestamp: string;
  sources?: Source[];
}

const ChatMessage = ({ message, isAi, timestamp, sources }: ChatMessageProps) => {
  const [showSources, setShowSources] = useState(false);
  
  const bgColor = useColorModeValue(
    isAi ? 'white' : 'brand.50',
    isAi ? 'gray.700' : 'brand.900'
  );
  
  const borderColor = useColorModeValue(
    isAi ? 'gray.200' : 'brand.200',
    isAi ? 'gray.600' : 'brand.700'
  );

  return (
    <Box 
      mb={6}
      maxW="100%"
    >
      <Flex mb={2} align="center">
        <Avatar 
          size="sm" 
          name={isAi ? "AI Assistant" : "You"} 
          bg={isAi ? "brand.500" : "gray.500"}
          color="white"
          mr={2}
        />
        <Text fontWeight="medium">{isAi ? "AI Assistant" : "You"}</Text>
        <Text fontSize="xs" color="gray.500" ml={2}>
          {timestamp}
        </Text>
      </Flex>
      
      <Box
        p={4}
        borderRadius="xl"
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="sm"
        position="relative"
      >
        <Text mb={sources && sources.length > 0 ? 4 : 0}>{message}</Text>
        
        {isAi && sources && sources.length > 0 && (
          <>
            <Divider my={3} />
            
            <Flex justify="space-between" align="center">
              <Button 
                size="xs" 
                variant="ghost" 
                rightIcon={showSources ? <FiChevronUp /> : <FiChevronDown />}
                onClick={() => setShowSources(!showSources)}
              >
                {showSources ? "Hide sources" : "Show sources"} ({sources.length})
              </Button>
              
              <Flex>
                <IconButton
                  aria-label="Copy message"
                  icon={<FiCopy />}
                  size="xs"
                  variant="ghost"
                  mr={2}
                />
                <IconButton
                  aria-label="Thumbs up"
                  icon={<FiThumbsUp />}
                  size="xs"
                  variant="ghost"
                  mr={1}
                />
                <IconButton
                  aria-label="Thumbs down"
                  icon={<FiThumbsDown />}
                  size="xs"
                  variant="ghost"
                />
              </Flex>
            </Flex>
            
            <Collapse in={showSources} animateOpacity>
              <Box mt={3} p={3} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="md">
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Sources
                </Text>
                
                {sources.map((source) => (
                  <Box 
                    key={source.id} 
                    p={2} 
                    mb={2} 
                    borderRadius="md" 
                    borderWidth="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                  >
                    <Flex justify="space-between" align="center" mb={1}>
                      <Flex align="center">
                        <Badge 
                          colorScheme={
                            source.type === 'pdf' ? 'red' : 
                            source.type === 'webpage' ? 'blue' : 'green'
                          }
                          mr={2}
                        >
                          {source.type.toUpperCase()}
                        </Badge>
                        <Text fontSize="sm" fontWeight="medium">
                          {source.title}
                        </Text>
                      </Flex>
                      <Badge 
                        colorScheme={
                          source.relevance > 80 ? 'green' : 
                          source.relevance > 50 ? 'yellow' : 'red'
                        }
                      >
                        {source.relevance}% relevant
                      </Badge>
                    </Flex>
                    
                    {source.url && (
                      <Link 
                        href={source.url} 
                        color="brand.500" 
                        fontSize="xs"
                        isExternal
                      >
                        {source.url}
                      </Link>
                    )}
                  </Box>
                ))}
              </Box>
            </Collapse>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessage;
