import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  View,
  useThemeColor,
} from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export interface DecisionOption {
  id: string;
  text: string;
  color: string;
  emoji: string;
}

const HORSE_COLORS = [
  { label: "Deep Red", hex: "#D62828" },
  { label: "Royal Blue", hex: "#0077B6" },
  { label: "Emerald", hex: "#2D6A4F" },
  { label: "Mustard", hex: "#E9C46A" },
  { label: "Violet", hex: "#8338EC" },
  { label: "Midnight Navy", hex: "#14213D" },
  { label: "Turf Green", hex: "#2EC4B6" },
  { label: "Golden Yellow", hex: "#FCA311" },
] as const;

const HORSE_EMOJIS = ["🏇", "🐎", "🦄", "🐴", "🎠", "⚡", "🌟", "💫"] as const;

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 8;

export default function CreateScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const backgroundSecondary = useThemeColor({}, "backgroundSecondary");
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");
  const buttonColor = useThemeColor({}, "button");

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<DecisionOption[]>([
    {
      id: "1",
      text: "",
      color: HORSE_COLORS[0].hex,
      emoji: HORSE_EMOJIS[0],
    },
    {
      id: "2",
      text: "",
      color: HORSE_COLORS[1].hex,
      emoji: HORSE_EMOJIS[1],
    },
  ]);

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) {
      return;
    }

    const nextIndex = options.length % HORSE_COLORS.length;
    const nextEmojiIndex = options.length % HORSE_EMOJIS.length;

    const newOption: DecisionOption = {
      id: Date.now().toString(),
      text: "",
      color: HORSE_COLORS[nextIndex].hex,
      emoji: HORSE_EMOJIS[nextEmojiIndex],
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
        <View style={styles.section}>
          <Text style={[styles.label, { color: textColor }]}>
            What can&apos;t you decide?
          </Text>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="e.g., What should we eat?"
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
              Options (Add 2-8 choices)
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
            title="🏁  Start Race!"
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
    marginBottom: 16,
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
    marginTop: 8,
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
