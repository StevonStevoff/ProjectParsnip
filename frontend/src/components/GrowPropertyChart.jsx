import {
  View, StyleSheet,
} from 'react-native';
import React from 'react';
import { LineChart } from 'react-native-chart-kit';

function GrowPropertyChart(props) {
  const { days } = props;
  const { tempretureValues } = props;
  return (
    <View>
      <LineChart
        data={{
          labels: days,
          datasets: [{
            data: tempretureValues,
          }],
        }}
        width={400} // from react-native
        height={400}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        xAxisInterval={5}
        chartConfig={{
          backgroundColor: 'green',
          backgroundGradientFrom: 'green',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 10,
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

  );
}

const styles = StyleSheet.create({

});

export default GrowPropertyChart;
