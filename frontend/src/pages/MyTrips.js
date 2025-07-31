import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  Badge,
  VStack,
  HStack,
  Divider,
  Image,
  useToast,
  
  useDisclosure
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { EditTripModal } from '../components/EditTripModal';
import { useTrips } from '../hooks/useTrips';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enGB } from "date-fns/locale";
import { Tooltip } from "@chakra-ui/react"; // Βεβαιώσου ότι το έχεις στο import



export default function MyTrips() {
  const { trips, updateTrip, removeTrip } = useTrips();
  const toast = useToast();
  const locales = { "en-GB": enGB };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [hasNavigated, setHasNavigated] = useState(false); // ✅ Νέο state

  
  const saved = trips.filter(trip => trip.status?.toLowerCase() === "saved");
  let planned = trips.filter(trip =>
    ["planning", "confirmed"].includes(trip.status?.toLowerCase())
  );// Φιλτράρισμα planning + confirmed
  planned = trips.filter(trip =>
    ["planning", "confirmed"].includes(trip.status?.toLowerCase())
  );
  
  // Ταξινόμηση κατά ημερομηνία έναρξης (αύξουσα)
  planned = planned.sort((a, b) => {
    const dateA = a.dates 
      ? parse(a.dates.split("–")[0].trim(), "dd/MM/yyyy", new Date())
      : (a.start_date ? new Date(a.start_date) : new Date(8640000000000000)); // Μεγάλη τιμή για null
  
    const dateB = b.dates 
      ? parse(b.dates.split("–")[0].trim(), "dd/MM/yyyy", new Date())
      : (b.start_date ? new Date(b.start_date) : new Date(8640000000000000));
  
    return dateA - dateB;
  });
  
  // Δημιουργία events από ΟΛΑ τα planned trips (planning + confirmed)
  const calendarEvents = planned.map(trip => {
    console.log("Trip Object:", trip);
  
    // Αν υπάρχει πεδίο dates τύπου "02/08/2025 – 12/08/2025"
    let start, end;
    if (trip.dates) {
      const [startStr, endStr] = trip.dates.split("–").map(d => d.trim());
      start = parse(startStr, "dd/MM/yyyy", new Date());
      end = parse(endStr, "dd/MM/yyyy", new Date());
    } else {
      // Fallback αν υπάρχουν ξεχωριστά πεδία
      start = trip.start_date ? new Date(trip.start_date) : new Date();
      end = trip.end_date ? new Date(trip.end_date) : start;
    }
    return {
      title: trip.name,
      destination: trip.destination,     
      tagline: trip.tagline,   
      image: trip.image,          
      start,
      end: new Date(end.getTime() + 24 * 60 * 60 * 1000),
      status: trip.status?.toLowerCase() || "planning"
    };
  });
 

useEffect(() => {
  if (!hasNavigated && calendarEvents.length > 0) {
    const upcomingTrip = calendarEvents
      .filter(event => event.start >= new Date())
      .sort((a, b) => a.start - b.start)[0];

    if (upcomingTrip) {
      setCalendarDate(upcomingTrip.start); // ✅ Πήγαινε στο επόμενο ταξίδι
      setHasNavigated(true); // ✅ Μην ξανατρέξεις
    }
  }
}, [calendarEvents, hasNavigated]);

const EventWithTooltip = ({ event }) => {
    const startDate = event.start.toLocaleDateString("en-GB");
    const endDate = event.end.toLocaleDateString("en-GB");
  
    return (
      <Tooltip 
        label={`${event.title}\n${event.destination || ""}\n${event.tagline || ""}\n${startDate} – ${endDate}`} 
        aria-label="Trip details"
        hasArrow
        bg="gray.700"
        color="white"
        placement="top"
      >
        <span>{event.title}</span>
      </Tooltip>
    );
  };
  const AgendaEvent = ({ event }) => (
    <Box
      display="flex"
      alignItems="center"
      gap={4}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      p={3}
      border="1px solid"
      borderColor="gray.200"
      _hover={{ boxShadow: "md", transform: "scale(1.02)", transition: "0.2s" }}
      w="100%"
      minH="90px" // ✅ σταθερό ύψος για όλες τις κάρτες
    >
      <Image
        src={event.image}
        alt={event.title}
        boxSize="70px" // ✅ σταθερό μέγεθος εικόνας
        borderRadius="md"
        objectFit="cover"
      />
      <Box flex="1" minW={0}>
        <HStack spacing={2} align="center" mb={1}>
          <Text 
            fontWeight="bold" 
            color="black" 
            fontSize="md"
            isTruncated // ✅ κόβει πολύ μεγάλο τίτλο
          >
            {event.title}
          </Text>
          <Badge colorScheme={event.status === "confirmed" ? "green" : "yellow"}>
            {event.status.toUpperCase()}
          </Badge>
        </HStack>
        <Text fontSize="sm" color="gray.600" isTruncated>
          {event.destination}
        </Text>
        <Text fontSize="xs" color="gray.500" isTruncated noOfLines={1}>
          {event.tagline}
        </Text>
      </Box>
    </Box>
  );
  

  
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
                <Badge
                  colorScheme={
                    trip.status?.toLowerCase() === "planning"
                      ? "yellow"
                      : trip.status?.toLowerCase() === "confirmed"
                      ? "green"
                      : "gray"
                  }
                >
                  {trip.status}
                </Badge>

                <Stack direction="row" mt={3}>
                <Button as={Link} to={`/destination/${trip.destination_id}`} size="sm" colorScheme="blue">
                  View Details
                </Button>
                  <Button colorScheme="red" size="sm" onClick={() => handleDelete(trip.id)}>
                    Delete
                  </Button>
                  <Button colorScheme="gray" variant="solid" size="sm" onClick={() => handleEditClick(trip)}>
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
      </VStack><Heading fontSize="lg" mt={8} mb={2}>📅 Travel Calendar</Heading>
      <Divider mb={4} />
      <Calendar
  localizer={localizer}
  events={calendarEvents}
  startAccessor="start"
  endAccessor="end"
  date={calendarDate} 
  onNavigate={(date) => setCalendarDate(date)} 
  style={{ height: 600, margin: "10px 0", borderRadius: "8px" }}
  views={['month', 'week', 'day', 'agenda']}  // ✅ Προσθήκη Agenda
  defaultView="month"
  eventPropGetter={(event) => {
    let backgroundColor = "#3182CE";
    if (event.status === "confirmed") backgroundColor = "#75c99c";
    if (event.status === "planning") backgroundColor = "#dbb844";
    return { style: { backgroundColor, color: "white", borderRadius: "5px" } };
  }}
  components={{
    event: EventWithTooltip,
    agenda: {
      event: AgendaEvent, // ✅ custom agenda row
    }
  }}
  
/>


    </Box>
  );
}
