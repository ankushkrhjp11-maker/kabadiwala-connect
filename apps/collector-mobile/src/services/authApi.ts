import {
  getSession,
  saveSession,
  clearSession as clearStoredSession,
} from './authStorage';

/* =====================================================
   API CONFIG
   ===================================================== */

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  'http://10.118.193.160:3001/api';

/* =====================================================
   TYPES
   ===================================================== */

export type BusinessRoleApi =
  | 'RECYCLER'
  | 'TRADER'
  | 'MANUFACTURER';

export type AppBusinessRole =
  | 'Collector'
  | 'Recycler'
  | 'Trader'
  | 'Manufacturer';

export type SystemRole =
  | 'COLLECTOR'
  | 'RECYCLER'
  | 'ADMIN';

export type AuthUser = {
  id: string;
  phone: string;
  name: string | null;
  role: SystemRole;
  businessRole?: BusinessRoleApi | null;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type UpdateMyProfileData = {
  name: string;
  email: string;
  dateOfBirth: string;
  businessRole?: BusinessRoleApi;
  profileImageReference?: string;
};

/* =====================================================
   RESPONSE PARSER
   ===================================================== */

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text,
    };
  }
}

/* =====================================================
   ERROR MESSAGE
   ===================================================== */

function getApiErrorMessage(
  data: any,
  fallback: string,
) {
  if (Array.isArray(data?.message)) {
    return data.message.join(', ');
  }

  if (
    typeof data?.message === 'string' &&
    data.message.trim()
  ) {
    return data.message;
  }

  return fallback;
}

/* =====================================================
   LOGIN
   ===================================================== */

export async function loginWithPhone(
  phone: string,
): Promise<AuthResponse> {
  const cleanPhone = phone.replace(/\D/g, '');

  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        phone: cleanPhone,
      }),
    },
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(
        data,
        'Login failed',
      ),
    );
  }

  if (
    !data?.accessToken ||
    !data?.refreshToken ||
    !data?.user
  ) {
    throw new Error(
      'Invalid authentication response from server',
    );
  }

  return data as AuthResponse;
}

/* =====================================================
   REGISTER
   ===================================================== */

export async function registerUser(
  name: string,
  phone: string,
  businessRole: BusinessRoleApi | null,
): Promise<AuthResponse> {
  const cleanPhone = phone.replace(/\D/g, '');

  /*
   * ROLE MAPPING
   *
   * Collector:
   *   system role = COLLECTOR
   *   business role = NOT SENT
   *
   * Recycler:
   *   system role = RECYCLER
   *   business role = RECYCLER
   *
   * Trader:
   *   system role = COLLECTOR
   *   business role = TRADER
   *
   * Manufacturer:
   *   system role = COLLECTOR
   *   business role = MANUFACTURER
   */

  const systemRole =
    businessRole === 'RECYCLER'
      ? 'RECYCLER'
      : 'COLLECTOR';

  const requestBody: {
    name: string;
    phone: string;
    role: SystemRole;
    businessRole?: BusinessRoleApi;
  } = {
    name: name.trim(),
    phone: cleanPhone,
    role: systemRole,
  };

  /*
   * IMPORTANT:
   * Collector has no businessRole.
   * Therefore we completely omit businessRole
   * from the request instead of sending COLLECTOR.
   */
  if (businessRole !== null) {
    requestBody.businessRole = businessRole;
  }

  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    },
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(
        data,
        'Registration failed',
      ),
    );
  }

  if (
    !data?.accessToken ||
    !data?.refreshToken ||
    !data?.user
  ) {
    throw new Error(
      'Invalid registration response from server',
    );
  }

  return data as AuthResponse;
}

/* =====================================================
   SAVE AUTH SESSION
   ===================================================== */

export async function saveAuthSession(
  response: AuthResponse,
  businessRole: AppBusinessRole,
) {
  await saveSession({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    phone: response.user.phone,
    businessRole,
  });
}

/* =====================================================
   GET SESSION
   ===================================================== */

export { getSession };

/* =====================================================
   CLEAR SESSION
   ===================================================== */

export async function clearSession() {
  await clearStoredSession();
}

/* =====================================================
   RESTORE SESSION
   ===================================================== */

export async function restoreSession() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/me`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return session;
  } catch (error) {
    console.error(
      'Session restore failed:',
      error,
    );

    return null;
  }
}

/* =====================================================
   GET MY PROFILE
   ===================================================== */

export async function getMyProfile() {
  const session = await getSession();

  if (!session) {
    throw new Error('Session not found');
  }

  const response = await fetch(
    `${API_BASE_URL}/users/me/profile`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(
        data,
        'Unable to load profile',
      ),
    );
  }

  return data;
}

/* =====================================================
   UPDATE MY PROFILE
   ===================================================== */

export async function updateMyProfile(
  profile: UpdateMyProfileData,
) {
  const session = await getSession();

  if (!session) {
    throw new Error('Session not found');
  }

  const response = await fetch(
    `${API_BASE_URL}/users/me/profile`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(profile),
    },
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(
        data,
        'Unable to update profile',
      ),
    );
  }

  return data;
}