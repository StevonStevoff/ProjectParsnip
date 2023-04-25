/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import {
  View, useWindowDimensions, StyleSheet, RefreshControl, FlatList, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Text, Box, Heading, SectionList, Center, Button,
} from 'native-base';
import { useIsFocused } from '@react-navigation/native';
import NotificationUtils from '../../api/utils/NotificationUtils';

function NotificationsScreen({ nagivation }) {
  const { width } = useWindowDimensions();
  
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const [notifications, setNotifications] = React.useState([]);

  const margin = 10;

  const fetchNotifiationData = async () => {
    setIsLoading(true);
    try {
      const notificationObj = await NotificationUtils.getAllNotifications();
      setNotifications(notificationObj);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifiationData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifiationData();
    setRefreshing(false);
  };

  const renderNotification = ({ item }) => (
    <Text>Notification: {item.text}</Text>
  );

  if (isLoading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" color="#4da707" />
      </Center>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Center flex={1}>
        <Text>No notifications.</Text>
        <Button onPress={onRefresh} testID="refresh-button">Refresh</Button>
      </Center>
    )
  }

  if (width > 750) {
    return (
      <View style={styles.webContainer}>
        <View style={styles.container}>
          <Heading>Notifications</Heading>
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Heading>Notifications</Heading>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: '2%',
    margin: '.5%',
    height: '85%',
  },
  webContainer: {
    flex: 1,
    padding: 10,
    height: '85%',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

export default NotificationsScreen;
