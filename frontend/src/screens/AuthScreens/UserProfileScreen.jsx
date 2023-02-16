import {
  Text,
  View,
  Image,
} from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import UsersPlantProfilesTable from '../../components/UsersPlantProfilesTable';
import ProfilePicture from '../../components/ProfilePicture';

function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  // const { user } = AuthUtils.getCurrentUser();
  return (
    <View
      style={colors.centeredViewWithColumnFlex}
    >
      <ProfilePicture name="Jane Doe" username="@JDoe" />

      <View
        style={colors.tableCardView}
      >
        <UsersPlantProfilesTable />
      </View>
    </View>
  );
}

export default ProfileScreen;
