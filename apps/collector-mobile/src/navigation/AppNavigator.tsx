import { useEffect, useState } from 'react';

import { SplashScreen } from '../screens/SplashScreen';
import { LanguageScreen } from '../screens/LanguageScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { RoleSelectionScreen } from '../screens/RoleSelectionScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

import { DashboardScreen } from '../screens/DashboardScreen';
import { RecyclerDashboardScreen } from '../screens/RecyclerDashboardScreen';
import { TraderDashboardScreen } from '../screens/TraderDashboardScreen';
import { ManufacturerDashboardScreen } from '../screens/ManufacturerDashboardScreen';

import { CreateLotScreen } from '../screens/CreateLotScreen';
import { MyLotsScreen } from '../screens/MyLotsScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { SafetyScreen } from '../screens/SafetyScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

import type {
  AppRoute,
  AppLanguage,
  BusinessRole,
} from './types';

/* =====================================================
   REGISTRATION DATA
===================================================== */

type RegistrationData = {
  name: string;
  phone: string;
};

/* =====================================================
   APP NAVIGATOR
===================================================== */

export function AppNavigator() {
  /* ===================================================
     NAVIGATION STATE
  =================================================== */

  const [route, setRoute] =
    useState<AppRoute>('splash');

  const [history, setHistory] =
    useState<AppRoute[]>([]);

  /* ===================================================
     LANGUAGE
  =================================================== */

  const [language, setLanguage] =
    useState<AppLanguage>('en');

  /* ===================================================
     BUSINESS ROLE
  =================================================== */

  const [businessRole, setBusinessRole] =
    useState<BusinessRole | null>(null);

  /* ===================================================
     LOGIN PHONE
  =================================================== */

  const [loginPhone, setLoginPhone] =
    useState('');

  /* ===================================================
     REGISTRATION DATA
  =================================================== */

  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null);

  /* ===================================================
     SPLASH SCREEN
     
     Splash will stay visible for 4.5 seconds.
     Then automatically open Language screen.
  =================================================== */

  useEffect(() => {
    if (route !== 'splash') {
      return;
    }

    const timer = setTimeout(() => {
      setHistory([]);
      setRoute('language');
    }, 4500);

    return () => {
      clearTimeout(timer);
    };
  }, [route]);

  /* ===================================================
     NORMAL NAVIGATION
  =================================================== */

  const navigateTo = (nextRoute: AppRoute) => {
    /*
     * Collector is allowed to create lots.
     *
     * Recycler / Trader / Manufacturer are not
     * allowed to create collector lots.
     */

    if (
      nextRoute === 'createLot' &&
      businessRole !== 'Collector'
    ) {
      console.warn(
        'Create Lot blocked. Current business role:',
        businessRole,
      );

      return;
    }

    /*
     * Save current route in history.
     */

    setHistory((current) => [
      ...current,
      route,
    ]);

    /*
     * Navigate.
     */

    setRoute(nextRoute);
  };

  /* ===================================================
     REPLACE ROUTE
  =================================================== */

  const replaceRoute = (nextRoute: AppRoute) => {
    setHistory([]);
    setRoute(nextRoute);
  };

  /* ===================================================
     BACK NAVIGATION
  =================================================== */

  const goBack = () => {
    setHistory((current) => {
      if (current.length === 0) {
        return current;
      }

      const previous =
        current[current.length - 1];

      setRoute(previous);

      return current.slice(0, -1);
    });
  };

  /* ===================================================
     SPLASH SCREEN
  =================================================== */

  if (route === 'splash') {
    return <SplashScreen />;
  }

  /* ===================================================
     LANGUAGE SCREEN
  =================================================== */

  if (route === 'language') {
    return (
      <LanguageScreen
        onSelect={(
          selectedLanguage,
          selectedRoute,
        ) => {
          setLanguage(selectedLanguage);

          replaceRoute(selectedRoute);
        }}
      />
    );
  }

  /* ===================================================
     LOGIN SCREEN
  =================================================== */

  if (route === 'login') {
    return (
      <LoginScreen
        language={language}
        onPhoneChange={setLoginPhone}
        onNavigate={navigateTo}
      />
    );
  }

  /* ===================================================
     OTP SCREEN
  =================================================== */

  if (route === 'otp') {
    return (
      <OtpScreen
        language={language}
        phone={loginPhone}
        onNavigate={navigateTo}

        /*
         * OtpScreen calls this after successful
         * login so AppNavigator knows the
         * logged-in user's role.
         */

        onRoleDetected={(role) => {
          setBusinessRole(role);
        }}
      />
    );
  }

  /* ===================================================
     REGISTER SCREEN
  =================================================== */

  if (route === 'register') {
    return (
      <RegisterScreen
        language={language}
        onNavigate={navigateTo}

        onRegisterStart={(data) => {
          setRegistrationData({
            name: data.name,
            phone: data.phone,
          });

          replaceRoute('roleSelection');
        }}
      />
    );
  }

  /* ===================================================
     ROLE SELECTION SCREEN
  =================================================== */

  if (route === 'roleSelection') {
    return (
      <RoleSelectionScreen
        language={language}

        registrationData={
          registrationData
        }

        registrationPhone={
          registrationData?.phone ??
          loginPhone
        }

        onNavigate={navigateTo}

        onRoleSelect={(role) => {
          /*
           * Store selected application role.
           */

          setBusinessRole(role);

          /*
           * Registration data is no longer needed.
           */

          setRegistrationData(null);

          /* -----------------------------------------
             COLLECTOR
          ----------------------------------------- */

          if (role === 'Collector') {
            replaceRoute('dashboard');
            return;
          }

          /* -----------------------------------------
             RECYCLER
          ----------------------------------------- */

          if (role === 'Recycler') {
            replaceRoute(
              'recyclerDashboard',
            );

            return;
          }

          /* -----------------------------------------
             TRADER
          ----------------------------------------- */

          if (role === 'Trader') {
            replaceRoute(
              'traderDashboard',
            );

            return;
          }

          /* -----------------------------------------
             MANUFACTURER
          ----------------------------------------- */

          if (role === 'Manufacturer') {
            replaceRoute(
              'manufacturerDashboard',
            );

            return;
          }
        }}
      />
    );
  }

  /* ===================================================
     COLLECTOR DASHBOARD
  =================================================== */

  if (route === 'dashboard') {
    return (
      <DashboardScreen
        onNavigate={navigateTo}
      />
    );
  }

  /* ===================================================
     RECYCLER DASHBOARD
  =================================================== */

  if (route === 'recyclerDashboard') {
    return (
      <RecyclerDashboardScreen
        onNavigate={navigateTo}
      />
    );
  }

  /* ===================================================
     TRADER DASHBOARD
  =================================================== */

  if (route === 'traderDashboard') {
    return (
      <TraderDashboardScreen
        onNavigate={navigateTo}
      />
    );
  }

  /* ===================================================
     MANUFACTURER DASHBOARD
  =================================================== */

  if (route === 'manufacturerDashboard') {
    return (
      <ManufacturerDashboardScreen
        onNavigate={navigateTo}
      />
    );
  }

  /* ===================================================
     CREATE LOT
  =================================================== */

  if (route === 'createLot') {
    /*
     * Only Collector can create a lot.
     */

    if (businessRole !== 'Collector') {
      console.warn(
        'Create Lot blocked. Current role:',
        businessRole,
      );

      return null;
    }

    return (
      <CreateLotScreen
        onNavigate={navigateTo}
      />
    );
  }

  /* ===================================================
     MY LOTS
  =================================================== */

  if (route === 'myLots') {
    return (
      <MyLotsScreen
        onNavigate={navigateTo}
        onBack={goBack}
      />
    );
  }

  /* ===================================================
     EARNINGS
  =================================================== */

  if (route === 'earnings') {
    return (
      <EarningsScreen
        onBack={goBack}
      />
    );
  }

  /* ===================================================
     SAFETY
  =================================================== */

  if (route === 'safety') {
    return (
      <SafetyScreen
        onBack={goBack}
      />
    );
  }

  /* ===================================================
     PROFILE
  =================================================== */

  if (route === 'profile') {
    return (
      <ProfileScreen
        language={language}
        onNavigate={navigateTo}
        onBack={goBack}
      />
    );
  }

  /* ===================================================
     FALLBACK
  =================================================== */

  return null;
}