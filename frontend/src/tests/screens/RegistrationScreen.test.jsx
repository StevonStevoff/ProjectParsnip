import React from 'react';
import {
  render, waitFor, fireEvent, cleanup,
} from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import RegistrationScreen from '../../screens/AuthScreens/RegistrationScreen';
import SignUpForm from '../../components/SignUpForm';
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
  test('renders the create account heading', async () => {
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
});
