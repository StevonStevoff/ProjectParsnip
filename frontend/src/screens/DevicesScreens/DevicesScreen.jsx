/* eslint-disable no-use-before-define */
import {
  View, Text, useWindowDimensions, StyleSheet, RefreshControl,
} from 'react-native';
import React, { useEffect } from 'react';
import {
  Heading, ActivityIndicator, Stack, VStack, Flex, Pressable, ScrollView,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import DevicesCard from '../../components/DevicesCard';
import DeviceUtils from '../../api/utils/DeviceUtils';

function DevicesScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [devices, setDevices] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const { width } = useWindowDimensions();
  // eslint-disable-next-line no-nested-ternary
  const numCols = width > 768 ? 3 : width > 414 ? 2 : 1;

  const fetchDevices = () => {
    setIsLoading(true);
    DeviceUtils.getAllUserDevices()
      .then((devicesObj) => {
        setDevices(devicesObj);
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

  const renderDevices = () => {
    if (devices.length > 0) {
      const deviceRows = [];

      for (let i = 0; i < devices.length; i += numCols) {
        const row = [];

        // eslint-disable-next-line no-plusplus
        for (let j = 0; j < numCols; j++) {
          if (i + j < devices.length) {
            const device = devices[i + j];
            row.push(
              <Col key={device.id}>
                <DevicesCard device={device} onPress={() => navigation.navigate('DevicesDetails', { device })} />
              </Col>,
            );
          }
        }

        deviceRows.push(<Grid key={`row-${i}`}>{row}</Grid>);
      }

      // eslint-disable-next-line react/jsx-no-useless-fragment
      return (
        <div style={{ padding: 10 }}>
          {deviceRows}
        </div>
      );
    }
    return <Text>No devices to display.</Text>;
  };

  return (
    // eslint-disable-next-line no-use-before-define
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
    }
    >
      {isLoading ? <Text>Loading...</Text> : renderDevices()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default DevicesScreen;
