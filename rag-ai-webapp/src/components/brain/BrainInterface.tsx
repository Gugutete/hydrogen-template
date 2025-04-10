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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Tag,
  TagLabel,
  TagLeftIcon,
  HStack,
  VStack,
  Divider,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiFolder,
  FiFile,
  FiFileText,
  FiLink,
  FiMoreVertical,
  FiUpload,
  FiGlobe,
  FiClock,
  FiChevronDown,
} from 'react-icons/fi';

// Sample data for demonstration
const initialDocuments = [
  {
    id: 'd1',
    title: 'RAG System Architecture',
    type: 'pdf',
    size: '2.4 MB',
    dateAdded: '2023-10-15',
    tags: ['architecture', 'technical'],
  },
  {
    id: 'd2',
    title: 'Customer Onboarding Guide',
    type: 'docx',
    size: '1.8 MB',
    dateAdded: '2023-10-12',
    tags: ['guide', 'customer'],
  },
  {
    id: 'd3',
    title: 'Product Roadmap 2023',
    type: 'pptx',
    size: '4.2 MB',
    dateAdded: '2023-09-28',
    tags: ['roadmap', 'internal'],
  },
  {
    id: 'd4',
    title: 'API Documentation',
    type: 'webpage',
    url: 'https://api.example.com/docs',
    dateAdded: '2023-10-05',
    tags: ['api', 'technical'],
  },
  {
    id: 'd5',
    title: 'Sales Performance Q3',
    type: 'xlsx',
    size: '3.1 MB',
    dateAdded: '2023-10-01',
    tags: ['sales', 'report'],
  },
  {
    id: 'd6',
    title: 'Company Blog',
    type: 'webpage',
    url: 'https://example.com/blog',
    dateAdded: '2023-09-20',
    tags: ['marketing', 'public'],
  },
];

const BrainInterface = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(documents.flatMap(doc => doc.tags))
  );
  
  // Filter documents based on search and tags
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => doc.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Get icon based on document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
      case 'pptx':
      case 'xlsx':
        return FiFileText;
      case 'webpage':
        return FiGlobe;
      default:
        return FiFile;
    }
  };
  
  // Get color based on document type
  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'red';
      case 'docx':
        return 'blue';
      case 'pptx':
        return 'orange';
      case 'xlsx':
        return 'green';
      case 'webpage':
        return 'purple';
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
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderRadius="lg"
          />
        </InputGroup>
        
        <HStack spacing={3}>
          <Menu>
            <MenuButton 
              as={Button} 
              rightIcon={<FiChevronDown />}
              variant="outline"
              borderRadius="lg"
            >
              Add Content
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUpload />}>Upload File</MenuItem>
              <MenuItem icon={<FiLink />}>Add Web Link</MenuItem>
              <MenuItem icon={<FiFolder />}>Create Folder</MenuItem>
            </MenuList>
          </Menu>
          
          <Menu>
            <MenuButton 
              as={Button} 
              leftIcon={<FiFilter />}
              variant="outline"
              borderRadius="lg"
            >
              Filter
            </MenuButton>
            <MenuList>
              <MenuItem>All Documents</MenuItem>
              <MenuItem>Recent</MenuItem>
              <MenuItem>PDF Files</MenuItem>
              <MenuItem>Web Pages</MenuItem>
              <MenuItem>Spreadsheets</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
      
      {/* Tags */}
      {allTags.length > 0 && (
        <Box mb={6}>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Filter by Tags
          </Text>
          <Flex wrap="wrap" gap={2}>
            {allTags.map(tag => (
              <Tag
                key={tag}
                size="md"
                borderRadius="full"
                variant={selectedTags.includes(tag) ? "solid" : "outline"}
                colorScheme="brand"
                cursor="pointer"
                onClick={() => toggleTag(tag)}
              >
                <TagLeftIcon as={FiFolder} boxSize="12px" />
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </Flex>
        </Box>
      )}
      
      {/* Document Grid */}
      {filteredDocuments.length > 0 ? (
        <Grid 
          templateColumns="repeat(auto-fill, minmax(280px, 1fr))" 
          gap={6}
        >
          {filteredDocuments.map(doc => (
            <Card 
              key={doc.id} 
              borderRadius="xl" 
              overflow="hidden" 
              variant="outline"
              _hover={{
                boxShadow: 'md',
                borderColor: 'brand.300',
              }}
            >
              <CardBody>
                <Flex justify="space-between" mb={3}>
                  <Flex 
                    w="40px" 
                    h="40px" 
                    borderRadius="lg" 
                    bg={`${getDocumentColor(doc.type)}.100`}
                    color={`${getDocumentColor(doc.type)}.500`}
                    justify="center"
                    align="center"
                  >
                    <Icon as={getDocumentIcon(doc.type)} boxSize="20px" />
                  </Flex>
                  
                  <IconButton
                    aria-label="More options"
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="sm"
                  />
                </Flex>
                
                <Text fontWeight="bold" mb={1} noOfLines={2}>
                  {doc.title}
                </Text>
                
                <HStack spacing={2} mb={3}>
                  <Badge colorScheme={getDocumentColor(doc.type)}>
                    {doc.type.toUpperCase()}
                  </Badge>
                  
                  {doc.size && (
                    <Text fontSize="xs" color="gray.500">
                      {doc.size}
                    </Text>
                  )}
                </HStack>
                
                {doc.tags.length > 0 && (
                  <Flex wrap="wrap" gap={2}>
                    {doc.tags.map(tag => (
                      <Tag
                        key={`${doc.id}-${tag}`}
                        size="sm"
                        borderRadius="full"
                        variant="subtle"
                        colorScheme="gray"
                      >
                        <TagLabel>{tag}</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                )}
              </CardBody>
              
              <Divider />
              
              <CardFooter py={2}>
                <Flex align="center" w="full">
                  <Icon as={FiClock} boxSize="12px" color="gray.500" mr={1} />
                  <Text fontSize="xs" color="gray.500">
                    Added on {doc.dateAdded}
                  </Text>
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
          <Icon as={FiFile} fontSize="4xl" color="gray.400" mb={4} />
          <Text fontSize="xl" fontWeight="medium" mb={2} textAlign="center">
            No documents found
          </Text>
          <Text color="gray.500" mb={6} textAlign="center">
            {searchQuery || selectedTags.length > 0 
              ? "Try adjusting your search or filters"
              : "Start by adding documents to your Brain"}
          </Text>
          
          <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            borderRadius="lg"
          >
            Add Your First Document
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default BrainInterface;
