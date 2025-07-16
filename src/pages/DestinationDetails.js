import {
  Box,
  Heading,
  Text,
  Flex,
  Stack,
  Button,
  List,
  ListItem
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import destinations from '../data/destinations';
import { useTrips } from '../hooks/useTrips';
import { useToast } from '@chakra-ui/react';
import { AddTripModal } from '../components/AddTripModal';

function DestinationDetails() {
  const { id } = useParams();
  const destination = destinations.find((d) => d.id === Number(id));
  const { addTrip, trips } = useTrips();
  const toast = useToast();

  if (!destination) {
    return (
      <Box p={6}>
        <Heading>Destination Not Found...</Heading>
      </Box>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" mt={6} px={4}>
      {/* Banner */}
      <Box
        bgImage={`url(${destination.image})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        color="white"
        py={20}
        px={4}
        textAlign="center"
        borderRadius="md"
        mb={8}
        position="relative"
        _after={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          w: "100%",
          h: "100%",
          bg: "rgba(0, 0, 0, 0.4)",
          borderRadius: "md",
          zIndex: 0
        }}
      >
      <Box position="relative" zIndex={1}>
        <Heading fontSize="3xl" mb={2}>{destination.name}</Heading>
        {destination.tagline && (
          <Text fontSize="md">{destination.tagline}</Text>
        )}
      </Box>
    </Box>


      <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
        {/* Left Column */}
        <Stack spacing={6} flex={3}>
          {/* About */}
          <Box bg="gray.50" p={4} borderRadius="md">
            <Heading size="md" mb={2}>About {destination.name.split(',')[0]}</Heading>
            <Text>{destination.description}</Text>
          </Box>

          {/* Attractions */}
          <Box bg="gray.50" p={4} borderRadius="md">
            <Heading size="md" mb={2}>🎯 Top Attractions</Heading>
            <List spacing={1}>
              {destination.attractions?.map((item, i) => (
                <ListItem key={i}>• {item}</ListItem>
              ))}
            </List>
          </Box>

          {/* Cuisine */}
          <Box bg="gray.50" p={4} borderRadius="md">
            <Heading size="md" mb={2}>🍽️ Local Cuisine</Heading>
            <Text>{destination.cuisine}</Text>
          </Box>
        </Stack>

        {/* Right Column */}
        <Box bg="gray.50" p={4} borderRadius="md" flex={1}>
          <Heading size="md" mb={4}>Trip Information</Heading>
          <Stack spacing={2} mb={6}>
            <Text><strong>Best Time to Visit:</strong> {destination.tripInfo?.bestTime}</Text>
            <Text><strong>Currency:</strong> {destination.tripInfo?.currency}</Text>
            <Text><strong>Language:</strong> {destination.tripInfo?.language}</Text>
            <Text><strong>Average Cost:</strong> {destination.tripInfo?.cost}</Text>
          </Stack>

          <Stack spacing={3}>
          <AddTripModal
  destination={destination}
  onAdd={(tripData) => {
    const alreadyExists = trips.some((t) => t.id === tripData.id);
    if (alreadyExists) {
      toast({
        title: "Already in My Trips",
        description: `${tripData.name} is already saved.`,
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } else {
      addTrip(tripData);
      toast({
        title: "Added to My Trips!",
        description: `${tripData.name} was successfully saved.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }}
/>
            <Button colorScheme="green">Book Now</Button>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
}

export default DestinationDetails;
