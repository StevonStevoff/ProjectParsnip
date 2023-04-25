import * as SecureStore from 'expo-secure-store';
import AuthUtils from '../../../api/utils/AuthUtils';
import API from '../../../api/API';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

jest.mock('../../../api/API', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  logout: jest.fn(),
  getAuthenticatedUser: jest.fn(),
  setJWTtoken: jest.fn(),
}));

describe('AuthUtils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('isUserAuthenticated', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns false when there is no token', async () => {
      SecureStore.getItemAsync.mockResolvedValue(null);
      const result = await AuthUtils.isUserAuthenticated();
      expect(result).toBe(false);
    });

    it('returns true when the token is valid', async () => {
      SecureStore.getItemAsync.mockResolvedValue('valid_token');
      API.getAuthenticatedUser.mockResolvedValue({ data: 'user_data' });
      const result = await AuthUtils.isUserAuthenticated();
      expect(API.setJWTtoken).toHaveBeenCalledWith('valid_token');
      expect(result).toBe(true);
    });

    it('returns false when the token is invalid', async () => {
      SecureStore.getItemAsync.mockResolvedValue('invalid_token');
      API.getAuthenticatedUser.mockRejectedValue(new Error('Invalid token'));
      const result = await AuthUtils.isUserAuthenticated();
      expect(API.setJWTtoken).toHaveBeenCalledWith('invalid_token');
      expect(result).toBe(false);
    });
  });

  describe('checkTokenVaildity', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns true when the token is valid', async () => {
      API.getAuthenticatedUser.mockResolvedValue({ data: 'user_data' });
      const result = await AuthUtils.checkTokenVaildity();
      expect(result).toBe(true);
    });

    it('returns false when the token is invalid', async () => {
      API.getAuthenticatedUser.mockRejectedValue(new Error('Invalid token'));
      const result = await AuthUtils.checkTokenVaildity();
      expect(result).toBe(false);
    });
  });

  describe('setUserToken', () => {
    it('stores the token in SecureStore', async () => {
      await AuthUtils.setUserToken('token');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('token', 'token');
    });
  });

  describe('login', () => {
    const navigation = { navigate: jest.fn() };
    const username = 'email@example.com';
    const password = 'password';

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('logs in the user and sets the token', async () => {
      API.loginUser.mockResolvedValue({
        data: { access_token: 'token' },
      });

      const result = await AuthUtils.login(navigation, username, password);

      expect(API.loginUser).toHaveBeenCalledWith({ username, password });
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('token', 'token');
      expect(navigation.navigate).toHaveBeenCalledWith('Navigation');
      expect(result).toBe('Successful Login');
    });

    it('handles authentication errors and returns a rejected promise', async () => {
      jest.spyOn(API, 'loginUser').mockRejectedValue({ response: { data: { detail: 'LOGIN_USER_NOT_VERIFIED' } } });
      jest.spyOn(AuthUtils, 'handleAuthenticationError');
      try {
        await AuthUtils.login({}, 'email@email.com', 'password');
      } catch (error) {
        expect(error).toBe('User not verified');
        expect(AuthUtils.handleAuthenticationError).toHaveBeenCalledWith('LOGIN_USER_NOT_VERIFIED');
      }
    });

    it('handles authentication errors and returns a rejected promise', async () => {
      jest.spyOn(API, 'loginUser').mockRejectedValue({ response: { data: { detail: 'LOGIN_BAD_CREDENTIALS' } } });
      jest.spyOn(AuthUtils, 'handleAuthenticationError');
      try {
        await AuthUtils.login({}, 'email', 'password');
      } catch (error) {
        expect(error).toBe('Login Credentails Incorrect');
        expect(AuthUtils.handleAuthenticationError).toHaveBeenCalledWith('LOGIN_BAD_CREDENTIALS');
      }
    });
  });
});