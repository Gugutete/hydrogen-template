import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  Divider,
  SimpleGrid,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormHelperText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
} from '@chakra-ui/react';
import {
  FiShoppingCart,
  FiUsers,
  FiDatabase,
  FiMail,
  FiCalendar,
  FiLink,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiSettings,
  FiRefreshCw,
  FiCheck,
  FiX,
} from 'react-icons/fi';

// Sample data for demonstration
const initialIntegrations = [
  {
    id: 'i1',
    name: 'E-Commerce Platform',
    description: 'Connect to your online store',
    icon: FiShoppingCart,
    status: 'connected',
    lastSync: '10 minutes ago',
    type: 'ecommerce',
  },
  {
    id: 'i2',
    name: 'CRM System',
    description: 'Manage customer relationships',
    icon: FiUsers,
    status: 'connected',
    lastSync: '1 hour ago',
    type: 'crm',
  },
  {
    id: 'i3',
    name: 'Database',
    description: 'Connect to your database',
    icon: FiDatabase,
    status: 'disconnected',
    type: 'database',
  },
  {
    id: 'i4',
    name: 'Email Marketing',
    description: 'Integrate with email campaigns',
    icon: FiMail,
    status: 'disconnected',
    type: 'email',
  },
  {
    id: 'i5',
    name: 'Calendar',
    description: 'Sync with your calendar',
    icon: FiCalendar,
    status: 'connected',
    lastSync: '3 hours ago',
    type: 'calendar',
  },
  {
    id: 'i6',
    name: 'Custom API',
    description: 'Connect to custom endpoints',
    icon: FiLink,
    status: 'disconnected',
    type: 'api',
  },
];

