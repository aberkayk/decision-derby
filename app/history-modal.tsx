import { SafeAreaView, Text, View, useThemeColor } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

export interface DecisionOption {
  id: string;
  text: string;
  color: string;
  emoji: string;
}

export interface HistoryItem {
  id: string;
  question: string;
  winner: DecisionOption;
  timestamp: number;
}

export default function HistoryModal() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const backgroundSecondary = useThemeColor({}, "backgroundSecondary");
  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");
  const accentColor = useThemeColor({}, "tint");

  const history: HistoryItem[] = useMemo(() => [], []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 60) {
      return diffInMins === 0 ? "Just now" : `${diffInMins}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.container}>
        <View
          style={[
            styles.header,
            { backgroundColor: backgroundSecondary, borderColor },
          ]}
        >
          <Pressable
            accessibilityLabel="Close history"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: backgroundSecondary,
                borderColor,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather name="arrow-left" size={22} color={textColor} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            Race History
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={[styles.emptyTitle, { color: textSecondary }]}>
                No races yet
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: textSecondary }]}
                numberOfLines={2}
              >
                Your decision history will appear here after you complete your
                first race.
              </Text>
            </View>
          ) : (
            history
              .slice()
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: backgroundSecondary,
                      borderColor,
                      shadowColor: item.winner.color,
                    },
                  ]}
                >
                  <View style={styles.cardRow}>
                    <View
                      style={[
                        styles.avatar,
                        {
                          backgroundColor: item.winner.color,
                          shadowColor: item.winner.color,
                        },
                      ]}
                    >
                      <Text
                        lightColor="#ffffff"
                        darkColor="#ffffff"
                        style={styles.avatarEmoji}
                      >
                        {item.winner.emoji || "🏇"}
                      </Text>
                    </View>
                    <View style={styles.cardContent}>
                      <View style={styles.cardTitleRow}>
                        <Feather name="award" size={14} color={accentColor} />
                        <Text
                          style={[styles.winnerText, { color: textColor }]}
                          numberOfLines={1}
                        >
                          {item.winner.text}
                        </Text>
                      </View>
                      <Text
                        style={[styles.questionText, { color: textSecondary }]}
                        numberOfLines={2}
                      >
                        {item.question}
                      </Text>
                      <View style={styles.metaRow}>
                        <Feather
                          name="calendar"
                          size={12}
                          color={textSecondary}
                        />
                        <Text
                          style={[styles.metaText, { color: textSecondary }]}
                        >
                          {formatDate(item.timestamp)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 44,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    maxWidth: 240,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  cardContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  winnerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  questionText: {
    fontSize: 13,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
});
