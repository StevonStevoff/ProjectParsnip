import React from 'react';
import {
  render, waitFor, fireEvent, cleanup, act,
} from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import RegistrationScreen from '../../screens/AuthScreens/RegistrationScreen';
import defaultTheme from '../../stylesheets/defaultTheme';

jest.mock('../../api/utils/AuthUtils.js', () => ({
  login: jest.fn(() => Promise.resolve({})),
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

describe('Basic Registration Screen function and loadin', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders the create account heading', async () => {
    const navigation = { navigate: jest.fn() };
    const { findByText } = render(
      <NativeBaseProvider theme={theme}>
        <RegistrationScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      const title = findByText('Create Account');
      expect(title).toBeDefined();
    });
  });

  it('should have a button to the login page', async () => {
    const navigation = { navigate: jest.fn() };
    const { findByText } = render(
      <NativeBaseProvider theme={theme}>
        <RegistrationScreen navigation={navigation} />
      </NativeBaseProvider>,
    );

    await waitFor(async () => {
      const loginBtn = findByText('Login');
      expect(loginBtn).toBeDefined();
    });
  });
  it('should show an error message if any form fields are blank', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByTestId, findByText } = render(
      <NativeBaseProvider theme={theme} initialWindowMetrics={inset}>
        <RegistrationScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      fireEvent.changeText(getByTestId('password-input-signup'), '');
      fireEvent.changeText(getByTestId('username-input-signup'), '');
      const usernameError = findByText('Username is required');
      const passwordError = findByText('Password is required');
      expect(passwordError).toBeDefined();
      expect(usernameError).toBeDefined();
    });
  });
});
