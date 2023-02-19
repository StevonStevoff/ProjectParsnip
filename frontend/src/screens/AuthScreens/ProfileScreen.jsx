import { View } from 'react-native';
import React from 'react';
import {
  VStack, FormControl, Input, Button, Text, Icon,
} from 'native-base';
import { Formik } from 'formik';
import { MaterialIcons } from '@expo/vector-icons';
import ProfilePicture from '../../components/ProfilePicture';
import AuthUtils from '../../api/utils/AuthUtils';
import CloseBtn from '../../components/CloseBtn';
import profileSchema from '../../utils/validationSchema/ProfileSchema';

function ProfileScreen({ navigation }) {
  const [user, setUser] = React.useState({ name: '', username: '', email: '' });
  const [editMode, setEditMode] = React.useState(false);
  const [isFormLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    AuthUtils.getUserInfo().then((userDetails) => {
      setUser(userDetails);
    });
  }, []);
  return (
    <View style={{
      width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center',
    }}
    >
      <ProfilePicture name={user.name} username={user.username} />
      <VStack space={3} alignItems="center" width="90%">
        <FormControl>
          <FormControl.Label color="red">
            Name

          </FormControl.Label>
          <Input
            variant="underlined"
            value={user.name}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Email Address</FormControl.Label>
          <Input variant="underlined" value={user.email} />
        </FormControl>
        <VStack marginTop="24%" alignItems="center" width="90%">
          <Button onPress={() => AuthUtils.logout(navigation)} w="40%" bg="error.600"> Log Out </Button>
        </VStack>
      </VStack>
    </View>
  );
}

export default ProfileScreen;
