import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegistrationScreen from '../../screens/AuthScreens/RegistrationScreen';
import AuthUtils from '../../api/utils/AuthUtils';

jest.mock('../../api/utils/AuthUtils', () => ({
  registerUser: jest.fn(() => Promise.resolve({ status: 200 })),
}));

describe('Registration screen', () => {
  it('should render without errors', () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText } = render(<RegistrationScreen navigation={navigation} />);
    expect(getByPlaceholderText('Email')).toBeDefined();
    expect(getByPlaceholderText('Password')).toBeDefined();
  });

  it('should show validation error messages for empty inputs', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, getByPlaceholderText } = render(
      <RegistrationScreen navigation={navigation} />,
    );
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitBtn = getByText('Sign Up →');

    fireEvent.changeText(emailInput, '');
    fireEvent.changeText(passwordInput, '');
    fireEvent.press(submitBtn);
    await waitFor(() => expect(getByText('Email is required')).toBeDefined());
    await waitFor(() => expect(getByText('Password is required')).toBeDefined());
  });

  it('should show error message for incorrect email', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, getByPlaceholderText } = render(
      <RegistrationScreen navigation={navigation} />,
    );
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitBtn = getByText('Sign Up →');

    fireEvent.changeText(emailInput, 'not an email');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(submitBtn);
    await waitFor(() => expect(getByText('Invalid email')).toBeDefined());
  });

  it('should call login API on successful form submission', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <RegistrationScreen navigation={navigation} />,
    );
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitBtn = getByText('Sign Up →');

    fireEvent.changeText(emailInput, 'email@domain.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(submitBtn);
    await waitFor(() => expect(AuthUtils.registerUser).toHaveBeenCalled());
  });

  it('should navigate to the registration screen when the register button is pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<RegistrationScreen navigation={navigation} />);
    fireEvent.press(getByText('Login'));
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });
});
