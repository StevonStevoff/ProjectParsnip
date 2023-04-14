import React, { useState, useEffect } from 'react';
import {
  AlertDialog, Button, Select, Box, Center, CheckIcon,
} from 'native-base';

function AdditionDialog({
  isOpen, onClose, onConfirm, actionBtnText, selectionOptions,
}) {
  const [selection, setSelection] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  const handleConfirm = () => {
    onConfirm(selectedItem);
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.Header fontSize="lg" fontWeight="bold">
          Please select from the following
        </AlertDialog.Header>
        <AlertDialog.Body>
          <Center>
            <Box maxW="500">
              <Select
                selectedValue={selection}
                minWidth="200"
                accessibilityLabel="Choose Service"
                placeholder="Choose Service"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) => {
                  // eslint-disable-next-line eqeqeq
                  const selected = selectionOptions.find((item) => item.id == itemValue);
                  if (selected) {
                    setSelectedItem(selected);
                    setSelection(selected.id);
                  }
                }}
              >
                {Array.isArray(selectionOptions) && selectionOptions.map((item) => (
                  <Select.Item
                    label={item.name}
                    value={item.id}
                    key={item.id}
                  />
                ))}
              </Select>
            </Box>
          </Center>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button onPress={onClose}>Cancel</Button>
            <Button colorScheme="red" onPress={handleConfirm}>
              {actionBtnText}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}

export default AdditionDialog;
