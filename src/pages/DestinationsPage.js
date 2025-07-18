// src/pages/DestinationsPage.js

import {
  Box,
  Heading,
  SimpleGrid,
  Image,
  Text,
  Button,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { MdStar } from 'react-icons/md';
import destinations from '../data/destinations';

const DestinationsPage = () => {
  return (
    <Box maxW="1200px" mx="auto" mt={12} px={4}>
        <Heading fontSize="2xl" mb={2} color="teal.500">
        📍 Popular Destinations
        </Heading>
        <Box height="2px" bg="teal.500" mb={6} />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {destinations.map(dest => (
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
