import React from 'react';
import { AlertDialog, Button } from 'native-base';

function WarningDialog({
  isOpen, onClose, onConfirm, warningMessage, actionBtnText,headerMessage
}) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.Header fontSize="lg" fontWeight="bold">
          {headerMessage}
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
