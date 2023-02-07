import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../screens/AuthScreens/LoginScreen';
import AuthUtils from '../../api/utils/AuthUtils';

jest.mock('../../api/utils/AuthUtils', () => ({
  login: jest.fn(() => Promise.resolve({ status: 200 })),
}));

describe('LoginScreen', () => {
  it('should render without errors', () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText } = render(<LoginScreen navigation={navigation} />);
    expect(getByPlaceholderText('Email')).toBeDefined();
    expect(getByPlaceholderText('Password')).toBeDefined();
  });

  it('should show validation error messages for empty inputs', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={navigation} />,
    );
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitBtn = getByText('Login →');

    fireEvent.changeText(emailInput, '');
    fireEvent.changeText(passwordInput, '');
    fireEvent.press(submitBtn);
    await waitFor(() => expect(getByText('Email is required')).toBeDefined());
    await waitFor(() => expect(getByText('Password is required')).toBeDefined());
  });

  it('should show error message for incorrect email', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={navigation} />,
    );
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitBtn = getByText('Login →');

    fireEvent.changeText(emailInput, 'not an email');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(submitBtn);
    await waitFor(() => expect(getByText('Invalid email')).toBeDefined());
  });

  it('should call login API on successful form submission', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={navigation} />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitBtn = getByText('Login →');

    fireEvent.changeText(emailInput, 'email@domain.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(submitBtn);
    await waitFor(() => expect(AuthUtils.login).toHaveBeenCalled());
  });

  it('should navigate to the registration screen when the register button is pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<LoginScreen navigation={navigation} />);
    fireEvent.press(getByText('Sign Up'));
    expect(navigation.navigate).toHaveBeenCalledWith('Registration');
  });
});
