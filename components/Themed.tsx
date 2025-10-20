/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import Colors from "@/constants/Colors";
import React, { Fragment } from "react";
import {
  ActivityIndicator,
  Button as DefaultButton,
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView as DefaultSafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  style?: any;
  isLoading?: boolean;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ButtonProps = ThemeProps & DefaultButton["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type SafeAreaViewProps = ThemeProps &
  React.ComponentProps<typeof DefaultSafeAreaView>;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const buttonColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "button"
  );

  return (
    <DefaultTextInput
      style={[
        { color, backgroundColor: buttonColor, borderColor: buttonColor },
        styles.input,
        style,
      ]}
      {...otherProps}
    />
  );
}

export function Button(props: ButtonProps) {
  const {
    onPress,
    title = "Kaydet",
    style,
    lightColor,
    darkColor,
    isLoading,
    ...otherProps
  } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "button"
  );
  return (
    <Pressable
      style={[{ backgroundColor }, styles.button, style]}
      onPress={onPress}
      {...otherProps}
    >
      {({ pressed }) => (
        <Fragment>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={[styles.text, { opacity: pressed ? 0.7 : 1 }]}>
              {title}
            </Text>
          )}
        </Fragment>
      )}
    </Pressable>
  );
}

export function SafeAreaView(props: SafeAreaViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultSafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 500,
    letterSpacing: 0.25,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
