/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import {
  View, useWindowDimensions, StyleSheet, RefreshControl, FlatList, TouchableOpacity,
} from 'react-native';
import {
  Text, Box, Heading, SectionList,
} from 'native-base';
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

  const renderSectionHeader = ({ section: { title } }) => (
    <Heading>{title}</Heading>
  );
  const renderItem = ({ item, section }) => {
    if (section.title === 'Linked Devices') {
      return (
        <TouchableOpacity key={item.device.id} onPress={() => navigation.navigate('DevicesDetails', { plant: item })}>
          <Box mb={4}>
            <DevicesCard plant={item} navigation={navigation} />
          </Box>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity key={item.id} onPress={() => navigation.navigate('DevicesDetails', { device: item })}>
        <Box mb={4}>
          <DevicesCard device={item} navigation={navigation} />
        </Box>
      </TouchableOpacity>
    );
  };

  const sections = [
    { title: 'Linked Devices', data: linkedDevices },
    { title: 'Unlinked Devices', data: unlinkedDevices },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    fetchLinkedDevices();
    fetchUnlinkedDevices();
    setRefreshing(false);
  };

  const renderDeviceItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('DevicesDetails', { device: item })}>
        <DevicesCard device={item} navigation={navigation} />
      </TouchableOpacity>
    </View>
  );
  const renderPlantItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('DevicesDetails', { plant: item })}>
        <DevicesCard plant={item} navigation={navigation} />
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

  if ((!linkedDevices || linkedDevices.length === 0)
  && (!unlinkedDevices || unlinkedDevices.length === 0)) {
    return (
      <View style={styles.container}>
        <Text>Add device through the device portal. Then refresh the page.</Text>
      </View>
    );
  }

  if (screenWidth > 750) {
    return (
      <View style={styles.webContainer}>
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
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    margin: '2%',
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
