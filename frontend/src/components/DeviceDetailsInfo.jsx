import React, { useState } from 'react';
import {
  Button, Icon, VStack, HStack, Heading, Divider, Box, Text, Avatar,
} from 'native-base';
import {
  MaterialCommunityIcons, MaterialIcons,
} from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import AdditionDialog from './AdditionDialog';
import getIconComponent from '../utils/SensorIcons';
import WarningDialog from './WarningDialog';

function DeviceDetailsInfo({
  heading, isUserOwner, items, setItems, fetchSelectionOptions,
}) {
  const screenWidth = useWindowDimensions().width;
  const [additionDialogOpen, setAdditionDialogOpen] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handlePopUpWindowClose = () => {
    setAdditionDialogOpen(false);
    setItemToDelete(null);
    setWarningDialogOpen(false);
  };

  const handlePopUpWindowConfirm = (updatedInfoItems) => {
    setItems(updatedInfoItems);
    handlePopUpWindowClose();
  };

  const handleDeletionConfirmation = () => {
    const updatedItems = items.filter((i) => i.id !== itemToDelete.id);
    handlePopUpWindowClose();
    setItems(updatedItems);
  };

  return (
    <VStack
      rounded="lg"
      justifyContent="center"
      width="100%"
      p={4}
    >
      <AdditionDialog
        isOpen={additionDialogOpen}
        onClose={handlePopUpWindowClose}
        onConfirm={handlePopUpWindowConfirm}
        currentItems={items}
        fetchSelectionOptions={fetchSelectionOptions}
        actionBtnText="Add"
      />
      <WarningDialog
        isOpen={warningDialogOpen}
        onClose={handlePopUpWindowClose}
        onConfirm={handleDeletionConfirmation}
        warningMessage="Are you sure you want to procede. This action cannot be undone."
        actionBtnText="Delete"
      />
      <HStack justifyContent="space-between">
        <Heading size="lg" fontWeight={500}>{heading}</Heading>
        {isUserOwner && (
        <Button
          variant="unstyled"
          onPress={() => { setAdditionDialogOpen(true); }}
        >
          <Icon
            as={MaterialIcons}
            name="add-circle"
            size="lg"
            _light={{ color: 'grey.200' }}
            _dark={{ color: 'white' }}
          />
        </Button>
        )}
      </HStack>
      <Divider />
      <VStack space={2} alignItems="stretch">
        {items.map((item) => (
          <HStack key={item.id} justifyContent="space-between" space={3} p={3} alignItems="center">
            <HStack space={4} minWidth="15%" alignItems="center">
              {item.description
              && (
              <Box alignSelf="center" backgroundColor="red" size="10">
                {getIconComponent(item.description)}
              </Box>
              )}
              {item.email && <Avatar size="md" source={{ uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80' }} />}
              <Text fontWeight="bold">
                {item.name}
                {' '}
                {item.isOwner ? '(Owner)' : ''}

              </Text>
            </HStack>
            {(screenWidth > 760 && item.description) && (
            <HStack flexGrow={1} paddingLeft={2} alignItems="center">
              <Text>{item.description}</Text>
            </HStack>
            )}
            {isUserOwner && (
            <Button
              variant="unstyled"
              onPress={() => { setWarningDialogOpen(true); setItemToDelete(item); }}
            >
              <Icon
                as={MaterialCommunityIcons}
                name="close"
                _dark={{ color: 'white' }}
                _light={{ color: 'grey.200' }}
                size="lg"
              />

            </Button>
            )}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

export default DeviceDetailsInfo;
