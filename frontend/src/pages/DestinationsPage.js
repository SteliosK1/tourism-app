import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Center,
  Spinner,
  HStack,
  Badge,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  Flex
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
export const getDestinations = () => {
  return axios.get('http://localhost:5050/api/destinations');
};

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5050/api/destinations') 
      .then((res) => res.json())
      .then((data) => {
        setDestinations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch destinations:', error);
        setLoading(false);
      });
  }, []);
  
  const filteredDestinations = destinations.filter((destination) =>
  destination.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
    
  }

  return (
    <Box maxW="1200px" mx="auto" mt={12} px={4}>
        <Flex justify="space-between" align="center" mb={6} wrap="wrap">
  <Heading fontSize="2xl" color="teal.500" mb={{ base: 2, md: 0 }}>
    📍 Popular Destinations
  </Heading>
  <InputGroup maxW="400px" ml={{ base: 0, md: 'auto' }}>
    <InputLeftElement pointerEvents="none">
      <SearchIcon color="gray.400" />
    </InputLeftElement>
    <Input
      placeholder="Search destinations..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      bg="white"
      borderColor="gray.300"
      focusBorderColor="teal.500"
      borderRadius="md"
    />
  </InputGroup>
</Flex>
<Box height="2px" bg="teal.500" mb={6} />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={6}>
  {filteredDestinations.map((dest) => (
    <Box
      key={dest.id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
    >
      <Image src={dest.image} alt={dest.name} height="200px" width="100%" objectFit="cover" />
      <Box p={4}>
        <Heading size="md" mb={2}>{dest.name}</Heading>
        <Text mb={2}>{dest.description}</Text>
        <HStack justifyContent="space-between">
          <Badge colorScheme="yellow">⭐ {dest.rating}/5</Badge>
          <Button
            as={RouterLink}
            to={`/destination/${dest.id}`}
            size="sm"
            colorScheme="teal"
          >
            View Details
          </Button>
        </HStack>
      </Box>
    </Box>
  ))}
</SimpleGrid>

      </Box>
  );
};

export default DestinationsPage;
