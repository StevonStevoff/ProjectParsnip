import {
  View, TouchableOpacity, Image, useWindowDimensions, StyleSheet,
} from 'react-native';
import React from 'react';
import { Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../../assets/avatar.png';
import AuthUtils from '../api/utils/AuthUtils';

const headerStyles = StyleSheet.create({
  profilePicMobile: {
    width: 37,
    height: 37,
    marginRight: 7,
    overflow: 'hidden',
    borderRadius: 20,
  },
  profilePicWeb: {
    width: 40,
    height: 40,
    marginRight: 5,
    borderRadius: '50%',
  },
});

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
          }}
        >
          <Image
            source={Avatar}
            borderRadius={20}
            style={isLargeScreen ? headerStyles.profilePicWeb : headerStyles.profilePicMobile}
          />
          <Text
            style={{
              marginTop: '8%',
              fontSize: 20,
              fontWeight: '450',
            }}
          >
            {user.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Header;
