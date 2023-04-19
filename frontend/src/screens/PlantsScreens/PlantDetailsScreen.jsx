import {
  View, Appearance, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Text, Heading } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { theme, darkTheme } from '../../stylesheets/paperTheme';
import API from '../../api/API';
import CloseBtn from '../../components/CloseBtn';
import GrowPropertyChart from '../../components/GrowPropertyChart';

function PlantDetailsScreen({ route, navigation }) {
  const colorScheme = Appearance.getColorScheme();
  //  Initialize date range to be the last month
  const [range, setRange] = React.useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), endDate: new Date(),
  });
  const [open, setOpen] = React.useState(false);

  const [plantsData, setPlantsData] = useState([]);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange],
  );

  useEffect(() => {
    const fetchPlantsData = async () => {
      try {
        const response = await API.getPlantData(parseInt(route.params.plant.id, 10));
        setPlantsData(response.data);
      } catch (error) { /* empty */ }
    };
    fetchPlantsData();
  }, []);

  const cutoffTimestampStart = new Date(`${range.startDate.toISOString().slice(0, -5)}.000000`);
  const cutoffTimestampEnd = new Date(`${range.endDate.toISOString().slice(0, -5)}.000000`);

  const filteredDataWithinRange = plantsData.filter((element) => {
    const elementTimestamp = new Date(element.timestamp);
    const isWithinRange = elementTimestamp >= cutoffTimestampStart
    && elementTimestamp <= cutoffTimestampEnd;
    return isWithinRange;
  });

  const days = filteredDataWithinRange.map((element) => {
    const elementDate = new Date(element.timestamp);
    const dayOfMonth = elementDate.getDate();
    return dayOfMonth;
  });

  // const tempreture = filteredDataWithinRange.filter((plant) => plant.sensor_readings.some(
  //   (reading) => reading.grow_property.grow_property_type.id === 1,
  // ));

  // const moisture = filteredDataWithinRange.filter((plant) => plant.sensor_readings.some(
  //   (reading) => reading.grow_property.grow_property_type.id === 2,
  // ));

  // const tempretureValues = tempreture.flatMap(
  //   (element) => element.sensor_readings.map((reading) => reading.value),
  // );

  // const moistureValues = moisture.flatMap(
  //   (element) => element.sensor_readings.map((reading) => reading.value),
  // );

  function filterSensorDataByType(filteredDataWithinRange, dataIds) {
    return dataIds.reduce((acc, dataId) => {
      const values = filteredDataWithinRange.flatMap((plant) => plant.sensor_readings
        .filter((reading) => reading.grow_property.grow_property_type.id === dataId)
        .map((reading) => reading.value));

      return {
        ...acc,
        [dataId]: values,
      };
    }, {});
  }

  const dataIds = [1, 2, 3];
  const filteredDataByType = filterSensorDataByType(filteredDataWithinRange, dataIds);
  console.log(filteredDataByType);
  // Access the filtered values for each data_id like this:
  return (
    <ScrollView>
      <View>

        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <CloseBtn navigation={navigation} />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Heading>PLANT DETAILS</Heading>
          <TouchableOpacity
            style={[styles.detailsButton, {
              fontSize: 25, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
            }]}
            onPress={() => setOpen(true)}
          >
            <Text style={styles.createText}>Pick range </Text>
          </TouchableOpacity>

          <Text>
            {' '}
            Picked From
            {' '}
            {range.startDate.toLocaleDateString()}
            {' '}
            to
            {' '}
            {range.endDate.toLocaleDateString()}
          </Text>

          {route.params.plant.plant_profile.grow_properties.map((beans) => (
            <>
              <Text>
                {beans.grow_property_type.name}
                {' '}
                Line Chart
              </Text>
              <View key={beans.grow_property_type.id}>
                {filteredDataByType[beans.grow_property_type.id].length > 0 && (
                <GrowPropertyChart
                  days={days}
                  tempretureValues={filteredDataByType[beans.grow_property_type.id]}
                />
                )}
              </View>
            </>
          ))}

        </View>

        {/* <SafeAreaProvider> */}
        <View style={{
          justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%',
        }}
        >

          <Text>
            Name :
            {route.params.plant.name}
          </Text>
          <Text>
            Longitude:
            {' '}
            {route.params.plant.longitude}
          </Text>
          <Text>
            Latitude:
            {' '}
            {route.params.plant.latitude}
          </Text>
          <Text>
            Outoor?:
            {route.params.plant.outdoor}
          </Text>

          <Text>
            Time?:
            {route.params.plant.time_planted}
          </Text>

          <Text>
            Device:
            {route.params.plant.device.name}
          </Text>
          <Text>
            Model name:
            {route.params.plant.device.model_name}
          </Text>

          <Text>
            Plant profile name:
            {route.params.plant.plant_profile.name}
          </Text>
          <Text>
            Plant profile description:
            {route.params.plant.plant_profile.description}
          </Text>

          <Text>
            Plant type name:
            {route.params.plant.plant_type.name}
          </Text>
          <Text>
            Plant profile description:
            {route.params.plant.plant_type.description}
          </Text>

          <PaperProvider theme={colorScheme === 'dark' ? darkTheme : theme} darkTheme={darkTheme}>
            <DatePickerModal
              locale="en-GB"
              mode="range"
              visible={open}
              onDismiss={onDismiss}
              startDate={range.startDate}
              endDate={range.endDate}
              onConfirm={onConfirm}
            />
          </PaperProvider>
        </View>
        {/* </SafeAreaProvider> */}

      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  createPlantButton: {
    marginRight: 10,
    marginLeft: 120,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    backgroundColor: '#1E6738',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  detailsButton: {
    marginRight: 5,
    marginLeft: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#1E3438',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#1E6738',
    width: '40%',
  },
  createText: {
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    marginHorizontal: 40,
    width: '100%',
    left: -40,
  },
});

export default PlantDetailsScreen;
