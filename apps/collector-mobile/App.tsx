import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppNavigator } from './src/navigation/AppNavigator';
import { initializeDatabase } from './src/database/database';
import { colors } from './src/theme';

export default function App() {
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function setupDatabase() {
      try {
        await initializeDatabase();

        if (mounted) {
          setDatabaseReady(true);
        }
      } catch (error) {
        console.error('Database initialization failed:', error);

        if (mounted) {
          setDatabaseReady(true);
        }
      }
    }

    setupDatabase();

    return () => {
      mounted = false;
    };
  }, []);

  if (!databaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.brand}
        />

        <View style={styles.loadingText}>
          {/* Database is preparing in the background */}
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
  },

  loadingText: {
    height: 12,
  },
});