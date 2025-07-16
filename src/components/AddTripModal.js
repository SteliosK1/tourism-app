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
  } from '@chakra-ui/react';
  import { useState } from 'react';
  
  export function AddTripModal({ destination, onAdd }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('Planning');
  
    const handleSubmit = () => {
      const tripData = {
        ...destination,
        startDate,
        endDate,
        status,
        addedAt: new Date().toISOString(),
      };
      onAdd(tripData);
      onClose();
    };
  
    return (
      <>
        <Button colorScheme="blue" onClick={onOpen}>
          Add to My Trips
        </Button>
  
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Plan Your Trip to {destination.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Start Date</FormLabel>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>End Date</FormLabel>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Planning">Planning</option>
                  <option value="Confirmed">Confirmed</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} mr={3}>Cancel</Button>
              <Button colorScheme="teal" onClick={handleSubmit}>Save Trip</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  