import React, { useEffect, useState } from 'react';
import {
  AlertDialog, Button, Select, Box, Center, CheckIcon, Text, HStack, Icon,
} from 'native-base';
import { ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

function AdditionDialog({
  isOpen, onClose, onConfirm, actionBtnText, fetchSelectionOptions, currentItems,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectionOptions, setSelectionOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOnClose = () => {
    setSelectedItem(null);
    onClose();
  };
  const handleConfirm = () => {
    onConfirm([...currentItems, selectedItem]);
    handleOnClose();
  };

  useEffect(() => {
    fetchSelectionOptions()
      .then((options) => {
        // eslint-disable-next-line no-param-reassign
        options = options.filter(
          (item) => !currentItems.some((currentItem) => currentItem.id === item.id),
        );
        setSelectionOptions(options);
        setIsLoading(false);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchAndUpdateOptions = async () => {
      try {
        const options = await fetchSelectionOptions();
        const filteredOptions = options.filter(
          (item) => !currentItems.some((currentItem) => currentItem.id === item.id),
        );
        setSelectionOptions(filteredOptions);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchAndUpdateOptions();
  }, [currentItems, fetchSelectionOptions]);

  if (selectionOptions.length === 0) {
    return (
      <AlertDialog isOpen={isOpen} onClose={onClose} height="40%">
        <AlertDialog.Content>
          <HStack justifyContent="flex-Start" width="100%">
            <Button
              variant="unstyled"
              onPress={handleOnClose}
            >
              <Icon as={<MaterialIcons name="close" />} size="sm" />
            </Button>
          </HStack>
          <Center flex={1} p={5}>
            <Text>No more items to add</Text>
          </Center>

        </AlertDialog.Content>
      </AlertDialog>
    );
  }

  if (isLoading) {
    return (
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <Center flex={1}>
            <ActivityIndicator size="large" color="#4da707" />
          </Center>
        </AlertDialog.Content>
      </AlertDialog>
    );
  }

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
                selectedValue={selectedItem?.id}
                placeholder="Select item"
                minWidth="200"
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
            <Button width="40%" onPress={handleOnClose}>Cancel</Button>
            <Button width="40%" colorScheme="red" onPress={handleConfirm}>
              {actionBtnText}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}

export default AdditionDialog;
