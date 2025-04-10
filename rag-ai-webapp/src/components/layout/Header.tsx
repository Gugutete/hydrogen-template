import {
  Box,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Avatar,
  AvatarGroup,
} from '@chakra-ui/react';
import { FiMoreHorizontal, FiShare2, FiUsers } from 'react-icons/fi';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showCollaborators?: boolean;
}

const Header = ({ title, subtitle, showCollaborators = false }: HeaderProps) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="header"
      position="fixed"
      w="calc(100% - 280px)"
      right={0}
      top={0}
      bg={bgColor}
      borderBottom="1px"
      borderBottomColor={borderColor}
      px={6}
      py={4}
      zIndex={10}
    >
      <Flex justify="space-between" align="center">
        <Flex direction="column">
          <Text fontSize="xl" fontWeight="bold">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="sm" color="gray.500">
              {subtitle}
            </Text>
          )}
        </Flex>

        <HStack spacing={4}>
          {showCollaborators && (
            <Flex align="center">
              <AvatarGroup size="sm" max={3} mr={2}>
                <Avatar name="User 1" bg="brand.500" />
                <Avatar name="User 2" bg="green.500" />
                <Avatar name="User 3" bg="blue.500" />
              </AvatarGroup>
              <IconButton
                aria-label="Manage collaborators"
                icon={<FiUsers />}
                variant="ghost"
                size="sm"
              />
            </Flex>
          )}

          <Button
            leftIcon={<FiShare2 />}
            variant="outline"
            size="sm"
            borderRadius="lg"
          >
            Share
          </Button>

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<FiMoreHorizontal />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem>Rename</MenuItem>
              <MenuItem>Export</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
