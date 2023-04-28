import React from 'react';
import {
  render, waitFor, fireEvent, cleanup,
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
  afterEach(() => {
    cleanup();
  });
  test('renders the profile screen', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <NativeBaseProvider theme={theme} initialWindowMetrics={inset}>
        <ProfileScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      const profileTitle = getByText('@testuser');
      expect(profileTitle).toBeDefined();
    });
  });
  test('should have a button to the edit profile page', async () => {
    const navigation = { navigate: jest.fn() };
    const { findByTestId } = render(
      <NativeBaseProvider theme={theme} initialWindowMetrics={inset}>
        <ProfileScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      const editProfileButton = findByTestId('edit-profile-button');
      expect(editProfileButton).toBeDefined();
    });
  });
  test('should navigate to the edit profile page when the edit profile button is pressed', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByTestId, getByText } = render(
      <NativeBaseProvider theme={theme} initialWindowMetrics={inset}>
        <ProfileScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      const editProfileButton = getByTestId('edit-profile-button');
      fireEvent.press(editProfileButton);
      const saveButton = getByText('Save');
      expect(saveButton).toBeDefined();
    });
  });
});
