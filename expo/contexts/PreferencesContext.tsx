import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import type { UserPreferences } from '@/constants/preferences';

const STORAGE_KEY = 'user_preferences';

export const [PreferencesProvider, usePreferences] = createContextHook(() => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    diet: 'balanced',
    allergies: [],
    goal: 'balanced',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    loadPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(parsed.preferences || preferences);
        setHasCompletedOnboarding(parsed.hasCompletedOnboarding || false);
      }
    } catch (error) {
      console.log('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      setPreferences(newPreferences);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          preferences: newPreferences,
          hasCompletedOnboarding,
        })
      );
    } catch (error) {
      console.log('Error saving preferences:', error);
    }
  };

  const completeOnboarding = async (prefs: UserPreferences) => {
    try {
      setPreferences(prefs);
      setHasCompletedOnboarding(true);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          preferences: prefs,
          hasCompletedOnboarding: true,
        })
      );
    } catch (error) {
      console.log('Error completing onboarding:', error);
    }
  };

  return {
    preferences,
    savePreferences,
    completeOnboarding,
    hasCompletedOnboarding,
    isLoading,
  };
});
