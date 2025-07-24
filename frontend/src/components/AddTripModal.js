import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@chakra-ui/icons';
import React, { forwardRef } from 'react';

export function AddTripModal({ destination, onSave }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('Planning');
  const [tripTitle, setTripTitle] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
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
      ...destination,
      title: tripTitle,
      startDate,
      endDate,
      status,
      addedAt: new Date().toISOString(),
    };

    try {
      await onSave(tripData); // this calls addTrip from useTrips
      toast({
        title: 'Trip added successfully!',
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
    await onSave({
    destination_id: destination.id,
    title: tripTitle,
    start_date: startDate,
    end_date: endDate,
    status
  });
  onClose();
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button onClick={onClick} ref={ref} leftIcon={<CalendarIcon />} size="sm">
      {value || 'Select date'}
    </Button>
  ));
  
  

  return (
    <>
      <Button colorScheme="teal" onClick={onOpen}>
        Book Now
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Trip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Trip Title</FormLabel>
              <Input value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Start Date</FormLabel>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                customInput={<CustomInput />}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>End Date</FormLabel>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                customInput={<CustomInput />}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Planning">Planning</option>
                <option value="Confirmed">Confirmed</option>
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
