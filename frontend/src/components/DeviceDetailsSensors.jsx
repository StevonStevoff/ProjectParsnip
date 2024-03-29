import React, { useState } from 'react';
import {
  Box, HStack, Icon, IconButton, Text, VStack,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import WarningDialog from './WarningDialog';
import getIconComponent from '../utils/SensorIcons';

function DevicesDetailsSensors({ sensors, handleSensorUpdate }) {
  const screenWidth = useWindowDimensions().width;
  const [sensorToDelete, setSensorToDelete] = useState(null);
  const [warningDialogOpen, setWaringDialogOpen] = useState(false);

  const handleRemoveClick = (sensor) => {
    setSensorToDelete(sensor);
    setWaringDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setSensorToDelete(null);
    setWaringDialogOpen(false);
  };

  const handleRemoveSensorConfirm = () => {
    const updatedSensors = sensors.filter((sensor) => sensor.id !== sensorToDelete.id);
    handleSensorUpdate(updatedSensors);
    handleDeleteClose();
  };

  return (
    <VStack space={2} alignItems="stretch">
      {sensors.map((sensor) => (
        <HStack key={sensor.id} justifyContent="space-between" space={3} p={3} alignItems="center">
          <HStack space={4} minWidth="15%" alignItems="center">
            <Box alignSelf="center" backgroundColor="red">
              {getIconComponent(sensor.description)}
            </Box>
            <Text fontWeight="bold">{sensor.name}</Text>
          </HStack>
          {screenWidth > 760 && (
            <HStack flexGrow={1} paddingLeft={2} alignItems="center">
              <Text>{sensor.description}</Text>
            </HStack>
          )}
          <IconButton
            icon={(
              <Icon
                as={MaterialCommunityIcons}
                name="close"
                _dark={{ color: 'white' }}
                _light={{ color: 'grey.200' }}
                size="lg"
              />
)}
            onPress={() => handleRemoveClick(sensor)}
          />
        </HStack>
      ))}
      <WarningDialog
        isOpen={warningDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleRemoveSensorConfirm}
        warningMessage={`Are you sure you want to remove ${sensorToDelete?.name}?`}
        headerMessage="Remove item from device"
        actionBtnText="Remove"
      />
    </VStack>
  );
}

export default DevicesDetailsSensors;
