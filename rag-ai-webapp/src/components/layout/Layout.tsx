import { Box, useColorModeValue } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showCollaborators?: boolean;
}

const Layout = ({ children, title, subtitle, showCollaborators }: LayoutProps) => {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Sidebar />
      <Box ml="280px" position="relative">
        <Header 
          title={title} 
          subtitle={subtitle} 
          showCollaborators={showCollaborators} 
        />
        <Box as="main" pt="80px" px={6} pb={6}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
