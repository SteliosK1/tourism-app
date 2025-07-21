import {
  Box,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Badge,
  Image,
  Button,
  HStack
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import destinations from '../data/destinations';

function Home() {
  const [search, setSearch] = useState('');
  const filtered = destinations.filter(dest =>
    dest.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* ✅ HERO SECTION */}
      <Box
        w="100%"
        bg="teal.500"
        color="white"
        py={16}
        px={4}
        textAlign="center"
        // borderBottomRadius={3}
      >
        <Heading fontSize="4xl" mb={4}>
          Discover Amazing Places
        </Heading>

        <Text fontSize="lg" mb={6}>
          Find your next adventure with our curated travel destinations
        </Text>

        <Box display="flex" justifyContent="center">
          <InputGroup maxW="500px" w="100%">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg="white"
              color="black"
              borderRadius="md"
            />
          </InputGroup>
        </Box>
      </Box>

      {/* ✅ DESTINATION SECTION */}
      <Box maxW="1200px" mx="auto" mt={12} px={4}>
        <Heading fontSize="2xl" mb={2} color="teal.500">
        📍 Popular Destinations
        </Heading>
        <Box height="2px" bg="teal.500" mb={6} />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filtered.filter((destination) => destination.rating > 4.5)
          .map(dest => (
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
    </>
  );
}

export default Home;
