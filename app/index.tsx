import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/colors';

export default function IndexScreen() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  const { isLoading: prefsLoading, hasCompletedOnboarding } = usePreferences();
  const { themeMode } = useTheme();
  const colors = Colors[themeMode];

  useEffect(() => {
    if (!authLoading && !prefsLoading) {
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/home');
      }
    }
  }, [authLoading, prefsLoading, hasCompletedOnboarding, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
