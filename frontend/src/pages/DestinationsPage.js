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
} from '@chakra-ui/react';

import { Link as RouterLink } from 'react-router-dom';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" mt={12} px={4}>
        <Heading fontSize="2xl" mb={2} color="teal.500">
        📍 Popular Destinations
        </Heading>
        <Box height="2px" bg="teal.500" mb={6} />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {destinations.map((dest) => (
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
