import {
  Button,
  SafeAreaView,
  Text,
  View,
  useThemeColor,
} from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const SPIN_STEPS = [
  { emoji: "📝", label: "Add options" },
  { emoji: "🍾", label: "Spin the bottle" },
  { emoji: "🎉", label: "Get answer" },
] as const;

export default function BottleScreen() {
  const router = useRouter();
  const backgroundSecondaryColor = useThemeColor({}, "backgroundSecondary");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const tintColor = useThemeColor({}, "tint");
  const buttonColor = useThemeColor({}, "button");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.push("/history-modal")}
            accessibilityLabel="View history"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: backgroundSecondaryColor,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather name="clock" size={24} color={buttonColor} />
          </Pressable>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.emojiRow}>
            <Text style={styles.emoji}>🍾</Text>
          </View>
          <Text style={[styles.title, { color: tintColor }]}>
            Decision Derby
          </Text>
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
            Let the bottle decide your fate!
          </Text>
          <View style={styles.stepsRow}>
            {SPIN_STEPS.map((step) => (
              <View key={step.label} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepIconContainer,
                    { backgroundColor: backgroundSecondaryColor },
                  ]}
                >
                  <Text style={styles.stepEmoji}>{step.emoji}</Text>
                </View>
                <Text style={[styles.stepLabel, { color: textSecondaryColor }]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.startButtonWrapper}>
          <Button
            onPress={() =>
              router.push({
                pathname: "/create",
                params: { variant: "bottle", transition: "spin" },
              })
            }
            disabled={false}
            title="Spin the Bottle"
            style={[styles.startButton]}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  emojiRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  emoji: {
    fontSize: 72,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: "500",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    gap: 12,
    width: "100%",
  },
  stepItem: {
    alignItems: "center",
    width: 100,
  },
  stepIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  stepEmoji: {
    fontSize: 32,
  },
  stepLabel: {
    fontSize: 13,
    textAlign: "center",
  },
  startButtonWrapper: {
    width: "100%",
    marginTop: 24,
  },
  startButton: {
    borderRadius: 12,
    paddingVertical: 18,
    width: "100%",
  },
});
