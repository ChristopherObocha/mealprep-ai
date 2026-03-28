import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Moon,
  Sun,
  User,
  LogOut,
  Trash2,
  ChefHat,
  Sparkles,
  Heart,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import Colors from '@/constants/colors';
import { DIET_OPTIONS, GOAL_OPTIONS } from '@/constants/preferences';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeMode, toggleTheme, isDark } = useTheme();
  const { isAuthenticated, user, signOut, deleteAccount } = useAuth();
  const { preferences } = usePreferences();
  const colors = Colors[themeMode];

  const selectedDiet = DIET_OPTIONS.find((d) => d.value === preferences.diet);
  const selectedGoal = GOAL_OPTIONS.find((g) => g.value === preferences.goal);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/home');
    } catch {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace('/home');
            } catch {
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16, backgroundColor: colors.background },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              APPEARANCE
            </Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Pressable style={styles.settingRow} onPress={toggleTheme}>
                <View style={styles.settingLeft}>
                  {isDark ? (
                    <Moon size={22} color={colors.text} strokeWidth={2} />
                  ) : (
                    <Sun size={22} color={colors.text} strokeWidth={2} />
                  )}
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                </View>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                  Tap to switch
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              YOUR PREFERENCES
            </Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Sparkles size={22} color={colors.text} strokeWidth={2} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Diet</Text>
                </View>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                  {selectedDiet?.label || 'Balanced'}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Heart size={22} color={colors.text} strokeWidth={2} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Goal</Text>
                </View>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                  {selectedGoal?.label || 'Balanced'}
                </Text>
              </View>

              {preferences.allergies.length > 0 && (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                      <ChefHat size={22} color={colors.text} strokeWidth={2} />
                      <Text style={[styles.settingLabel, { color: colors.text }]}>
                        Allergies
                      </Text>
                    </View>
                    <Text
                      style={[styles.settingValue, { color: colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {preferences.allergies.join(', ')}
                    </Text>
                  </View>
                </>
              )}
            </View>

            <Pressable
              style={[styles.editButton, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/onboarding')}
            >
              <Text style={[styles.editButtonText, { color: colors.primary }]}>
                Edit Preferences
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              ACCOUNT
            </Text>
            {isAuthenticated ? (
              <View style={[styles.card, { backgroundColor: colors.card }]}>
                <View style={styles.settingRow}>
                  <View style={styles.settingLeft}>
                    <User size={22} color={colors.text} strokeWidth={2} />
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Email</Text>
                  </View>
                  <Text
                    style={[styles.settingValue, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {user?.email || 'N/A'}
                  </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <Pressable style={styles.settingRow} onPress={handleSignOut}>
                  <View style={styles.settingLeft}>
                    <LogOut size={22} color={colors.text} strokeWidth={2} />
                    <Text style={[styles.settingLabel, { color: colors.text }]}>
                      Sign Out
                    </Text>
                  </View>
                </Pressable>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <Pressable style={styles.settingRow} onPress={handleDeleteAccount}>
                  <View style={styles.settingLeft}>
                    <Trash2 size={22} color={colors.error} strokeWidth={2} />
                    <Text style={[styles.settingLabel, { color: colors.error }]}>
                      Delete Account
                    </Text>
                  </View>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={[styles.signInButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/auth')}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            MealPrep AI v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 15,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    marginLeft: 50,
  },
  editButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  signInButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
  },
});
