import React from 'react';
import { render, waitFor, cleanup } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import DevicesScreen from '../../screens/DevicesScreens/DevicesScreen';
import DeviceUtils from '../../api/utils/DeviceUtils';
import defaultTheme from '../../stylesheets/defaultTheme';

jest.mock('../../api/utils/DeviceUtils', () => ({
  getLinkedDevices: jest.fn(() => Promise.resolve([])),
  getUnlinkedDevices: jest.fn(() => Promise.resolve([])),
}));

const theme = defaultTheme();
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

describe('DevicesScreen', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders correctly with no devices', async () => {
    const { findByText } = render(
      <NativeBaseProvider theme={theme}>
        <DevicesScreen />
      </NativeBaseProvider>,
    );

    await waitFor(() => {
      expect(findByText('Add device through the device portal. Then refresh the page.')).toBeDefined();
    });
  });

  test('renders correctly with devices', async () => {
    DeviceUtils.getLinkedDevices.mockResolvedValueOnce(mockDevices);
    const { findByText } = render(
      <NativeBaseProvider theme={theme}>
        <DevicesScreen />
      </NativeBaseProvider>,
    );

    await waitFor(() => {
      expect(findByText('Device 1')).toBeDefined();
      expect(findByText('Device 2')).toBeDefined();
    });
  });

  test('displays error message when devices retrieval fails', async () => {
    DeviceUtils.getLinkedDevices.mockRejectedValueOnce(new Error('Failed to fetch devices'));
    const { findByText } = render(
      <NativeBaseProvider theme={theme}>
        <DevicesScreen />
      </NativeBaseProvider>,
    );

    await waitFor(() => {
      expect(findByText('Failed to fetch devices')).toBeDefined();
    });
  });

  // Add more tests as needed
});
