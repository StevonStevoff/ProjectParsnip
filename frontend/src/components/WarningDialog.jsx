import React from 'react';
import { AlertDialog, Button } from 'native-base';

function WarningDialog({
  isOpen, onClose, onConfirm, warningMessage, actionBtnText,
}) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.Header fontSize="lg" fontWeight="bold">
          Remove Sensor for device.
        </AlertDialog.Header>
        <AlertDialog.Body>
          {warningMessage}
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button onPress={onClose}>Cancel</Button>
            <Button colorScheme="red" onPress={onConfirm}>
              {actionBtnText}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}

export default WarningDialog;
