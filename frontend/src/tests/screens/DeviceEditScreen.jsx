import React from 'react';
import {
  render, waitFor, cleanup,
} from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import DeviceEditScreen from '../../screens/DevicesScreens/DevicesDetailsScreen';
import DeviceUtils from '../../api/utils/DeviceUtils';
import defaultTheme from '../../stylesheets/defaultTheme';

jest.mock('../../api/utils/DeviceUtils', () => ({
  getDeviceDetails: jest.fn(() => Promise.resolve({})),
  updateDeviceDetails: jest.fn(() => Promise.resolve({})),
  deleteDevice: jest.fn(() => Promise.resolve({})),
}));
const mockDevices = [
  {
    id: '1',
    name: 'Device 1',
    model_name: 'Model 1',
    users: [],
    sensors: [],
  },
  {
    id: '2',
    name: 'Device 2',
    model_name: 'Model 2',
    users: [],
    sensors: [],
  },
];

describe('DevicesEditScreen', () => {
  afterEach(() => {
    cleanup();
  });
  const theme = defaultTheme();

  test('renders device details correctly', async () => {
    DeviceUtils.getDeviceDetails.mockResolvedValueOnce(mockDevices[0]);
    const { findByText } = render(
      <NativeBaseProvider theme={theme}>
        <DeviceEditScreen route={{ params: { deviceId: '1' } }} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      expect(findByText('Device 1')).toBeDefined();
      expect(findByText('Model 1')).toBeDefined();
    });
  });

  // Add more tests as needed
});
