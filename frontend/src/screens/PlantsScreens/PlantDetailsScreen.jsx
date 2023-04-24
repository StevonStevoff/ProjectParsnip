import {
  View, Appearance, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import {
  Text, Heading, VStack, Icon,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
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

  function filterSensorDataByType(filteredData, dataIds) {
    return dataIds.reduce((acc, dataId) => {
      const values = filteredData.flatMap((plant) => plant.sensor_readings
        .filter((reading) => reading?.grow_property?.grow_property_type.id === dataId)
        .map((reading) => reading.value));

      return {
        ...acc,
        [dataId]: values,
      };
    }, {});
  }

  const dataIds = [1, 2, 3, 4];
  const filteredDataByType = filterSensorDataByType(filteredDataWithinRange, dataIds);

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
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <VStack w="70%" space={2} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Heading style={{ textTransform: 'uppercase', flexWrap: 'wrap' }}>
              {route.params.plant.name}
              {' '}
            </Heading>
            <TouchableOpacity
              style={[styles.detailsButton, {
                fontSize: 25, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
              }]}
              onPress={() => setOpen(true)}
            >
              <Icon as={MaterialIcons} name="date-range" color="white" _dark={{ color: 'white' }} size={5} />
              <Text style={styles.createText}>  Pick range </Text>
            </TouchableOpacity>
          </VStack>

          <Text style={[styles.centeredText, { padding: 10 }]}>
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
              <Text style={styles.centeredText}>
                {beans.grow_property_type.name}
                {' '}
                Line Chart
              </Text>
              <View key={beans.grow_property_type.id}>
                {filteredDataByType[beans.grow_property_type.id].length > 0 ? (
                  <GrowPropertyChart
                    days={days}
                    tempretureValues={filteredDataByType[beans.grow_property_type.id]}
                  />
                ) : <Text style={styles.errorText}>No data for this range</Text>}
              </View>

            </>
          ))}

        </View>

        <View style={{
          justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%',
        }}
        >
          <PaperProvider theme={colorScheme === 'dark' ? darkTheme : theme} darkTheme={darkTheme}>
            <DatePickerModal
              locale="en"
              mode="range"
              visible={open}
              onDismiss={onDismiss}
              startDate={range.startDate}
              endDate={range.endDate}
              onConfirm={onConfirm}
            />
          </PaperProvider>
        </View>

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
  centeredText: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  scrollView: {
    marginHorizontal: 40,
    width: '100%',
    left: -40,
  },
});

export default PlantDetailsScreen;
