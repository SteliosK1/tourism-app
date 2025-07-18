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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { EditTripModal } from '../components/EditTripModal';
import { useTrips } from '../hooks/useTrips';

export default function MyTrips() {
  const { trips, updateTrip, removePlannedTrip } = useTrips();
  const toast = useToast();
  const saved = trips.filter((t) => !t.startDate);
  const planned = trips.filter((t) => t.startDate);
  

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
              {trip.title && (
  <Text fontStyle="italic" fontSize="sm" mt={1}>
    {trip.title}
  </Text>
)}

              <Box flex="1">
                <Heading size="md">{trip.name}</Heading>
                <Text fontSize="sm" color="gray.500">
                  Added on {new Date(trip.addedAt).toLocaleDateString()}
                </Text>
                <Text my={2}>{trip.tagline}</Text>
                <Stack direction="row">
                  <Button as={Link} to={`/destination/${trip.id}`} size="sm" colorScheme="blue">
                    View Details
                  </Button>
                  <Button colorScheme="red" size="sm" onClick={() => removePlannedTrip(trip.id)}>
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
                <Heading size="md">{trip.name}</Heading>
                <Text fontSize="sm" color="gray.500">
                  Dates: {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
                </Text>
                <Text>Destination: {trip.name}</Text>
                <Badge colorScheme={trip.status === 'Confirmed' ? 'green' : 'yellow'}>
                  Status: {trip.status}
                </Badge>
                <Stack direction="row" mt={3}>
                <Button as={Link} to={`/destination/${trip.id}`} size="sm" colorScheme="blue">
                    View Details
                  </Button>
                  <Button colorScheme="red" size="sm" onClick={() => removePlannedTrip(trip.id)}>
                    Delete
                  </Button>
                      
                  <EditTripModal
                      trip={trip}
                      onSave={(updatedTrip) => {
                        updateTrip(updatedTrip);
                        toast({
                          title: 'Trip updated',
                          description: `${updatedTrip.name} has been updated.`,
                          status: 'success',
                          duration: 3000,
                          isClosable: true,
                          position: 'top',
                        });
                      }}
                    />
                  </Stack>
              </Box>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
}
