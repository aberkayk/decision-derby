import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BOTTLE_COLORS, BOTTLE_EMOJIS } from "../constants";
import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  View,
  useThemeColor,
} from "./Themed";

export interface DecisionOption {
  id: string;
  text: string;
  color: string;
  emoji: string;
}

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 8;

const buildInitialOptions = (): DecisionOption[] => {
  return [
    {
      id: "1",
      text: "",
      color: BOTTLE_COLORS[0].hex,
      emoji: BOTTLE_EMOJIS[0],
    },
    {
      id: "2",
      text: "",
      color: BOTTLE_COLORS[1].hex,
      emoji: BOTTLE_EMOJIS[1],
    },
  ];
};

const BottleCreate = () => {
  const router = useRouter();
  const backgroundSecondary = useThemeColor({}, "backgroundSecondary");
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");
  const buttonColor = useThemeColor({}, "button");

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<DecisionOption[]>(buildInitialOptions);

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;

    const nextIndex = options.length % BOTTLE_COLORS.length;
    const nextEmojiIndex = options.length % BOTTLE_EMOJIS.length;

    const newOption: DecisionOption = {
      id: Date.now().toString(),
      text: "",
      color: BOTTLE_COLORS[nextIndex].hex,
      emoji: BOTTLE_EMOJIS[nextEmojiIndex],
    };
    setOptions((prev) => [...prev, newOption]);
  };

  const removeOption = (id: string) => {
    if (options.length <= MIN_OPTIONS) return;
    setOptions((prev) => prev.filter((option) => option.id !== id));
  };

  const updateOption = (id: string, textValue: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, text: textValue } : option
      )
    );
  };

  const handleStartSpin = () => {
    if (!isValid) return;
    router.push({
      pathname: "/spin",
      params: {
        options: JSON.stringify(options),
      },
    });
  };

  const isValid =
    question.trim().length > 0 &&
    options.every((option) => option.text.trim().length > 0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea]}>
        <View style={styles.header}>
          <Text style={[styles.transitionEmoji, { color: buttonColor }]}>
            🍾
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.label, { color: textColor }]}>
            What should the bottle decide?
          </Text>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="e.g., Weekend at mountain or beach?"
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
              Spin options
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
                      { opacity: pressed ? 0.7 : 1 },
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
                <Text style={[styles.addOptionText, { color: buttonColor }]}>
                  Add Option
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="🍾 Spin the Bottle!"
            onPress={handleStartSpin}
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
};

export default BottleCreate;

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
