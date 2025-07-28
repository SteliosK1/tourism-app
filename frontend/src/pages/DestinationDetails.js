import {
  Box,
  Heading,
  Text,
  Flex,
  Stack,
  Button,
  List,
  ListItem,
  useToast,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import { AddTripModal } from '../components/AddTripModal';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const DestinationDetails = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { createTrip } = useTrips();

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/destinations/${id}`);
        setDestination(res.data);

        // Κλήση για clicks
        await axios.post(`http://localhost:5050/api/destinations/${id}/click`);
       
      } catch (err) {
        console.error('Failed to fetch destination:', err);
        toast({
          title: 'Error loading destination.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id, toast]);

  // const handleAddTrip = async () => {
  //   try {
  //     const newTrip = {
  //       destination_id: destination.id,
  //       date: new Date().toISOString().split('T')[0], // placeholder ημερομηνία
  //     };
  //     await createTrip(newTrip);
  //     navigate('/my-trips');
  //   } catch (err) {
  //     console.error('Failed to add trip:', err);
  //   }
  // };

  if (loading) {
    return (
      <Box p={6}>
        <Text>Loading destination...</Text>
      </Box>
    );
  }

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
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'blackAlpha.600',
          zIndex: 0,
        }}
      >
        <Heading position="relative" zIndex={1}>
          {destination.name}
        </Heading>
        <Text fontSize="xl" position="relative" zIndex={1}>
          {destination.tagline}
        </Text>
      </Box>

      <Stack spacing={6}>
        <Box>
          <Heading size="md" mb={2}>About {destination.name}</Heading>
          <Text>{destination.description}</Text>
        </Box>

        <Box>
          <Heading size="md" mb={2}>🎯 Top Attractions</Heading>
          <List spacing={1}>
            {destination.attractions?.map((attraction, idx) => (
              <ListItem key={idx}>• {attraction}</ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Heading size="md" mb={2}>🍽 Local Cuisine</Heading>
          <Text>{destination.cuisine}</Text>
        </Box>

        <Box>
          <Heading size="md" mb={2}>Trip Information</Heading>
          <Text><strong>Best Time to Visit:</strong> {destination.bestTime}</Text>
          <Text><strong>Currency:</strong> {destination.currency}</Text>
          <Text><strong>Language:</strong> {destination.language}</Text>
          <Text><strong>Average Cost:</strong> {destination.average_cost}</Text>
        </Box>

        <Flex gap={4}>
        <Button
        mb={10}
  colorScheme="blue"
  onClick={async () => {
    await createTrip({
      destination_id: destination.id,
      title: destination.name,
      start_date: null,
      end_date: null,
      status: "saved", // 👈 εδώ είναι το σημαντικό
    });

    toast({
      title: "Trip saved to your trips!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position:"top"
    });
  }}
>
  Add to My Trips
</Button>

<AddTripModal
  destination={destination}
  onSave={createTrip}  
/>


        </Flex>
      </Stack>
    </Box>
  );
};

export default DestinationDetails;
