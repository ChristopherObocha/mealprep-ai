import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChefHat, Sparkles, Heart, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import Colors from '@/constants/colors';
import {
  DIET_OPTIONS,
  GOAL_OPTIONS,
  COMMON_ALLERGIES,
  type UserPreferences,
} from '@/constants/preferences';

const SCREENS = [
  {
    title: 'Welcome to\nMealPrep AI',
    subtitle: 'Your personal chef, powered by AI',
    icon: ChefHat,
  },
  {
    title: 'Dietary\nPreferences',
    subtitle: 'Tell us about your eating style',
    icon: Sparkles,
  },
  {
    title: 'Health Goals',
    subtitle: 'What are you working towards?',
    icon: Heart,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeMode } = useTheme();
  const { completeOnboarding } = usePreferences();
  const colors = Colors[themeMode];

  const [currentScreen, setCurrentScreen] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    diet: 'balanced',
    allergies: [],
    goal: 'balanced',
  });

  const handleNext = () => {
    if (currentScreen < SCREENS.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      completeOnboarding(preferences);
      router.replace('/home');
    }
  };

  const handleSkip = () => {
    completeOnboarding(preferences);
    router.replace('/home');
  };

  const toggleAllergy = (allergy: string) => {
    setPreferences((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16, paddingHorizontal: 24 },
        ]}
      >
        <View style={styles.indicators}>
          {SCREENS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: colors.primary,
                  width: index === currentScreen ? 32 : 8,
                  opacity: index === currentScreen ? 1 : 0.3,
                },
              ]}
            />
          ))}
        </View>

        {currentScreen > 0 && (
          <Pressable onPress={handleSkip} hitSlop={8}>
            <Text style={[styles.skipText, { color: colors.textSecondary }]}>
              Skip
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {currentScreen === 0 && (
          <WelcomeScreen colors={colors} screen={SCREENS[0]} />
        )}
        {currentScreen === 1 && (
          <DietScreen
            colors={colors}
            preferences={preferences}
            setPreferences={setPreferences}
            toggleAllergy={toggleAllergy}
          />
        )}
        {currentScreen === 2 && (
          <GoalScreen
            colors={colors}
            preferences={preferences}
            setPreferences={setPreferences}
          />
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 16,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentScreen === SCREENS.length - 1 ? "Let's Cook" : 'Continue'}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

function WelcomeScreen({
  colors,
  screen,
}: {
  colors: (typeof Colors)['light'];
  screen: (typeof SCREENS)[0];
}) {
  const Icon = screen.icon;

  return (
    <View style={styles.screenContent}>
      <Animated.View
        entering={FadeInUp.delay(100).springify()}
        style={[styles.iconContainer, { backgroundColor: colors.surface }]}
      >
        <Icon size={64} color={colors.primary} strokeWidth={1.5} />
      </Animated.View>

      <Animated.Text
        entering={FadeInUp.delay(200).springify()}
        style={[styles.title, { color: colors.text }]}
      >
        {screen.title}
      </Animated.Text>

      <Animated.Text
        entering={FadeInUp.delay(300).springify()}
        style={[styles.subtitle, { color: colors.textSecondary }]}
      >
        {screen.subtitle}
      </Animated.Text>

      <Animated.View
        entering={FadeInDown.delay(400).springify()}
        style={styles.features}
      >
        <FeatureItem
          colors={colors}
          text="AI-powered recipe generation"
          delay={500}
        />
        <FeatureItem
          colors={colors}
          text="Personalized to your tastes"
          delay={600}
        />
        <FeatureItem
          colors={colors}
          text="Simple ingredient lists"
          delay={700}
        />
      </Animated.View>
    </View>
  );
}

function FeatureItem({
  colors,
  text,
  delay,
}: {
  colors: (typeof Colors)['light'];
  text: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()} style={styles.featureItem}>
      <View style={[styles.checkmark, { backgroundColor: colors.success + '20' }]}>
        <Text style={{ color: colors.success, fontSize: 16 }}>✓</Text>
      </View>
      <Text style={[styles.featureText, { color: colors.text }]}>{text}</Text>
    </Animated.View>
  );
}

function DietScreen({
  colors,
  preferences,
  setPreferences,
  toggleAllergy,
}: {
  colors: (typeof Colors)['light'];
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  toggleAllergy: (allergy: string) => void;
}) {
  return (
    <View style={styles.screenContent}>
      <Animated.View
        entering={FadeInUp.delay(100).springify()}
        style={[styles.iconContainer, { backgroundColor: colors.surface }]}
      >
        <Sparkles size={64} color={colors.primary} strokeWidth={1.5} />
      </Animated.View>

      <Animated.Text
        entering={FadeInUp.delay(200).springify()}
        style={[styles.title, { color: colors.text }]}
      >
        Dietary{'\n'}Preferences
      </Animated.Text>

      <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Choose your diet
        </Text>
        <View style={styles.optionsGrid}>
          {DIET_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionCard,
                {
                  backgroundColor:
                    preferences.diet === option.value
                      ? colors.primary + '15'
                      : colors.surface,
                  borderColor:
                    preferences.diet === option.value
                      ? colors.primary
                      : colors.border,
                },
              ]}
              onPress={() => setPreferences({ ...preferences, diet: option.value })}
            >
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color:
                      preferences.diet === option.value
                        ? colors.primary
                        : colors.text,
                  },
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[styles.optionDescription, { color: colors.textSecondary }]}
              >
                {option.description}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Allergies (optional)
        </Text>
        <View style={styles.allergiesContainer}>
          {COMMON_ALLERGIES.map((allergy) => (
            <Pressable
              key={allergy}
              style={[
                styles.allergyChip,
                {
                  backgroundColor: preferences.allergies.includes(allergy)
                    ? colors.error + '15'
                    : colors.surface,
                  borderColor: preferences.allergies.includes(allergy)
                    ? colors.error
                    : colors.border,
                },
              ]}
              onPress={() => toggleAllergy(allergy)}
            >
              <Text
                style={[
                  styles.allergyText,
                  {
                    color: preferences.allergies.includes(allergy)
                      ? colors.error
                      : colors.text,
                  },
                ]}
              >
                {allergy}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function GoalScreen({
  colors,
  preferences,
  setPreferences,
}: {
  colors: (typeof Colors)['light'];
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
}) {
  return (
    <View style={styles.screenContent}>
      <Animated.View
        entering={FadeInUp.delay(100).springify()}
        style={[styles.iconContainer, { backgroundColor: colors.surface }]}
      >
        <Heart size={64} color={colors.primary} strokeWidth={1.5} />
      </Animated.View>

      <Animated.Text
        entering={FadeInUp.delay(200).springify()}
        style={[styles.title, { color: colors.text }]}
      >
        Health Goals
      </Animated.Text>

      <Animated.Text
        entering={FadeInUp.delay(300).springify()}
        style={[styles.subtitle, { color: colors.textSecondary, marginBottom: 32 }]}
      >
        What are you working towards?
      </Animated.Text>

      <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.goalsContainer}>
        {GOAL_OPTIONS.map((option, index) => (
          <Animated.View
            key={option.value}
            entering={FadeInUp.delay(500 + index * 100).springify()}
          >
            <Pressable
              style={[
                styles.goalCard,
                {
                  backgroundColor:
                    preferences.goal === option.value
                      ? colors.primary + '15'
                      : colors.card,
                  borderColor:
                    preferences.goal === option.value
                      ? colors.primary
                      : colors.border,
                },
              ]}
              onPress={() => setPreferences({ ...preferences, goal: option.value })}
            >
              <View style={styles.goalContent}>
                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor:
                        preferences.goal === option.value
                          ? colors.primary
                          : colors.border,
                    },
                  ]}
                >
                  {preferences.goal === option.value && (
                    <View
                      style={[styles.radioInner, { backgroundColor: colors.primary }]}
                    />
                  )}
                </View>
                <View style={styles.goalText}>
                  <Text
                    style={[
                      styles.goalLabel,
                      {
                        color:
                          preferences.goal === option.value
                            ? colors.text
                            : colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[styles.goalDescription, { color: colors.textSecondary }]}
                  >
                    {option.description}
                  </Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </Animated.View>
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
  },
  indicators: {
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    height: 4,
    borderRadius: 2,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  screenContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  features: {
    marginTop: 48,
    gap: 16,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
  section: {
    width: '100%',
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  allergiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  allergyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  goalsContainer: {
    width: '100%',
    gap: 12,
  },
  goalCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  goalText: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 15,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  button: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
