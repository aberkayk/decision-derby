import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  View,
  useThemeColor,
} from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export interface DecisionOption {
  id: string;
  text: string;
  color: string;
  emoji: string;
}

type CreateVariant = "horse" | "bottle";

type ColorPreset = {
  label: string;
  hex: string;
};

type VariantConfig = {
  variant: CreateVariant;
  questionLabel: string;
  questionPlaceholder: string;
  optionsLabel: string;
  buttonLabel: string;
  colors: readonly ColorPreset[];
  emojis: readonly string[];
};

const HORSE_COLORS: readonly ColorPreset[] = [
  { label: "Deep Red", hex: "#D62828" },
  { label: "Royal Blue", hex: "#0077B6" },
  { label: "Emerald", hex: "#2D6A4F" },
  { label: "Mustard", hex: "#E9C46A" },
  { label: "Violet", hex: "#8338EC" },
  { label: "Midnight Navy", hex: "#14213D" },
  { label: "Turf Green", hex: "#2EC4B6" },
  { label: "Golden Yellow", hex: "#FCA311" },
] as const;

const BOTTLE_COLORS: readonly ColorPreset[] = [
  { label: "Berry Punch", hex: "#9B5DE5" },
  { label: "Citrus Fizz", hex: "#F15BB5" },
  { label: "Lime Twist", hex: "#00BB72" },
  { label: "Ocean Mist", hex: "#00BBF9" },
  { label: "Peach Bellini", hex: "#FF9F1C" },
  { label: "Cranberry Splash", hex: "#EF476F" },
  { label: "Mint Cooler", hex: "#06D6A0" },
  { label: "Grape Soda", hex: "#7F2CCB" },
] as const;

const HORSE_EMOJIS = ["🏇", "🐎", "🦄", "🐴", "🎠", "⚡", "🌟", "💫"] as const;
const BOTTLE_EMOJIS = ["🍹", "🥂", "🍸", "🍻", "🍷", "🍾", "🎯", "🎉"] as const;

const VARIANT_CONFIG: Record<CreateVariant, VariantConfig> = {
  horse: {
    variant: "horse",
    questionLabel: "What should the race decide?",
    questionPlaceholder: "e.g., Which idea crosses the finish line?",
    optionsLabel: "Race options",
    buttonLabel: "🏁  Start Race!",
    colors: HORSE_COLORS,
    emojis: HORSE_EMOJIS,
  },
  bottle: {
    variant: "bottle",
    questionLabel: "What should the bottle decide?",
    questionPlaceholder: "e.g., Who takes the next dare?",
    optionsLabel: "Spin options",
    buttonLabel: "🍾  Spin the Bottle!",
    colors: BOTTLE_COLORS,
    emojis: BOTTLE_EMOJIS,
  },
};

const FALLBACK_COLOR = HORSE_COLORS[0];
const FALLBACK_EMOJI = HORSE_EMOJIS[0];

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 8;

function resolveVariant(value: string | string[] | undefined): CreateVariant {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized === "bottle" ? "bottle" : "horse";
}

function buildInitialOptions(config: VariantConfig): DecisionOption[] {
  const firstColor = config.colors[0] ?? FALLBACK_COLOR;
  const secondColor = config.colors[1] ?? config.colors[0] ?? FALLBACK_COLOR;
  const firstEmoji = config.emojis[0] ?? FALLBACK_EMOJI;
  const secondEmoji = config.emojis[1] ?? config.emojis[0] ?? FALLBACK_EMOJI;

  return [
    {
      id: "1",
      text: "",
      color: firstColor.hex,
      emoji: firstEmoji,
    },
    {
      id: "2",
      text: "",
      color: secondColor.hex,
      emoji: secondEmoji,
    },
  ];
}

