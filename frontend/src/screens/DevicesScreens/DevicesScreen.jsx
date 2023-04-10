/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import {
  View, useWindowDimensions, StyleSheet, RefreshControl, FlatList, ScrollView,
} from 'react-native';
import { Text, Box } from 'native-base';
import DevicesCard from '../../components/DevicesCard';
import DeviceUtils from '../../api/utils/DeviceUtils';

function DevicesScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [devices, setDevices] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const { width } = useWindowDimensions();
  const cardWidth = 350;
  const margin = 10;
  const numCols = Math.floor((width - margin * 2) / cardWidth);
  const screenWidth = useWindowDimensions().width;

  const fetchDevices = () => {
    setIsLoading(true);
    DeviceUtils.getAllUserDevices()
      .then((devicesObj) => {
        setDevices(devicesObj);
        console.log(devicesObj);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDevices();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <DevicesCard device={item} onPress={() => navigation.navigate('DevicesDetails', { device: item })} />
    </View>
  );
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Add device through the device portal. Then refresh the page. </Text>
      </View>
    );
  }

  if (screenWidth > 750) {
    return (
      <View style={styles.webContainer}>
        <FlatList
          key={numCols}
          data={devices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numCols}
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        />
      </View>
    );
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {devices.map((device) => (
        <Box key={device.id} mb={4}>
          <DevicesCard device={device} />
        </Box>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  webContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});

export default DevicesScreen;
