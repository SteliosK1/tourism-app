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
  Input,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { FaSortAlphaDown, FaStar } from 'react-icons/fa';
import CustomSortIcon from './CustomSortIcon';
export const getDestinations = () => {
  return axios.get('http://localhost:5050/api/destinations');
};

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState('');

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
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });


  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
    
  }

  return (
    <Box maxW="1200px" mx="auto" mt={12} px={4}>
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={4}>
  <Heading fontSize="2xl" color="teal.500">
    📍 All Destinations
  </Heading>
  {/* sort button */}
    <Flex gap={4} align="center">
    <Menu>
    <Tooltip label="Sort Options">
      <MenuButton
        as={IconButton}
        aria-label="Sort"
        icon={<CustomSortIcon size={20} color="black" />
      }
        variant="outline"
        // colorScheme="teal"
      />
      </Tooltip>
      <MenuList>
        <MenuItem icon={<FaSortAlphaDown />} onClick={() => setSortBy('alphabetical')}>
          Sort A-Z
        </MenuItem>
        <MenuItem icon={<FaStar />} onClick={() => setSortBy('rating')}>
          Sort by Rating
        </MenuItem>
      </MenuList>
    </Menu>
    {/* Search Bar */}
    <Flex
      align="center"
      onMouseEnter={() => setShowSearch(true)}
      onMouseLeave={() => setShowSearch(false)}
      bg="white"
      borderRadius="full"
      px={showSearch ? 4 : 2}
      py={2}
      border="1px solid"
      borderColor="gray.300"
      w={showSearch ? '300px' : '40px'}
      transition="all 0.3s ease"
      position="relative"
    >
      <SearchIcon color="teal.500" boxSize={5} />
      <Input
        ml={2}
        variant="unstyled"
        placeholder="Search destinations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        display={showSearch ? 'block' : 'none'}
        autoFocus={showSearch}
      />
    </Flex>
  </Flex>
</Flex>

<Box height="2px" bg="teal.500" mb={6} />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={6}>
        {sortedDestinations.map((dest) => (
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
