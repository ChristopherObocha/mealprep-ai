import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChefHat, Plus, X, Settings, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { themeMode } = useTheme();
  const { preferences } = usePreferences();
  const { isAuthenticated } = useAuth();
  const colors = Colors[themeMode];

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addIngredient = () => {
    if (inputValue.trim()) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateMeals = () => {
    if (ingredients.length === 0) {
      return;
    }
    router.push({
      pathname: '/meals',
      params: {
        ingredients: JSON.stringify(ingredients),
        diet: preferences.diet,
        allergies: JSON.stringify(preferences.allergies),
        goal: preferences.goal,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 16,
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: colors.primary + '15' }]}>
              <ChefHat size={28} color={colors.primary} strokeWidth={2} />
            </View>
            <View>
              <Text style={[styles.appName, { color: colors.text }]}>
                MealPrep AI
              </Text>
              <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                Your personal chef
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/settings')}
            style={[styles.settingsButton, { backgroundColor: colors.surface }]}
            hitSlop={8}
          >
            <Settings size={20} color={colors.text} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(100).springify()}>
          <Text style={[styles.title, { color: colors.text }]}>
            What ingredients{"\n"}do you have?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Add what&apos;s in your kitchen and we&apos;ll create amazing recipes
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={[styles.inputCard, { backgroundColor: colors.card }]}
        >
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Type an ingredient..."
            placeholderTextColor={colors.textTertiary}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={addIngredient}
            returnKeyType="done"
          />
          <Pressable
            onPress={addIngredient}
            style={[
              styles.addButton,
              {
                backgroundColor: inputValue.trim()
                  ? colors.primary
                  : colors.surface,
              },
            ]}
            disabled={!inputValue.trim()}
          >
            <Plus
              size={20}
              color={inputValue.trim() ? '#FFFFFF' : colors.textTertiary}
              strokeWidth={2}
            />
          </Pressable>
        </Animated.View>

        {ingredients.length > 0 && (
          <Animated.View
            entering={FadeInDown.springify()}
            style={styles.ingredientsContainer}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your ingredients ({ingredients.length})
            </Text>
            <View style={styles.ingredientsList}>
              {ingredients.map((ingredient, index) => (
                <Animated.View
                  key={`${ingredient}-${index}`}
                  entering={FadeInDown.delay(index * 50).springify()}
                  style={[
                    styles.ingredientChip,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.ingredientText, { color: colors.text }]}>
                    {ingredient}
                  </Text>
                  <Pressable
                    onPress={() => removeIngredient(index)}
                    hitSlop={8}
                  >
                    <X size={16} color={colors.textSecondary} strokeWidth={2} />
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {ingredients.length === 0 && (
          <Animated.View
            entering={FadeInUp.delay(300).springify()}
            style={styles.emptyState}
          >
            <View
              style={[
                styles.emptyIcon,
                { backgroundColor: colors.surface },
              ]}
            >
              <Sparkles size={32} color={colors.textTertiary} strokeWidth={1.5} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
              Start adding ingredients
            </Text>
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
              Try: chicken, rice, broccoli, garlic
            </Text>
          </Animated.View>
        )}

        {!isAuthenticated && ingredients.length > 0 && (
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            style={[styles.signupPrompt, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.signupText, { color: colors.textSecondary }]}>
              💡 Sign in to save your favorite recipes
            </Text>
            <Pressable onPress={() => router.push('/auth')}>
              <Text style={[styles.signupLink, { color: colors.primary }]}>
                Sign in
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>

      {ingredients.length > 0 && (
        <Animated.View
          entering={FadeInUp.springify()}
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + 16,
              backgroundColor: colors.background,
            },
          ]}
        >
          <Pressable
            style={[styles.generateButton, { backgroundColor: colors.primary }]}
            onPress={handleGenerateMeals}
          >
            <Sparkles size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.generateButtonText}>Generate Meals</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientsContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  ingredientText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  signupPrompt: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  signupText: {
    fontSize: 14,
    flex: 1,
  },
  signupLink: {
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  generateButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
