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
    InputGroup,
    InputLeftElement 
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';
  import { CalendarIcon } from '@chakra-ui/icons';
  import React, { forwardRef } from 'react';

  export function AddTripModal({ destination, onAdd }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
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
    const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <CalendarIcon color="gray.400" />
        </InputLeftElement>
        <Input
          onClick={onClick}
          ref={ref}
          value={value}
          placeholder={placeholder}
          readOnly
        />
      </InputGroup>
    ));
  
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
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Select start date"
                customInput={<CustomDateInput placeholder="Select start date" />}
                dateFormat="dd/MM/yyyy"
                isClearable
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>End Date</FormLabel>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Select end date"
                customInput={<CustomDateInput placeholder="Select end date" />}
                dateFormat="dd/MM/yyyy"
                isClearable
              />
            </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)} >
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
  