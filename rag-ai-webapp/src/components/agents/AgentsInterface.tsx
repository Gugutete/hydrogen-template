import { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  Text,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Badge,
  Avatar,
  Progress,
  Switch,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  HStack,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiCopy,
  FiDatabase,
  FiSettings,
  FiChevronDown,
  FiActivity,
  FiCpu,
} from 'react-icons/fi';

// Sample data for demonstration
const initialAgents = [
  {
    id: 'a1',
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries and support tickets',
    status: 'active',
    memoryUsage: 78,
    connectedSources: 5,
    lastActive: '2 hours ago',
    type: 'support',
  },
  {
    id: 'a2',
    name: 'Sales Assistant',
    description: 'Provides product recommendations and sales information',
    status: 'active',
    memoryUsage: 45,
    connectedSources: 3,
    lastActive: '30 minutes ago',
    type: 'sales',
  },
  {
    id: 'a3',
    name: 'Data Analyst',
    description: 'Analyzes business data and generates reports',
    status: 'inactive',
    memoryUsage: 12,
    connectedSources: 8,
    lastActive: '3 days ago',
    type: 'analytics',
  },
  {
    id: 'a4',
    name: 'Knowledge Base Agent',
    description: 'Manages and retrieves information from the knowledge base',
    status: 'active',
    memoryUsage: 92,
    connectedSources: 12,
    lastActive: '5 minutes ago',
    type: 'knowledge',
  },
];

const AgentsInterface = () => {
  const [agents, setAgents] = useState(initialAgents);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter agents based on search
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle agent status
  const toggleAgentStatus = (id: string) => {
    setAgents(agents.map(agent => 
      agent.id === id 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' } 
        : agent
    ));
  };
  
  // Get color based on agent type
  const getAgentColor = (type: string) => {
    switch (type) {
      case 'support':
        return 'blue';
      case 'sales':
        return 'green';
      case 'analytics':
        return 'purple';
      case 'knowledge':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      {/* Top Controls */}
      <Flex mb={6} justify="space-between" align="center" wrap="wrap" gap={4}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search agents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderRadius="lg"
          />
        </InputGroup>
        
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          borderRadius="lg"
        >
          Create New Agent
        </Button>
      </Flex>
      
      {/* Agent Grid */}
      {filteredAgents.length > 0 ? (
        <Grid 
          templateColumns="repeat(auto-fill, minmax(320px, 1fr))" 
          gap={6}
        >
          {filteredAgents.map(agent => (
            <Card 
              key={agent.id} 
              borderRadius="xl" 
              overflow="hidden" 
              variant="outline"
              borderColor={agent.status === 'active' 
                ? `${getAgentColor(agent.type)}.200` 
                : useColorModeValue('gray.200', 'gray.700')
              }
              _hover={{
                boxShadow: 'md',
              }}
            >
              <CardBody>
                <Flex justify="space-between" mb={4}>
                  <Avatar 
                    bg={`${getAgentColor(agent.type)}.500`}
                    icon={<Icon as={FiCpu} fontSize="1.5rem" />}
                  />
                  
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="More options"
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem icon={<FiEdit />}>Edit Agent</MenuItem>
                      <MenuItem icon={<FiCopy />}>Duplicate</MenuItem>
                      <MenuItem icon={<FiSettings />}>Configure</MenuItem>
                      <Divider />
                      <MenuItem icon={<FiTrash2 />} color="red.500">Delete Agent</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
                
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontWeight="bold" fontSize="lg">
                    {agent.name}
                  </Text>
                  
                  <Badge 
                    colorScheme={agent.status === 'active' ? 'green' : 'gray'}
                    borderRadius="full"
                    px={2}
                  >
                    {agent.status}
                  </Badge>
                </Flex>
                
                <Text color="gray.500" fontSize="sm" mb={4} noOfLines={2}>
                  {agent.description}
                </Text>
                
                <Box mb={4}>
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="xs" fontWeight="medium">Memory Usage</Text>
                    <Text fontSize="xs">{agent.memoryUsage}%</Text>
                  </Flex>
                  <Progress 
                    value={agent.memoryUsage} 
                    size="sm" 
                    borderRadius="full"
                    colorScheme={
                      agent.memoryUsage > 80 ? 'red' : 
                      agent.memoryUsage > 50 ? 'yellow' : 
                      'green'
                    }
                  />
                </Box>
                
                <HStack spacing={4} mb={2}>
                  <Flex align="center">
                    <Icon as={FiDatabase} boxSize="14px" color="gray.500" mr={1} />
                    <Text fontSize="xs" color="gray.500">
                      {agent.connectedSources} sources
                    </Text>
                  </Flex>
                  
                  <Flex align="center">
                    <Icon as={FiActivity} boxSize="14px" color="gray.500" mr={1} />
                    <Text fontSize="xs" color="gray.500">
                      {agent.lastActive}
                    </Text>
                  </Flex>
                </HStack>
              </CardBody>
              
              <Divider />
              
              <CardFooter py={3}>
                <Flex justify="space-between" align="center" w="full">
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<FiSettings />}
                    colorScheme={getAgentColor(agent.type)}
                  >
                    Configure
                  </Button>
                  
                  <FormControl display="flex" alignItems="center" width="auto">
                    <FormLabel htmlFor={`agent-status-${agent.id}`} mb="0" fontSize="sm">
                      Active
                    </FormLabel>
                    <Switch 
                      id={`agent-status-${agent.id}`} 
                      isChecked={agent.status === 'active'}
                      onChange={() => toggleAgentStatus(agent.id)}
                      colorScheme={getAgentColor(agent.type)}
                    />
                  </FormControl>
                </Flex>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      ) : (
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          py={12}
          px={4}
          borderRadius="xl"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Icon as={FiCpu} fontSize="4xl" color="gray.400" mb={4} />
          <Text fontSize="xl" fontWeight="medium" mb={2} textAlign="center">
            No agents found
          </Text>
          <Text color="gray.500" mb={6} textAlign="center">
            {searchQuery 
              ? "Try adjusting your search"
              : "Create your first AI agent to start automating tasks"}
          </Text>
          
          <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            borderRadius="lg"
          >
            Create Your First Agent
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default AgentsInterface;
