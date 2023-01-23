/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../screens/AuthScreens/ProfileScreen';
import AuthUtils from '../../api/utils/AuthUtils';

jest.mock('../../api/utils/AuthUtils', () => ({
  logout: jest.fn(() => Promise.resolve()),
}));

describe('LoginScreen', () => {
  it('should render correctly', () => {
    render(<ProfileScreen />);
  });
  it('should call the logout function when log out is pressed', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<ProfileScreen navigation={navigation} />);
    fireEvent.press(getByText('Logout'));
    expect(AuthUtils.logout).toHaveBeenCalled();
  });
});
