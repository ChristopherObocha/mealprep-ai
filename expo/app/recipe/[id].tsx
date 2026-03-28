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
import { ArrowLeft, Clock, ChefHat } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/colors';
import type { Meal } from '@/lib/api';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { themeMode } = useTheme();
  const colors = Colors[themeMode];

  const meal: Meal = JSON.parse((params.meal as string) || '{}');

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
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          Recipe
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroSection}>
          <Text style={[styles.title, { color: colors.text }]}>{meal.title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {meal.description}
          </Text>

          <View style={styles.metaRow}>
            {meal.prep_time && (
              <View style={[styles.metaItem, { backgroundColor: colors.surface }]}>
                <Clock size={18} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.metaText, { color: colors.text }]}>
                  {meal.prep_time}
                </Text>
              </View>
            )}
            {meal.difficulty && (
              <View style={[styles.metaItem, { backgroundColor: colors.surface }]}>
                <ChefHat size={18} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.metaText, { color: colors.text }]}>
                  {meal.difficulty}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutrition Info</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionCard}>
              <Text style={[styles.nutritionValue, { color: colors.primary }]}>
                {meal.nutrition.calories}
              </Text>
              <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>
                Calories
              </Text>
            </View>
            <View style={styles.nutritionCard}>
              <Text style={[styles.nutritionValue, { color: colors.primary }]}>
                {meal.nutrition.protein}
              </Text>
              <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>
                Protein
              </Text>
            </View>
            {meal.nutrition.carbs && (
              <View style={styles.nutritionCard}>
                <Text style={[styles.nutritionValue, { color: colors.primary }]}>
                  {meal.nutrition.carbs}
                </Text>
                <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>
                  Carbs
                </Text>
              </View>
            )}
            {meal.nutrition.fat && (
              <View style={styles.nutritionCard}>
                <Text style={[styles.nutritionValue, { color: colors.primary }]}>
                  {meal.nutrition.fat}
                </Text>
                <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>
                  Fat
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Ingredients ({meal.ingredients.length})
          </Text>
          <View style={styles.ingredientsList}>
            {meal.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View
                  style={[styles.ingredientBullet, { backgroundColor: colors.primary }]}
                />
                <Text style={[styles.ingredientText, { color: colors.text }]}>
                  {ingredient}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Instructions ({meal.steps.length} steps)
          </Text>
          <View style={styles.stepsList}>
            {meal.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepNumber,
                    { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                >
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.text }]}>{step}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 38,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionCard: {
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ingredientText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  stepsList: {
    gap: 20,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    paddingTop: 4,
  },
});
