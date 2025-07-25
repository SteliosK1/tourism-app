import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  Badge,
  VStack,
  Divider,
  Image,
  useToast,
  
  useDisclosure
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { EditTripModal } from '../components/EditTripModal';
import { useTrips } from '../hooks/useTrips';



export default function MyTrips() {
  const { trips, updateTrip, removeTrip } = useTrips();
  const toast = useToast();

  const saved = trips.filter((trip) => trip.status === "saved");
  const planned = trips.filter(trip => trip.status?.toLowerCase() === 'planning'|| trip.status?.toLowerCase() === 'confirmed');
  
  const [selectedTrip, setSelectedTrip] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEditClick = (trip) => {
    setSelectedTrip(trip);
    onOpen();
  };

  const handleUpdateTrip = async (id, updatedData) => {
    await updateTrip(id, updatedData);
    onClose();
  };
  const handleDelete = (id) => {
    removeTrip(id); 
    toast({
      title: 'Your trip has been deleted.',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };
  

  return (
    <Box maxW="1000px" mx="auto" p={6}>
      <Heading mb={2}>My Travel Plans</Heading>
      <Text mb={6}>Manage your saved destinations and planned trips</Text>

      {/* Saved Destinations */}
      <Heading fontSize="xl" mb={2} color="red.500">📌 Saved Destinations
      </Heading>
      <Divider mb={4} />

      <VStack spacing={4} align="stretch">
        {saved.length === 0 ? (
          <Text>No saved destinations.</Text>
        ) : (
          saved.map((trip) => (
            <Box
              key={trip.id}
              p={4}
              bg="gray.50"
              borderRadius="md"
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems="flex-start"
              gap={4}
            >
              <Box flexShrink={0}>
                <Image
                  src={trip.image}
                  alt={trip.name}
                  borderRadius="md"
                  boxSize="150px"
                  objectFit="cover"
                />
              </Box>
              <Box flex="1">
                <Heading size="md">{trip.name}</Heading>
               <p>
                  Added on{' '}
                  {trip.added_at
                  ? new Date(trip.added_at).toLocaleDateString('en-GB') // ή 'el-GR' αν θες ελληνική μορφή
                  : 'N/A'}
                </p>

                {/* ✅ Εδώ μπαίνει το tagline */}
                <Text mt={1} mb={2} fontSize="sm" color="gray.700" fontStyle={'italic'}>
                    {trip.tagline}
                  </Text>


                <Stack direction="row">
                <Button as={Link} to={`/destination/${trip.destination_id}`} size="sm" colorScheme="blue">
                  View Details
                </Button>
                  <Button colorScheme="red" size="sm" onClick={() => handleDelete(trip.id)}>
                    Delete
                  </Button>
                </Stack>
              </Box>
            </Box>
          ))
        )}
      </VStack>

      {/* Planned Trips */}
      <Heading fontSize="xl" mt={10} mb={2} color="blue.600">✈️ Planned Trips
      </Heading>
      <Divider mb={4} />

      <VStack spacing={4} align="stretch">
        {planned.length === 0 ? (
          <Text>No planned trips.</Text>
        ) : (
          planned.map((trip) => (
            <Box
              key={trip.id}
              p={4}
              bg="gray.50"
              borderRadius="md"
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems="flex-start"
              gap={4}
            >
              <Box flexShrink={0}>
                <Image
                  src={trip.image}
                  alt={trip.name}
                  borderRadius="md"
                  boxSize="150px"
                  objectFit="cover"
                />
              </Box>
              <Box flex="1">
                <Text>{trip.title}</Text>
                <Heading size="md">{trip.name}</Heading>
                <Text fontSize="sm" color="gray.500">
                Dates: {new Date(trip.start_date).toLocaleDateString()} – {new Date(trip.end_date).toLocaleDateString()}
                </Text>
                <Text>Destination: {trip.name}</Text>
                <Badge colorScheme={
                  trip.status === 'Confirmed' ? 'green' :
                  trip.status === 'Planning' ? 'yellow' :
                  'gray'
                }>
                  Status: {trip.status}
                </Badge>
                <Stack direction="row" mt={3}>
                <Button as={Link} to={`/destination/${trip.destination_id}`} size="sm" colorScheme="blue">
                  View Details
                </Button>
                  <Button colorScheme="red" size="sm" onClick={() => handleDelete(trip.id)}>
                    Delete
                  </Button>
                  <Button colorScheme="green" onClick={() => handleEditClick(trip)}>
                    Edit
                  </Button>
                      
                  {selectedTrip && (
        <EditTripModal
          trip={selectedTrip}
          onSave={handleUpdateTrip}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
                  </Stack>
              </Box>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
}
