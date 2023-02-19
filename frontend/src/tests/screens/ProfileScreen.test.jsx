import React from 'react';
import {
  render, waitFor, fireEvent,
} from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import ProfileScreen from '../../screens/AuthScreens/ProfileScreen';
import defaultTheme from '../../stylesheets/defaultTheme';

jest.mock('../../api/utils/AuthUtils.js', () => ({
  getUserInfo: jest.fn(() => Promise.resolve({
    name: 'Test User',
    email: 'test@test.com',
    username: 'testuser',
  })),
}));

const inset = {
  frame: {
    x: 0, y: 0, width: 0, height: 0,
  },
  insets: {
    top: 0, left: 0, right: 0, bottom: 0,
  },
};

const theme = defaultTheme();

describe('ProfileScreen', () => {
  it('renders the profile screen', async () => {
    const navigation = { navigate: jest.fn() };
    const { findByText } = render(
      <NativeBaseProvider theme={theme} initialWindowMetrics={inset}>
        <ProfileScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      const profileTitle = findByText('@testuser');
      expect(profileTitle).toBeDefined();
    });
  });
  it('should render the form component', async () => {
    const navigation = { navigate: jest.fn() };
    const { findByText } = render(
      <NativeBaseProvider theme={theme} initialWindowMetrics={inset}>
        <ProfileScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      const name = findByText('Test User');
      const email = findByText('test@test.com');
      expect(name).toBeDefined();
      expect(email).toBeDefined();
    });
  });
  it('should have a button to the edit profile page', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByTestId } = render(
      <NativeBaseProvider theme={theme} initialWindowMetrics={inset}>
        <ProfileScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      const editProfileButton = getByTestId('edit-profile-button');
      expect(editProfileButton).toBeDefined();
    });
  });
});
