import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Horse Race",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="horse-human"
              size={22}
              style={{ marginBottom: -3 }}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="bottle"
        options={{
          title: "Spin The Bottle",
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name="wine-bottle"
              size={22}
              style={{ marginBottom: -3 }}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
