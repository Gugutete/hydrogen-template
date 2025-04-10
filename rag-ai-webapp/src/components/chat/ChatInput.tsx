import { useState, useRef } from 'react';
import {
  Box,
  Flex,
  Textarea,
  IconButton,
  useColorModeValue,
  Tooltip,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { 
  FiSend, 
  FiPaperclip, 
  FiMic, 
  FiMaximize2, 
  FiMinimize2,
  FiLink,
  FiFile,
  FiImage,
  FiMoreHorizontal
} from 'react-icons/fi';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      
      // Focus back on textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      position="fixed"
      bottom={6}
      right={6}
      left="calc(280px + 24px)"
      zIndex={10}
    >
      <Box
        borderWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        borderRadius="xl"
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="lg"
        p={4}
      >
        <Flex mb={isExpanded ? 3 : 0}>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question or type '/' for commands..."
            resize="none"
            minH={isExpanded ? "200px" : "60px"}
            maxH={isExpanded ? "400px" : "120px"}
            borderRadius="lg"
            mr={2}
            flex={1}
          />
          
          <Flex direction="column" justify="space-between">
            <IconButton
              aria-label={isExpanded ? "Minimize" : "Expand"}
              icon={isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="sm"
            />
            
            <IconButton
              aria-label="Send message"
              icon={<FiSend />}
              onClick={handleSendMessage}
              colorScheme="brand"
              size="md"
              isDisabled={!message.trim()}
            />
          </Flex>
        </Flex>
        
        {isExpanded && (
          <Flex justify="space-between" align="center">
            <Flex>
              <Menu>
                <Tooltip label="Attach file">
                  <MenuButton
                    as={IconButton}
                    aria-label="Attach file"
                    icon={<FiPaperclip />}
                    variant="ghost"
                    size="sm"
                    mr={2}
                  />
                </Tooltip>
                <MenuList>
                  <MenuItem icon={<FiFile />}>Document</MenuItem>
                  <MenuItem icon={<FiImage />}>Image</MenuItem>
                  <MenuItem icon={<FiLink />}>Web Link</MenuItem>
                </MenuList>
              </Menu>
              
              <Tooltip label="Voice input">
                <IconButton
                  aria-label="Voice input"
                  icon={<FiMic />}
                  variant="ghost"
                  size="sm"
                  mr={2}
                />
              </Tooltip>
              
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="More options"
                  icon={<FiMoreHorizontal />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem>Clear conversation</MenuItem>
                  <MenuItem>Save as template</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            
            <Text fontSize="xs" color="gray.500">
              Press Enter to send, Shift+Enter for new line
            </Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default ChatInput;
