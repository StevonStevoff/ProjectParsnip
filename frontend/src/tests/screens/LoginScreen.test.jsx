import React from 'react';
import {
  render, waitFor, fireEvent,
} from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import LoginScreen from '../../screens/AuthScreens/LoginScreen';
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

describe('LoginScreen', () => {
  it('renders the login heading', async () => {
    const navigation = { navigate: jest.fn() };
    const { findByText } = render(
      <NativeBaseProvider theme={theme}>
        <LoginScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      const loginTitle = findByText('Login');
      const subtitle = findByText('Please sign in to continue');
      expect(loginTitle).toBeDefined();
      expect(subtitle).toBeDefined();
    });
  });

  it('should render the login form component', async () => {
    const navigation = { navigate: jest.fn() };
    const { findByPlaceholderText } = render(
      <NativeBaseProvider theme={theme}>
        <LoginScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    await waitFor(() => {
      const username = findByPlaceholderText('Username');
      const password = findByPlaceholderText('Password');
      expect(username).toBeDefined();
      expect(password).toBeDefined();
    });
  });

  it('should have a button to the sign up page', async () => {
    const navigation = { navigate: jest.fn() };
    const { findByText } = render(
      <NativeBaseProvider theme={theme}>
        <LoginScreen navigation={navigation} />
      </NativeBaseProvider>,
    );

    await waitFor(async () => {
      const signUpBtn = findByText('Sign Up');
      expect(signUpBtn).toBeDefined();
    });
  });
  it('should have a button to the forgot password page', async () => {
    const navigation = { navigate: jest.fn() };
    const { findByText } = render(
      <NativeBaseProvider theme={theme}>
        <LoginScreen navigation={navigation} />
      </NativeBaseProvider>,
    );

    await waitFor(async () => {
      const forgotPasswordBtn = findByText('Forgot Password?');
      expect(forgotPasswordBtn).toBeDefined();
    });
  });
  it('should show an error message if the username is not entered', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByTestId, findByText } = render(
      <NativeBaseProvider theme={theme} initialWindowMetrics={inset}>
        <LoginScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    fireEvent.changeText(getByTestId('username-input'), '');
    fireEvent.changeText(getByTestId('password-input'), 'test');

    await waitFor(() => {
      const error = findByText('Username is required');
      expect(error).toBeDefined();
    });
  });
  it('should show an error message if the password is not entered', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByTestId, findByText } = render(
      <NativeBaseProvider theme={theme} initialWindowMetrics={inset}>
        <LoginScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    fireEvent.changeText(getByTestId('password-input'), '');
    fireEvent.changeText(getByTestId('username-input'), 'test');

    await waitFor(() => {
      const error = findByText('Password is required');
      expect(error).toBeDefined();
    });
  });
  it('should navigate to sign up screen when sign up button is pressed', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByTestId } = render(
      <NativeBaseProvider theme={theme} initialWindowMetrics={inset}>
        <LoginScreen navigation={navigation} />
      </NativeBaseProvider>,
    );
    fireEvent.press(getByTestId('auth-btn'));
    expect(navigation.navigate).toHaveBeenCalledWith('Registration');
  });
});