const IntegrationsSettings = () => {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Toggle integration status
  const toggleIntegrationStatus = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected',
            lastSync: integration.status === 'disconnected' ? 'Just now' : integration.lastSync
          } 
        : integration
    ));
  };
  
  // Open configuration modal
  const openConfigModal = (integration: any) => {
    setSelectedIntegration(integration);
    setApiKey(integration.status === 'connected' ? 'sk-1234567890abcdefghijklmnopqrstuvwxyz' : '');
    onOpen();
  };

  return (
    <Box>
      {/* Section Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={1}>
            Integrations
          </Text>
          <Text color="gray.500">
            Connect your AI system with external services and data sources
          </Text>
        </Box>
        
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          borderRadius="lg"
        >
          Add New Integration
        </Button>
      </Flex>
      
      {/* Integrations Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
        {integrations.map(integration => (
          <Card 
            key={integration.id} 
            borderRadius="xl" 
            overflow="hidden" 
            variant="outline"
            borderColor={integration.status === 'connected' 
              ? 'green.200'
              : useColorModeValue('gray.200', 'gray.700')
            }
            _hover={{
              boxShadow: 'md',
            }}
          >
            <CardBody>
              <Flex justify="space-between" mb={4}>
                <Flex 
                  w="40px" 
                  h="40px" 
                  borderRadius="lg" 
                  bg={useColorModeValue('gray.100', 'gray.700')}
                  color={integration.status === 'connected' ? 'green.500' : 'gray.500'}
                  justify="center"
                  align="center"
                >
                  <Icon as={integration.icon} boxSize="20px" />
                </Flex>
                
                <Badge 
                  colorScheme={integration.status === 'connected' ? 'green' : 'gray'}
                  borderRadius="full"
                  px={2}
                >
                  {integration.status}
                </Badge>
              </Flex>
              
              <Text fontWeight="bold" fontSize="lg" mb={1}>
                {integration.name}
              </Text>
              
              <Text color="gray.500" fontSize="sm" mb={4}>
                {integration.description}
              </Text>
              
              {integration.status === 'connected' && integration.lastSync && (
                <Flex align="center" mb={2}>
                  <Icon as={FiRefreshCw} boxSize="12px" color="gray.500" mr={1} />
                  <Text fontSize="xs" color="gray.500">
                    Last synced: {integration.lastSync}
                  </Text>
                </Flex>
              )}
            </CardBody>
            
            <Divider />
            
            <CardFooter py={3}>
              <Flex justify="space-between" align="center" w="full">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<FiSettings />}
                  onClick={() => openConfigModal(integration)}
                >
                  Configure
                </Button>
                
                <FormControl display="flex" alignItems="center" width="auto">
                  <FormLabel htmlFor={`integration-status-${integration.id}`} mb="0" fontSize="sm">
                    Active
                  </FormLabel>
                  <Switch 
                    id={`integration-status-${integration.id}`} 
                    isChecked={integration.status === 'connected'}
                    onChange={() => toggleIntegrationStatus(integration.id)}
                    colorScheme="green"
                  />
                </FormControl>
              </Flex>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
      
      {/* Configuration Modal */}
      {selectedIntegration && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent borderRadius="xl">
            <ModalHeader>
              <Flex align="center">
                <Icon as={selectedIntegration.icon} mr={2} />
                {selectedIntegration.name} Configuration
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            
            <Divider />
            
            <ModalBody py={4}>
              <Tabs variant="enclosed" borderRadius="lg" colorScheme="brand">
                <TabList>
                  <Tab>Settings</Tab>
                  <Tab>Data Mapping</Tab>
                  <Tab>Permissions</Tab>
                </TabList>
                
                <TabPanels>
                  <TabPanel>
                    <FormControl mb={4}>
                      <FormLabel>API Key</FormLabel>
                      <InputGroup>
                        <Input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter API key"
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                            icon={showApiKey ? <FiEyeOff /> : <FiEye />}
                            variant="ghost"
                            onClick={() => setShowApiKey(!showApiKey)}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormHelperText>
                        Your API key is securely stored and encrypted
                      </FormHelperText>
                    </FormControl>
                    
                    <FormControl mb={4}>
                      <FormLabel>Endpoint URL</FormLabel>
                      <Input 
                        defaultValue={`https://api.${selectedIntegration.type}.example.com/v1`} 
                        placeholder="Enter endpoint URL"
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center" mb={4}>
                      <FormLabel htmlFor="auto-sync" mb="0">
                        Auto-sync data
                      </FormLabel>
                      <Switch id="auto-sync" defaultChecked={selectedIntegration.status === 'connected'} />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="webhook" mb="0">
                        Enable webhooks
                      </FormLabel>
                      <Switch id="webhook" defaultChecked={selectedIntegration.status === 'connected'} />
                    </FormControl>
                  </TabPanel>
                  
                  <TabPanel>
                    <Text mb={4}>
                      Configure how data is mapped between your systems
                    </Text>
                    
                    <Box 
                      p={3} 
                      borderRadius="md" 
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      mb={4}
                    >
                      <Flex justify="space-between" mb={2}>
                        <Text fontWeight="medium">Customer ID</Text>
                        <Badge colorScheme="green">
                          <Flex align="center">
                            <Icon as={FiCheck} boxSize="12px" mr={1} />
                            Mapped
                          </Flex>
                        </Badge>
                      </Flex>
                      <Code fontSize="sm" w="full" p={2}>
                        customer.id → user.external_id
                      </Code>
                    </Box>
                    
                    <Box 
                      p={3} 
                      borderRadius="md" 
                      bg={useColorModeValue('gray.50', 'gray.700')}
                    >
                      <Flex justify="space-between" mb={2}>
                        <Text fontWeight="medium">Order History</Text>
                        <Badge colorScheme="red">
                          <Flex align="center">
                            <Icon as={FiX} boxSize="12px" mr={1} />
                            Not Mapped
                          </Flex>
                        </Badge>
                      </Flex>
                      <Button size="sm" colorScheme="brand" mt={2}>
                        Configure Mapping
                      </Button>
                    </Box>
                  </TabPanel>
                  
                  <TabPanel>
                    <Text mb={4}>
                      Manage what data this integration can access
                    </Text>
                    
                    <FormControl display="flex" alignItems="center" mb={3}>
                      <Switch id="read-data" defaultChecked={true} mr={3} />
                      <FormLabel htmlFor="read-data" mb="0">
                        Read data from your system
                      </FormLabel>
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center" mb={3}>
                      <Switch id="write-data" defaultChecked={selectedIntegration.status === 'connected'} mr={3} />
                      <FormLabel htmlFor="write-data" mb="0">
                        Write data to your system
                      </FormLabel>
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center" mb={3}>
                      <Switch id="user-data" defaultChecked={false} mr={3} />
                      <FormLabel htmlFor="user-data" mb="0">
                        Access user personal data
                      </FormLabel>
                    </FormControl>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
            
            <Divider />
            
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={onClose}>
                Save Configuration
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default IntegrationsSettings;
