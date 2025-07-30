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
  Tooltip,
  FormControl,
  Select,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { MdFilterAlt } from "react-icons/md";
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
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

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const filteredDestinations = destinations.filter((destination) =>
  destination.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const sortedDestinations = [...filteredDestinations].sort((a, b) => {
  if (sortBy === 'alphabetical') {
    return a.name.localeCompare(b.name);
  } else if (sortBy === 'rating') {
    return b.rating - a.rating;
  } else if (sortBy === 'clicks' || sortBy === '' || sortBy === 'none') {
    // Προεπιλογή: ταξινόμηση με clicks φθίνουσα
    return b.clicks_last_30_days - a.clicks_last_30_days;
  }
  return 0;
});
// ✅ Pagination setup
const [currentPage, setCurrentPage] = useState(1);
const [destinationsPerPage, setDestinationsPerPage] = useState(4);
const totalPages = Math.ceil(sortedDestinations.length / destinationsPerPage);

const indexOfLastDestination = currentPage * destinationsPerPage;
const indexOfFirstDestination = indexOfLastDestination - destinationsPerPage;
const currentDestinations = sortedDestinations.slice(indexOfFirstDestination, indexOfLastDestination);

const handleNextPage = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};

const handlePrevPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};



  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
    
  }

  return (
    <Box maxW="1200px" mx="auto" mt={8} px={4}>
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={4}>
  <Heading fontSize="2xl" color="teal.500">
    📍 All Destinations
  </Heading>
  
  {/* filters button */}
    <Flex gap={4} align="center">
    <Menu>
    <FormControl width="70px">
  <Select
    value={destinationsPerPage}
    onChange={(e) => {
      setDestinationsPerPage(Number(e.target.value));
      setCurrentPage(1); // Επαναφορά στην πρώτη σελίδα
    }}
  >
    <option value={4}>4</option>
    <option value={8}>8</option>
    <option value={12}>12</option>
    <option value={20}>20</option>
  </Select>
</FormControl>
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
      <MenuItem icon={<MdFilterAlt />}  onClick={() => setSortBy('none')}>
        Νone
      </MenuItem>

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
      w={showSearch ? '220px' : '40px'}
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
        {currentDestinations.map((dest) => (

    <Box
      key={dest.id}
      as={RouterLink}
      to={`/destination/${dest.id}`}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
      _hover={{ cursor: 'pointer', bg: 'gray.100' }} // Προαιρετικά
    >
      <Image src={dest.image} alt={dest.name} height="200px" width="100%" objectFit="cover" />
      <Box p={4}>
        <Heading size="md" mb={2}>{dest.name}</Heading>
        <Text mb={2}>{dest.description}</Text>
        <HStack justifyContent="space-between">
          <Badge colorScheme="yellow">⭐ {dest.rating}/5</Badge>
          <Badge 
  style={{
    backgroundColor:
      dest.clicks_last_30_days > 100
        ? '#EF4444' // κόκκινο (πολύ δημοφιλές)
        : dest.clicks_last_30_days >= 50
        ? '#F97316' // πορτοκαλί (μεσαίο)
        : '#22C55E', // πράσινο (χαμηλό)
    color: 'white',
    padding: '4px 8px',
    borderRadius: '8px',
    fontWeight: 'bold',
    display: 'inline-block',
    marginTop: '6px'
  }}
>
  🔥 {dest.clicks_last_30_days} clicks

</Badge>
                 
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
<Flex justify="center" m={6} gap={4}>
  <Button onClick={handlePrevPage} isDisabled={currentPage === 1}>
    Previous
  </Button>
  <Text alignSelf="center">
    Page {currentPage} of {totalPages}
  </Text>
  <Button onClick={handleNextPage} isDisabled={currentPage === totalPages}>
    Next
  </Button>
</Flex>
{showScrollTop && (
  <Button
    position="fixed"
    bottom="100px"
    right="20px"
    colorScheme="teal"
    borderRadius="full"
    boxShadow="md"
    onClick={scrollToTop}
  >
    ↑ Top
  </Button>
)}

      </Box>
  
);
};

export default DestinationsPage;
