/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import {
  View, useWindowDimensions, StyleSheet, RefreshControl, FlatList, ScrollView, TouchableOpacity,
} from 'react-native';
import { Text, Box, Heading } from 'native-base';
import DevicesCard from '../../components/DevicesCard';
import DeviceUtils from '../../api/utils/DeviceUtils';

function DevicesScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [linkedDevices, setLinkedDevices] = React.useState([]);
  const [unlinkedDevices, setUnlinkedDevices] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const { width } = useWindowDimensions();
  const cardWidth = 350;
  const margin = 10;
  const numCols = Math.floor((width - margin * 2) / cardWidth);
  const screenWidth = useWindowDimensions().width;

  const fetchLinkedDevices = () => {
    setIsLoading(true);
    DeviceUtils.getLinkedDevices()
      .then((devicesObj) => {
        setLinkedDevices(devicesObj);
        console.log(devicesObj);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchUnlinkedDevices = () => {
    setIsLoading(true);
    DeviceUtils.getUnlinkedDevices()
      .then((devicesObj) => {
        setUnlinkedDevices(devicesObj);
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
    fetchLinkedDevices();
    fetchUnlinkedDevices();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLinkedDevices();
    fetchUnlinkedDevices();
    setRefreshing(false);
  };

  const renderDeviceItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('DevicesDetails', { device: item })}>
        <DevicesCard device={item} />
      </TouchableOpacity>
    </View>
  );
  const renderPlantItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('DevicesDetails', { plant: item })}>
        <DevicesCard plant={item} />
      </TouchableOpacity>
    </View>
  );
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // eslint-disable-next-line max-len
  if ((!linkedDevices || linkedDevices.length === 0) && (!unlinkedDevices || unlinkedDevices.length === 0)) {
    return (
      <View style={styles.container}>
        <Text>Add device through the device portal. Then refresh the page.</Text>
      </View>
    );
  }

  if (screenWidth > 750) {
    return (
      <ScrollView style={styles.webContainer}>
        <View style={styles.container}>
          <Heading>Linked Devices</Heading>
          <FlatList
            key={numCols}
            data={linkedDevices}
            renderItem={renderPlantItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numCols}
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          />
        </View>
        <View style={styles.container}>
          <Heading>Unlinked Devices</Heading>
          <FlatList
            key={numCols}
            data={unlinkedDevices}
            renderItem={renderDeviceItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numCols}
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          />
        </View>
      </ScrollView>
    );
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Box mb={4}>
        <Heading>Linked Devices</Heading>
        {linkedDevices.map((plant) => (
          <TouchableOpacity onPress={() => navigation.navigate('DevicesDetails', { plant })}>
            <Box key={plant.device.id} mb={4}>
              <DevicesCard plant={plant} />
            </Box>
          </TouchableOpacity>
        ))}
      </Box>
      <Box mb={4}>
        <Heading>Unlinked Devices</Heading>
        {unlinkedDevices.map((device) => (
          <TouchableOpacity onPress={() => navigation.navigate('DevicesDetails', { device })}>
            <Box key={device.id} mb={4}>
              <DevicesCard device={device} />
            </Box>
          </TouchableOpacity>
        ))}
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginBottom: '5%',
  },
  webContainer: {
    flex: 1,
    padding: 10,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

export default DevicesScreen;
