import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Button, FormControl, FormLabel,
  Input, Select, useDisclosure, useToast
} from '@chakra-ui/react';
import React, { useState } from 'react';


export function AddTripModal({ destination, onSave }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('Planning');
  const [tripTitle, setTripTitle] = useState('');
  const toast = useToast();
  
  const formatDateOnly = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`; // YYYY-MM-DD χωρίς ώρα
  };
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Please fill in all fields including dates.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      toast({
        title: 'Start date cannot be in the past.',
        description: "Please select a valid start date.",
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      toast({
        title: 'Start date cannot be later than end date.',
        description: "The start date cannot be later than the end date.",
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
  
    const tripData = {
      destination_id: destination.id,
      title: tripTitle,
      start_date: formatDateOnly(startDate), 
      end_date: formatDateOnly(endDate),     
      status: status.toLowerCase(), 
    };
    
    try {
      await onSave(tripData);
      toast({
        title: 'Trip booked successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      onClose();
    } catch (err) {
      toast({
        title: 'Failed to add trip.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };
  return (
    <>
      <Button colorScheme="teal" onClick={onOpen}>
        Book Now
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
  width={{ base: '90%', sm: '80%', md: '500px' }}
  mx="auto"
>

          <ModalHeader>Add Trip: {destination.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Trip Title</FormLabel>
              <Input value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} />
            </FormControl>

            <FormControl mb={3}>
  <FormLabel>Start Date</FormLabel>
  <Input
    type="date"
    value={startDate ? formatDateOnly(startDate) : ""}
    onChange={(e) => setStartDate(new Date(e.target.value))}
  />
</FormControl>

<FormControl mb={3}>
  <FormLabel>End Date</FormLabel>
  <Input
    type="date"
    value={endDate ? formatDateOnly(endDate) : ""}
    onChange={(e) => setEndDate(new Date(e.target.value))}
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
            <Button onClick={handleSubmit} colorScheme="blue" mr={3}>
              Save Trip
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
