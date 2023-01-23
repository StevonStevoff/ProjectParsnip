/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RegistrationScreen from '../../screens/AuthScreens/RegistrationScreen';
import AuthUtils from '../../api/utils/AuthUtils';

jest.mock('../../api/utils/AuthUtils', () => ({
  registerUser: jest.fn(() => Promise.resolve()),
  login: jest.fn(() => Promise.resolve()),
}));

describe('RegistrationScreen', () => {
  it('should render correctly', () => {
    render(<RegistrationScreen />);
  });
  it('should call the register user method when the sign up button is pressed', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<RegistrationScreen navigation={navigation} />);
    fireEvent.press(getByText('Sign Up →'));
    expect(AuthUtils.registerUser).toHaveBeenCalled();
  });

  it('should navigate to the login screen when the login button is pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<RegistrationScreen navigation={navigation} />);
    fireEvent.press(getByText('Login'));
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('should navigate redirect to auth utils login function when registering', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<RegistrationScreen navigation={navigation} />);
    fireEvent.press(getByText('Sign Up →'));
    expect(AuthUtils.registerUser).toHaveBeenCalled();
  });
});
