import {
  View, Text, TouchableOpacity, Image, useWindowDimensions, useColorScheme,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../../assets/avatar.png';
import { DarkTheme } from '../stylesheets/DarkTheme';
import { LightTheme } from '../stylesheets/LightTheme';

function Header() {
  const scheme = useColorScheme();
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const navigation = useNavigation();
  const { colors } = scheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <View
      style={{
        backgroundColor: scheme === 'dark' ? '#1a1c1e' : '#fff',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        minWidth: '100%',
        width: isLargeScreen ? dimensions.width - 100 : dimensions.width - 30,
        /* eslint-disable no-constant-condition */
        color: 'dark' ? '#fff' : '#000',
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
            style={isLargeScreen ? colors.profilePicWeb : colors.profilePicMobile}
          />
          <Text
            style={{
              marginTop: '8%',
              fontSize: 20,
              fontWeight: '450',
              color: scheme === 'dark' ? '#fff' : '#000',
            }}
          >
            Jane
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Header;
