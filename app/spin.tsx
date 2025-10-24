import { DecisionOption } from "@/components/BottleCreate";
import { Text, View, useThemeColor } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const CIRCLE_RADIUS = width * 0.35;
const BOTTLE_SIZE = 80;

export default function SpinTheBottleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ options: string }>();
  const options: DecisionOption[] = useMemo(
    () => (params.options ? JSON.parse(params.options) : []),
    [params.options]
  );

  const rotation = useSharedValue(0);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(true);

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    if (options.length === 0) return;

    const spinTimeout = setTimeout(() => {
      const winner = Math.floor(Math.random() * options.length);
      setWinnerIndex(winner);

      const segmentAngle = 360 / options.length;
      const winnerAngle = winner * segmentAngle;

      // Add extra rotations for visual effect
      const randomExtraRotations = 5 + Math.floor(Math.random() * 5);
      const finalAngle =
        randomExtraRotations * 360 + (360 - winnerAngle) - segmentAngle / 2;

      rotation.value = withTiming(
        finalAngle,
        {
          duration: 4000,
          easing: Easing.out(Easing.cubic),
        },
        () => {
          runOnJS(setIsSpinning)(false);
        }
      );
    }, 2000); // Start spinning after 2 seconds

    return () => clearTimeout(spinTimeout);
  }, [options, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const getOptionPosition = (index: number) => {
    const angle = (index / options.length) * 2 * Math.PI;
    const x = CIRCLE_RADIUS * Math.cos(angle);
    const y = CIRCLE_RADIUS * Math.sin(angle);
    return { transform: [{ translateX: x }, { translateY: y }] };
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Pressable
        onPress={() => router.back()}
        style={styles.closeButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather name="x" size={28} color={textColor} />
      </Pressable>

      <View style={styles.circleContainer}>
        {options.map((option, index) => (
          <View
            key={option.id}
            style={[
              styles.optionWrapper,
              getOptionPosition(index),
              {
                opacity:
                  winnerIndex !== null && winnerIndex !== index ? 0.4 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.optionBadge,
                {
                  backgroundColor: option.color,
                  borderColor:
                    winnerIndex === index ? "#FFD700" : "transparent",
                },
              ]}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
            </View>
            <Text
              style={[
                styles.optionText,
                {
                  color: textColor,
                  fontWeight: winnerIndex === index ? "bold" : "normal",
                },
              ]}
              numberOfLines={2}
            >
              {option.text}
            </Text>
          </View>
        ))}

        <Animated.View style={[styles.bottle, animatedStyle]}>
          <Text style={styles.bottleEmoji}>🍾</Text>
        </Animated.View>
      </View>

      {!isSpinning && winnerIndex !== null && (
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerText}>
            Winner: {options[winnerIndex].text}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
  },
  circleContainer: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bottle: {
    width: BOTTLE_SIZE,
    height: BOTTLE_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  bottleEmoji: {
    fontSize: BOTTLE_SIZE * 0.8,
    transform: [{ rotate: "90deg" }], // Point upwards initially
  },
  optionWrapper: {
    position: "absolute",
    alignItems: "center",
    width: 90,
  },
  optionBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 3,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionText: {
    fontSize: 12,
    textAlign: "center",
  },
  winnerContainer: {
    position: "absolute",
    bottom: height * 0.1,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  winnerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
