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
  HStack,
} from '@chakra-ui/react';
import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const filtered = destinations.filter(dest =>
    dest.name.toLowerCase().includes(search.toLowerCase())
  );
  

  useEffect(() => {
    fetch('http://localhost:5050/api/destinations')
      .then(res => res.json())
      .then(data => setDestinations(data))
      .catch(err => console.error(err));
  }, []);
  
  
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
      {/* searchbar */}
        <Box display="flex" justifyContent="center">
    <Box position="relative" w="100%" maxW="500px">
    <InputGroup>
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

    {search && filtered.length > 0 && (
      <Box
        position="absolute"
        bg="white"
        color="black"
        border="1px solid #e2e8f0"
        borderRadius="md"
        mt={1}
        w="100%"
        zIndex={20}
        boxShadow="md"
      >
        {filtered.slice(0, 5).map((item) => (
         <Box
         key={item.id}
         as={RouterLink}
         to={`/destination/${item.id}`}
         display="flex"
         alignItems="center"
         justifyContent="flex-start"
         p={2}
         borderRadius="md"
         _hover={{ bg: 'gray.100' }}
         cursor="pointer"
       >
         <Image
           src={item.image}
           boxSize="50px"
           borderRadius="md"
           objectFit="cover"
         />
         <Text 
           fontSize="md" 
           fontWeight="medium" 
           textAlign="center" 
           flex="1"  // παίρνει όλο το υπόλοιπο πλάτος
         >
           {item.name}
         </Text>
       </Box>
       
        ))}
      </Box>
    )}
  </Box>
</Box>

      </Box>

      {/* ✅ DESTINATION SECTION */}
      <Box maxW="1200px" mx="auto" mt={12} px={4}>
        <Heading fontSize="2xl" mb={2} color="teal.500">
        📍 Popular Destinations
        </Heading>
        <Box height="2px" bg="teal.500" mb={6} />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {[...destinations]
  .sort((a, b) => b.clicks - a.clicks)  // ταξινόμηση με clicks φθίνουσα
  .slice(0, 4) // δείξε π.χ. top 4
  .map(dest => (
              <Box
              key={dest.id}
              as={RouterLink}
              to={`/destination/${dest.id}`}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              boxShadow="none"
              _hover={{ cursor: 'pointer', bg: 'gray.100' }} // Προαιρετικά
              >

              <Image src={dest.image} alt={dest.name} height="200px" width="100%" objectFit="cover" />
              <Box p={4}>
                <Heading size="md" mb={2}>{dest.name}</Heading>
                <Text mb={2}>{dest.description}</Text>
                <HStack justifyContent="space-between">
                  <Badge colorScheme="yellow">⭐ {dest.rating}/5</Badge>
                  <Badge colorScheme="purple">🔥 {dest.clicks} clicks</Badge>
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

<Box textAlign="center" mt={10} mb={10}>
  <Button
    as={RouterLink}
    to="/destinations"
    colorScheme="blue"
    size="lg"
    borderRadius="full"
    px={4}
    py={2}
    mb={2}
    color="white"
    _hover={{ transform: 'scale(1.1)', bg: 'blue.600' }}
  >
    <ArrowForwardIcon />
  </Button>
  <Text fontSize="md" color="gray.600" fontFamily="italic">
    Explore All Destinations
  </Text>
</Box>
      </Box>
    </>
  );
}

export default Home;
