import { View } from 'react-native';
import { Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

function CloseBtn({ navigation }) {
  const handleClick = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View>
      <Button size="sm" onPress={handleClick} variant="unstyled">
        <Icon
          as={MaterialIcons}
          name="close"
          size="xl"
        />
      </Button>
    </View>
  );
}

export default CloseBtn;
