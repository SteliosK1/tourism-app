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

  useEffect(() => {
    if (trip) {
      setTitle(trip.title || '');
      setStartDate(trip.start_date?.split('T')[0] || '');
      setEndDate(trip.end_date?.split('T')[0] || '');
      setStatus(trip.status || 'Planning');
    }
  }, [trip]);

  const handleSave = async () => {
    if (!title || !startDate || !endDate) {
      toast({
        title: 'Please fill in all fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (startDate > endDate) {
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
        status,
      });

      toast({
        title: 'Trip updated successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
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
      <ModalContent>
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

          <FormControl>
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
