import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Flex, HStack, Spacer, Text, IconButton, useDisclosure,VStack,useBreakpointValue } from '@chakra-ui/react';
import Home from './pages/Home';
import DestinationDetails from './pages/DestinationDetails';
import MyTrips from './pages/MyTrips';
import { NavLink } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import DestinationsPage from './pages/DestinationsPage'; 



function App() {
  const navStyle = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    backgroundColor: isActive ? '#38B2AC' : 'transparent', // teal.400
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none'
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Router>
      <Box>
        <Flex as="nav" bg="teal.500" p={4} color="white" align="center">
          <Text
              as={Link}
              to="/"
              fontWeight="bold"
              fontSize="xl"
              textDecoration="none"
              transition="all 0.3s ease"
              _hover={{
                transform: "scale(1.05)"
              }}
            >
              🌍TravelGuide
            </Text>

            
            <Spacer />

{isMobile ? (
  <>
    <IconButton
      icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
      variant="ghost"
      colorScheme="whiteAlpha"
      onClick={isOpen ? onClose : onOpen}
      aria-label="Toggle Navigation"
    />
    {isOpen && (
      <VStack
        pos="absolute"
        top="60px"
        right="20px"
        bg="teal.600"
        p={4}
        rounded="md"
        spacing={3}
        zIndex={999}
      >
        <NavLink to="/" style={navStyle} onClick={onClose}>Home</NavLink>
        <NavLink to="/destinations" style={navStyle} onClick={onClose}>Destinations</NavLink>
        <NavLink to="/my-trips" style={navStyle} onClick={onClose}>My Trips</NavLink>
      </VStack>
    )}
  </>
) : (
  <HStack spacing={4}>
    <NavLink to="/" style={navStyle}>Home</NavLink>
    <NavLink to="/destinations" style={navStyle}>Destinations</NavLink>
    <NavLink to="/my-trips" style={navStyle}>My Trips</NavLink>
  </HStack>
)}
</Flex>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/destinations" element={<DestinationsPage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
