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
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export function EditTripModal({ trip, onSave }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startDate, setStartDate] = useState(trip.startDate || '');
  const [endDate, setEndDate] = useState(trip.endDate || '');
  const [status, setStatus] = useState(trip.status || 'Planning');
  const [showError, setShowError] = useState(false);
  const toast = useToast();

  const handleSave = async () => {
    if (startDate && endDate && startDate > endDate) {
      setShowError(true);
      return;
    }

    try {
      await onSave(trip.id, {
        ...trip,
        startDate,
        endDate,
        status,
      });

      toast({
        title: 'Trip updated!',
        status: 'success',
        duration: 3000,
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
        position: 'top',
      });
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={onOpen}>
        Edit Trip
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW={{ base: '90%', sm: '400px', md: '500px' }} mx="auto" borderRadius="lg">
          <ModalHeader>Edit Trip to {trip.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {showError && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                Start date must be before end date.
              </Alert>
            )}

            <FormControl mb={4}>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
            <Button onClick={handleSave} colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
