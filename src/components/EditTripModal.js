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
  
  export function EditTripModal({ trip, onSave }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [startDate, setStartDate] = useState(trip.startDate || '');
    const [endDate, setEndDate] = useState(trip.endDate || '');
    const [status, setStatus] = useState(trip.status || 'Planning');
  
    const handleSave = () => {
      onSave({
        ...trip,
        startDate,
        endDate,
        status,
      });
      onClose();
    };
    
    return (
      <>
        <Button size="sm" variant="outline" onClick={onOpen}>
          Edit Trip
        </Button>
  
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Trip to {trip.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Planning">Planning</option>
                  <option value="Confirmed">Confirmed</option>
                </Select>
              </FormControl>
            </ModalBody>
  
            <ModalFooter>
              <Button onClick={onClose} mr={3}>
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={handleSave}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  