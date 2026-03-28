import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Loader } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/colors';
import { generateMeals, type Meal } from '@/lib/api';

export default function MealsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { themeMode } = useTheme();
  const colors = Colors[themeMode];

  const ingredients = JSON.parse((params.ingredients as string) || '[]') as string[];
  const diet = (params.diet as string) || 'balanced';
  const allergies = JSON.parse((params.allergies as string) || '[]') as string[];
  const goal = (params.goal as string) || 'balanced';

  const { data, isLoading, error } = useQuery({
    queryKey: ['meals', ingredients, diet, allergies, goal],
    queryFn: () =>
      generateMeals({
        ingredients,
        diet,
        allergies,
        goal,
        count: 3,
      }),
  });

  const handleMealPress = (meal: Meal, index: number) => {
    router.push({
      pathname: '/recipe/[id]',
      params: {
        id: index.toString(),
        meal: JSON.stringify(meal),
      },
    });
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Your Meals</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <View
              style={[
                styles.loadingCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Loader size={48} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.loadingTitle, { color: colors.text }]}>
                Cooking up something special...
              </Text>
              <Text style={[styles.loadingSubtitle, { color: colors.textSecondary }]}>
                AI is generating personalized recipes for you
              </Text>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <View
              style={[
                styles.errorCard,
                { backgroundColor: colors.error + '15', borderColor: colors.error },
              ]}
            >
              <Text style={[styles.errorTitle, { color: colors.error }]}>
                Oops! Something went wrong
              </Text>
              <Text style={[styles.errorText, { color: colors.text }]}>
                {error instanceof Error ? error.message : 'Failed to generate meals'}
              </Text>
              <Pressable
                style={[styles.retryButton, { backgroundColor: colors.primary }]}
                onPress={() => router.back()}
              >
                <Text style={styles.retryButtonText}>Go Back</Text>
              </Pressable>
            </View>
          </View>
        )}

        {data?.meals && (
          <View style={styles.mealsContainer}>
            <Animated.Text
              entering={FadeInDown.delay(100).springify()}
              style={[styles.title, { color: colors.text }]}
            >
              Perfect for you
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(200).springify()}
              style={[styles.subtitle, { color: colors.textSecondary }]}
            >
              {data.meals.length} recipes based on your ingredients
            </Animated.Text>

            <View style={styles.mealsList}>
              {data.meals.map((meal, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(300 + index * 100).springify()}
                >
                  <Pressable
                    style={[
                      styles.mealCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => handleMealPress(meal, index)}
                  >
                    <View style={styles.mealHeader}>
                      <View style={styles.mealTitleContainer}>
                        <Text style={[styles.mealTitle, { color: colors.text }]}>
                          {meal.title}
                        </Text>
                        {meal.difficulty && (
                          <View
                            style={[
                              styles.badge,
                              {
                                backgroundColor:
                                  meal.difficulty === 'Easy'
                                    ? colors.success + '20'
                                    : meal.difficulty === 'Hard'
                                    ? colors.error + '20'
                                    : colors.primary + '20',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgeText,
                                {
                                  color:
                                    meal.difficulty === 'Easy'
                                      ? colors.success
                                      : meal.difficulty === 'Hard'
                                      ? colors.error
                                      : colors.primary,
                                },
                              ]}
                            >
                              {meal.difficulty}
                            </Text>
                          </View>
                        )}
                      </View>
                      {meal.prep_time && (
                        <Text style={[styles.prepTime, { color: colors.textSecondary }]}>
                          {meal.prep_time}
                        </Text>
                      )}
                    </View>

                    <Text style={[styles.mealDescription, { color: colors.textSecondary }]}>
                      {meal.description}
                    </Text>

                    <View style={styles.nutritionRow}>
                      <View style={styles.nutritionItem}>
                        <Text style={[styles.nutritionValue, { color: colors.text }]}>
                          {meal.nutrition.calories}
                        </Text>
                        <Text style={[styles.nutritionLabel, { color: colors.textTertiary }]}>
                          Calories
                        </Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={[styles.nutritionValue, { color: colors.text }]}>
                          {meal.nutrition.protein}
                        </Text>
                        <Text style={[styles.nutritionLabel, { color: colors.textTertiary }]}>
                          Protein
                        </Text>
                      </View>
                      {meal.nutrition.carbs && (
                        <View style={styles.nutritionItem}>
                          <Text style={[styles.nutritionValue, { color: colors.text }]}>
                            {meal.nutrition.carbs}
                          </Text>
                          <Text
                            style={[styles.nutritionLabel, { color: colors.textTertiary }]}
                          >
                            Carbs
                          </Text>
                        </View>
                      )}
                      {meal.nutrition.fat && (
                        <View style={styles.nutritionItem}>
                          <Text style={[styles.nutritionValue, { color: colors.text }]}>
                            {meal.nutrition.fat}
                          </Text>
                          <Text
                            style={[styles.nutritionLabel, { color: colors.textTertiary }]}
                          >
                            Fat
                          </Text>
                        </View>
                      )}
                    </View>

                    <View
                      style={[
                        styles.viewRecipeButton,
                        { backgroundColor: colors.primary + '15' },
                      ]}
                    >
                      <Text style={[styles.viewRecipeText, { color: colors.primary }]}>
                        View Full Recipe
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </View>
        )}
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
  },
  loadingContainer: {
    paddingHorizontal: 24,
    paddingTop: 120,
  },
  loadingCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  errorCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  mealsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  mealsList: {
    gap: 16,
  },
  mealCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  mealHeader: {
    marginBottom: 12,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  prepTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  mealDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    marginBottom: 16,
  },
  nutritionItem: {
    flex: 1,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewRecipeButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewRecipeText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
