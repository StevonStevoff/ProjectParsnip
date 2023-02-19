import { View } from 'react-native';
import React from 'react';
import {
  VStack, FormControl, Input, Button, useColorModeValue,
} from 'native-base';
import ProfilePicture from '../../components/ProfilePicture';
import AuthUtils from '../../api/utils/AuthUtils';

function ProfileScreen({ navigation }) {
  const colorText = useColorModeValue('#3b3b3b', '#a9a9a9');
  return (
    <View style={{
      width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center',
    }}
    >
      <ProfilePicture name="John Doe" username="Doed" />
      <VStack space={3} alignItems="center" width="90%">
        <FormControl>
          <FormControl.Label color="red">
            Name

          </FormControl.Label>
          <Input
            variant="underlined"
            value="John Doe"
            _disabled={{
              color: useColorModeValue('#000000', '#fafafa'),
            }}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Email Address</FormControl.Label>
          <Input variant="underlined" value="johnDoe@gmail.com" />
        </FormControl>
        <VStack marginTop="24%" alignItems="center" width="90%">
          <Button onPress={() => AuthUtils.logout()} w="40%" bg="error.600"> Log Out </Button>
        </VStack>
      </VStack>
    </View>
  );
}

export default ProfileScreen;
