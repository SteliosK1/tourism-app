import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export function EditTripModal({ trip, onSave, isOpen, onClose }) {
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Planning');

  // ✅ helper για καθαρή ημερομηνία
const formatDateOnly = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  useEffect(() => {
    if (trip) {
      setTitle(trip.title || '');
      setStartDate(formatDateOnly(trip.start_date));
      setEndDate(formatDateOnly(trip.end_date));
      setStatus(trip.status || 'Planning');
    }
  }, [trip]);

  const handleSave = async () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Please fill in all fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (start < today) {
      toast({
        title: 'Start date cannot be in the past.',
        description: "Please select a valid start date.",
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
  
    if (start > end) {
      toast({
        title: 'Start date must be before end date.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      await onSave(trip.id, {
        title,
        start_date: startDate,
        end_date: endDate,
        status: status.toLowerCase(),
      });
  
      toast({
        title: 'Trip updated successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
  
      onClose();
    } catch (err) {
      toast({
        title: 'Failed to update trip.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
  width={{ base: '90%', sm: '80%', md: '500px' }}
  mx="auto"
>

        <ModalHeader>Edit Trip</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mb={3}>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
  <FormLabel>Status</FormLabel>
  <Select value={status} onChange={(e) => setStatus(e.target.value)}>
    <option value="planning">Planning</option>
    <option value="confirmed">Confirmed</option>
    <option value="saved">Saved</option>
  </Select>
</FormControl>

        </ModalBody>

        <ModalFooter>
          <Button onClick={handleSave} colorScheme="blue" mr={3}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
