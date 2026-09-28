import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'kc_access_token';
const REFRESH_TOKEN_KEY = 'kc_refresh_token';
const USER_PHONE_KEY = 'kc_user_phone';
const BUSINESS_ROLE_KEY = 'kc_business_role';
export type SavedBusinessRole =
  | 'Collector'
  | 'Recycler'
  | 'Trader'
  | 'Manufacturer';

export async function saveSession({
  accessToken,
  refreshToken,
  phone,
  businessRole,
}: {
  accessToken: string;
  refreshToken: string;
  phone: string;
  businessRole: SavedBusinessRole;
}) {
  await Promise.all([
    SecureStore.setItemAsync(
      ACCESS_TOKEN_KEY,
      accessToken,
    ),

    SecureStore.setItemAsync(
      REFRESH_TOKEN_KEY,
      refreshToken,
    ),

    SecureStore.setItemAsync(
      USER_PHONE_KEY,
      phone,
    ),

    SecureStore.setItemAsync(
      BUSINESS_ROLE_KEY,
      businessRole,
    ),
  ]);
}

export async function getSession() {
  const [
    accessToken,
    refreshToken,
    phone,
    businessRole,
  ] = await Promise.all([
    SecureStore.getItemAsync(
      ACCESS_TOKEN_KEY,
    ),

    SecureStore.getItemAsync(
      REFRESH_TOKEN_KEY,
    ),

    SecureStore.getItemAsync(
      USER_PHONE_KEY,
    ),

    SecureStore.getItemAsync(
      BUSINESS_ROLE_KEY,
    ),
  ]);

  if (
    !accessToken ||
    !refreshToken ||
    !phone ||
    !businessRole
  ) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    phone,
    businessRole:
      businessRole as SavedBusinessRole,
  };
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(
      ACCESS_TOKEN_KEY,
    ),

    SecureStore.deleteItemAsync(
      REFRESH_TOKEN_KEY,
    ),

    SecureStore.deleteItemAsync(
      USER_PHONE_KEY,
    ),

    SecureStore.deleteItemAsync(
      BUSINESS_ROLE_KEY,
    ),
  ]);
}