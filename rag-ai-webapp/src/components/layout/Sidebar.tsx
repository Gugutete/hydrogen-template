import { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  Icon,
  Text,
  Divider,
  IconButton,
  useColorMode,
  useColorModeValue,
  Tooltip,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FiFolder,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiSettings,
  FiStar,
  FiMenu,
  FiMoreVertical,
  FiChevronDown,
  FiChevronRight,
  FiDatabase,
  FiUsers,
} from 'react-icons/fi';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

// Folder/Chat item component
const SidebarItem = ({ 
  icon, 
  label, 
  isActive = false, 
  isFolder = false,
  hasChildren = false,
  isExpanded = false,
  onToggleExpand,
  onSelect,
  level = 0
}: {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  isFolder?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onSelect?: () => void;
  level?: number;
}) => {
  const bgColor = useColorModeValue(
    isActive ? 'gray.100' : 'transparent',
    isActive ? 'gray.700' : 'transparent'
  );
  
  return (
    <Flex
      align="center"
      p={2}
      mx={2}
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={bgColor}
      _hover={{
        bg: useColorModeValue('gray.100', 'gray.700'),
      }}
      onClick={onSelect}
      pl={`${(level * 8) + 8}px`}
    >
      {hasChildren && (
        <IconButton
          aria-label="Toggle folder"
          icon={isExpanded ? <FiChevronDown /> : <FiChevronRight />}
          variant="ghost"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand?.();
          }}
        />
      )}
      {!hasChildren && level > 0 && <Box w="20px" />}
      <Icon as={icon} mr={3} fontSize="16" />
      <Text flex={1} noOfLines={1}>{label}</Text>
      {isFolder && (
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            size="xs"
            onClick={(e) => e.stopPropagation()}
          />
          <MenuList>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Delete</MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};

// Sidebar component
const Sidebar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [activeSection, setActiveSection] = useState('chat');
  
  // Mock data for folders and chats
  const [folders, setFolders] = useState([
    { 
      id: '1', 
      name: 'Work Projects', 
      isExpanded: true,
      children: [
        { id: '1-1', name: 'Project Alpha', type: 'folder', isExpanded: false, children: [] },
        { id: '1-2', name: 'Customer Support', type: 'chat' },
      ]
    },
    { 
      id: '2', 
      name: 'Personal', 
      isExpanded: false,
      children: []
    },
  ]);

  // Toggle folder expansion
  const toggleFolderExpand = (folderId: string) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, isExpanded: !folder.isExpanded };
      }
      return folder;
    }));
  };

  return (
    <Box
      w="280px"
      h="100vh"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      position="fixed"
      left={0}
      top={0}
    >
      {/* Sidebar Header */}
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          RAG AI
        </Text>
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
          onClick={toggleColorMode}
          variant="ghost"
        />
      </Flex>

      {/* New Chat/Folder Button */}
      <Flex px={4} mb={4}>
        <Button 
          leftIcon={<FiPlus />} 
          colorScheme="brand" 
          w="full"
          borderRadius="lg"
        >
          New Chat
        </Button>
      </Flex>

      {/* Search */}
      <Box px={4} mb={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input placeholder="Search" borderRadius="lg" />
        </InputGroup>
      </Box>

      {/* Navigation Tabs */}
      <Flex px={4} mb={4}>
        <Button 
          flex={1} 
          variant={activeSection === 'chat' ? 'solid' : 'ghost'} 
          colorScheme={activeSection === 'chat' ? 'brand' : 'gray'}
          onClick={() => setActiveSection('chat')}
          mr={2}
          size="sm"
        >
          Chats
        </Button>
        <Button 
          flex={1} 
          variant={activeSection === 'brain' ? 'solid' : 'ghost'} 
          colorScheme={activeSection === 'brain' ? 'brand' : 'gray'}
          onClick={() => setActiveSection('brain')}
          size="sm"
        >
          Brain
        </Button>
      </Flex>

      {/* Folders and Chats */}
      <VStack spacing={1} align="stretch" overflowY="auto" h="calc(100vh - 240px)" px={2}>
        {activeSection === 'chat' && (
          <>
            <SidebarItem 
              icon={FiStar} 
              label="Starred" 
              isActive={false} 
            />
            <Divider my={2} />
            
            {folders.map(folder => (
              <Box key={folder.id}>
                <SidebarItem 
                  icon={FiFolder} 
                  label={folder.name} 
                  isFolder={true}
                  hasChildren={true}
                  isExpanded={folder.isExpanded}
                  onToggleExpand={() => toggleFolderExpand(folder.id)}
                />
                
                {folder.isExpanded && folder.children.map(child => (
                  <SidebarItem 
                    key={child.id}
                    icon={child.type === 'folder' ? FiFolder : FiMessageSquare} 
                    label={child.name} 
                    level={1}
                    isFolder={child.type === 'folder'}
                    hasChildren={child.type === 'folder' && child.children?.length > 0}
                    isExpanded={child.isExpanded}
                  />
                ))}
              </Box>
            ))}
          </>
        )}
        
        {activeSection === 'brain' && (
          <>
            <SidebarItem icon={FiDatabase} label="Documents" />
            <SidebarItem icon={FiUsers} label="Agents" />
          </>
        )}
      </VStack>

      {/* Bottom Section */}
      <Box 
        position="absolute" 
        bottom={0} 
        left={0} 
        right={0}
        p={4}
        borderTop="1px"
        borderTopColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <Box 
              w={8} 
              h={8} 
              borderRadius="full" 
              bg="brand.500" 
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr={2}
            >
              U
            </Box>
            <Text fontWeight="medium">User Name</Text>
          </Flex>
          <IconButton
            aria-label="Settings"
            icon={<FiSettings />}
            variant="ghost"
            size="sm"
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default Sidebar;
