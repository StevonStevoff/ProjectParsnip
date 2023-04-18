import {
  View, Appearance, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { LineChart } from 'react-native-chart-kit';
import { theme, darkTheme } from '../../stylesheets/paperTheme';
import API from '../../api/API';
import CloseBtn from '../../components/CloseBtn';

function PlantDetailsScreen({ route, navigation }) {
  const colorScheme = Appearance.getColorScheme();
  //  Initialize date range to be the last month
  const [range, setRange] = React.useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), endDate: new Date(),
  });
  const [open, setOpen] = React.useState(false);

  const [plantsD, setPlantsD] = useState([]);

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
    const fetchPlants = async () => {
      try {
        const response = await API.getPlantData(parseInt(route.params.plant.id, 10));
        setPlantsD(response.data);
      } catch (error) { /* empty */ }
    };
    fetchPlants();
  }, []);

  const cutoffTimestampStart = new Date(`${range.startDate.toISOString().slice(0, -5)}.000000`);
  const cutoffTimestampEnd = new Date(`${range.endDate.toISOString().slice(0, -5)}.000000`);

  const filteredElements = plantsD.filter((element) => {
    const elementTimestamp = new Date(element.timestamp);
    const isWithinRange = elementTimestamp >= cutoffTimestampStart
    && elementTimestamp <= cutoffTimestampEnd;
    return isWithinRange;
  });

  // const pepepopo = filteredElements.map(element => element.timestamp);

  const days = filteredElements.map((element) => {
    const elementDate = new Date(element.timestamp);
    const dayOfMonth = elementDate.getDate();
    return dayOfMonth;
  });

  const filteredValues = filteredElements.flatMap(
    (element) => element.sensor_readings.map((reading) => reading.value),
  );

  console.log(route.params.plant);

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
          <Text>Bezier Line Chart</Text>
          <LineChart
            data={{
              labels: days,
              datasets: [{
                data: filteredValues,
              }],
            }}
            width={500} // from react-native
            height={500}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
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
          <TouchableOpacity
            style={[styles.detailsButton, {
              fontSize: 25, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
            }]}
            onPress={() => setOpen(true)}
          >
            <Text style={styles.createText}>Pick range </Text>
          </TouchableOpacity>

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
