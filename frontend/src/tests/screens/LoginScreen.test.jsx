/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../../screens/AuthScreens/LoginScreen';
import AuthUtils from '../../api/utils/AuthUtils';

jest.mock('../../api/utils/AuthUtils', () => ({
  login: jest.fn(() => Promise.resolve()),
}));

describe('LoginScreen', () => {
  it('should render correctly', () => {
    render(<LoginScreen />);
  });
  it('should call the login method when the login button is pressed', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<LoginScreen navigation={navigation} />);
    fireEvent.press(getByText('Login →'));
    expect(AuthUtils.login).toHaveBeenCalled();
  });

  it('should navigate to the registration screen when the sign up button is pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<LoginScreen navigation={navigation} />);
    fireEvent.press(getByText('Sign Up'));
    expect(navigation.navigate).toHaveBeenCalledWith('Registration');
  });

  it('should navigate to the forgot password screen when the forgot password button is pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<LoginScreen navigation={navigation} />);
    fireEvent.press(getByText('Forgot Password?'));
    expect(navigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });
});
