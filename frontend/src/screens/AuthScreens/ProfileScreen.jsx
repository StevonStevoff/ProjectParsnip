import { View, Text } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import ProfilePicture from '../../components/ProfilePicture';

function ProfileScreen({ navigation }) {
  return (
    <View>
      <ProfilePicture name="Jane Doe" username="@JDoe" />
    </View>
  );
}

export default ProfileScreen;
