import {
  View, TouchableOpacity, Image, useWindowDimensions, StyleSheet,
} from 'react-native';
import React from 'react';
import { Text, Avatar } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AuthUtils from '../api/utils/AuthUtils';

function Header() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const navigation = useNavigation();
  const [user, setUser] = React.useState({ name: '', username: '', email: '' });

  React.useEffect(() => {
    AuthUtils.getUserInfo().then((userDetails) => {
      setUser(userDetails);
    });
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        minWidth: '100%',
        width: isLargeScreen ? dimensions.width - 100 : dimensions.width - 30,
        paddingBottom: 3,
        /* eslint-disable no-constant-condition */
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Profile');
        }}
      >

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '450',
              marginRight: 10,
            }}
          >
            {user.name}
          </Text>
          <Avatar
            bg="primary.600"
            alignSelf="center"
            size="sm"
            marginRight="2"
            source={{
              uri: user.profile_picture_URL,
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Header;