export default function CreateScreen() {
  const router = useRouter();
  const { variant: variantParam, transition: transitionParam } =
    useLocalSearchParams<{
      variant?: string | string[];
      transition?: string | string[];
    }>();
  const variant = resolveVariant(variantParam);
  const transition = Array.isArray(transitionParam)
    ? transitionParam[0]
    : transitionParam;
  const variantConfig = VARIANT_CONFIG[variant];
  const backgroundColor = useThemeColor({}, "background");
  const backgroundSecondary = useThemeColor({}, "backgroundSecondary");
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");
  const buttonColor = useThemeColor({}, "button");

  // Set a transition-based emoji for visual feedback
  const transitionEmoji =
    transition === "spin" ? "🍾" : transition === "race" ? "🏇" : "🎲";

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<DecisionOption[]>(() =>
    buildInitialOptions(variantConfig)
  );

  useEffect(() => {
    setQuestion("");
    setOptions(buildInitialOptions(variantConfig));
  }, [variantConfig]);

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) {
      return;
    }

    const colors = variantConfig.colors.length
      ? variantConfig.colors
      : [FALLBACK_COLOR];
    const emojis = variantConfig.emojis.length
      ? variantConfig.emojis
      : [FALLBACK_EMOJI];
    const nextIndex = options.length % colors.length;
    const nextEmojiIndex = options.length % emojis.length;

    const newOption: DecisionOption = {
      id: Date.now().toString(),
      text: "",
      color: colors[nextIndex]?.hex ?? FALLBACK_COLOR.hex,
      emoji: emojis[nextEmojiIndex] ?? FALLBACK_EMOJI,
    };
    setOptions((prev) => [...prev, newOption]);
  };

  const removeOption = (id: string) => {
    if (options.length <= MIN_OPTIONS) {
      return;
    }
    setOptions((prev) => prev.filter((option) => option.id !== id));
  };

  const updateOption = (id: string, textValue: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, text: textValue } : option
      )
    );
  };

  const handleStartRace = () => {
    if (!isValid) {
      return;
    }

    // router.push("/race");
  };

  const isValid =
    question.trim().length > 0 &&
    options.every((option) => option.text.trim().length > 0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea]}>
        <View style={styles.header}>
          <Text style={[styles.transitionEmoji, { color: buttonColor }]}>
            {transitionEmoji}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.label, { color: textColor }]}>
            {variantConfig.questionLabel}
          </Text>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder={variantConfig.questionPlaceholder}
            placeholderTextColor={placeholderColor}
            style={[
              styles.input,
              {
                backgroundColor: backgroundSecondary,
                borderColor,
                shadowColor: borderColor,
              },
            ]}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.label, { color: textColor }]}>
              {variantConfig.optionsLabel}
            </Text>
            {options.map((option, index) => (
              <View
                key={option.id}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: backgroundSecondary,
                    borderColor,
                    shadowColor: borderColor,
                  },
                ]}
              >
                <View
                  style={[
                    styles.optionBadge,
                    { backgroundColor: option.color },
                  ]}
                >
                  <Text lightColor="#ffffff" darkColor="#ffffff">
                    {index + 1}
                  </Text>
                </View>
                <TextInput
                  value={option.text}
                  onChangeText={(value) => updateOption(option.id, value)}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor={placeholderColor}
                  style={[
                    styles.optionInput,
                    {
                      backgroundColor: backgroundSecondary,
                      borderColor: backgroundSecondary,
                      borderWidth: 0,
                      shadowOpacity: 0,
                      shadowRadius: 0,
                    },
                  ]}
                />
                {options.length > MIN_OPTIONS && (
                  <Pressable
                    accessibilityLabel={`Remove option ${index + 1}`}
                    accessibilityRole="button"
                    onPress={() => removeOption(option.id)}
                    style={({ pressed }) => [
                      styles.removeButton,
                      {
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Feather name="x" size={20} color="#D62828" />
                  </Pressable>
                )}
              </View>
            ))}

            {options.length < MAX_OPTIONS && (
              <Pressable
                accessibilityRole="button"
                onPress={addOption}
                style={({ pressed }) => [
                  styles.addOptionButton,
                  {
                    borderColor,
                    backgroundColor: backgroundSecondary,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Feather name="plus" size={20} color={buttonColor} />
                <Text
                  style={[
                    styles.addOptionText,
                    { color: buttonColor, borderColor: buttonColor },
                  ]}
                >
                  Add Option
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={variantConfig.buttonLabel}
            onPress={handleStartRace}
            disabled={!isValid}
            style={[
              styles.startButton,
              { shadowColor: buttonColor },
              !isValid && styles.startButtonDisabled,
            ]}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  transitionEmoji: {
    fontSize: 32,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  optionInput: {
    flex: 1,
    paddingHorizontal: 0,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  addOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
  },
  addOptionText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    paddingTop: 16,
  },
  startButton: {
    borderRadius: 12,
    paddingVertical: 18,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
});
