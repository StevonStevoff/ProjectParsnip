/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import {
  View, useWindowDimensions, StyleSheet, RefreshControl, FlatList, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Text, Box, Heading, SectionList, Center,
} from 'native-base';
import { useIsFocused } from '@react-navigation/native';
import DevicesCard from '../../components/DevicesCard';
import DeviceUtils from '../../api/utils/DeviceUtils';

function DevicesScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const [linkedDevices, setLinkedDevices] = React.useState([]);
  const [unlinkedDevices, setUnlinkedDevices] = React.useState([]);

  const cardWidth = 350;
  const margin = 10;
  const numCols = Math.floor((width - margin * 2) / cardWidth);

  const fetchDeviceData = async () => {
    setIsLoading(true);
    try {
      const [linkedDevicesObj, unlinkedDevicesObj] = await Promise.all([
        DeviceUtils.getLinkedDevices(),
        DeviceUtils.getUnlinkedDevices(),
      ]);
      setLinkedDevices(linkedDevicesObj);
      setUnlinkedDevices(unlinkedDevicesObj);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceData();
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDeviceData();
    setRefreshing(false);
  };

  const renderDevice = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DevicesDetails', { item })}>
      <Box mb={4}>
        <DevicesCard item={item} navigation={navigation} />
      </Box>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Heading>{title}</Heading>
  );

  const sections = [
    ...(linkedDevices.length > 0 ? [{ title: 'Linked Devices', data: linkedDevices }] : []),
    ...(unlinkedDevices.length > 0 ? [{ title: 'Unlinked Devices', data: unlinkedDevices }] : []),
  ];

  if (isLoading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" color="#4da707" />
      </Center>
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

  if (width > 750) {
    return (
      <View style={styles.webContainer}>
        {linkedDevices.length > 0 && (
        <View style={styles.container}>
          <Heading>Linked Devices</Heading>
          <FlatList
            key={numCols}
            data={linkedDevices}
            renderItem={renderDevice}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numCols}
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          />
        </View>
        )}
        {unlinkedDevices.length > 0 && (
        <View style={styles.container}>
          <Heading>Unlinked Devices</Heading>
          <FlatList
            key={numCols}
            data={unlinkedDevices}
            renderItem={renderDevice}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numCols}
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          />
        </View>
        )}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderDevice}
        renderSectionHeader={renderSectionHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        stickySectionHeadersEnabled={false}
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

export default DevicesScreen;
