import { StyleSheet, Text } from "react-native";
import React from "react";
import theme from "../theme/theme";

const styles = StyleSheet.create({
  text: {
    fontSize: theme.fontSize.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeight.normal,
  },
  smaller: {
    fontSize: theme.fontSize.smaller,
  },
  small: {
    fontSize: theme.fontSize.small,
  },
  title: {
    fontSize: theme.fontSize.title,
  },
  subtitle: {
    fontSize: theme.fontSize.subtitle,
  },
  heading: {
    fontSize: theme.fontSize.heading,
  },
  subheading: {
    fontSize: theme.fontSize.subheading,
  },
  bold: {
    fontWeight: theme.fontWeight.bold,
  },
  normal: {
    fontWeight: theme.fontWeight.normal,
  },
  softbold: {
    fontWeight: theme.fontWeight.softbold,
  },
  light: {
    fontWeight: theme.fontWeight.light,
    color: theme.colors.lightgray,
  },
  bolder: {
    fontWeight: theme.fontWeight.bolder,
  },
  center: {
    textAlign: "center",
  },
  modernaPrimary: {
    color: theme.colors.modernaRed,
  },
  modernaSecondary: {
    color: theme.colors.modernaYellow,
  },
});
const StyledText = ({
  children,
  color,
  light,
  softbold,
  small,
  smaller,
  title,
  subtitle,
  heading,
  subheading,
  bold,
  bolder,
  center,
  modernaPrimary,
  modernaSecondary,
  style,
  ...restOfProps
}) => {
  const textStyle = [
    styles.text,
    heading && styles.heading,
    subheading && styles.subheading,
    title && styles.title,
    small && styles.small,
    subtitle && styles.subtitle,
    softbold && styles.softbold,
    bold && styles.bold,
    light && styles.light,
    bolder && styles.bolder,
    center && styles.center,
    modernaPrimary && styles.modernaPrimary,
    modernaSecondary && styles.modernaSecondary,
    smaller && styles.smaller,
    color && { color: color },
    style,
  ];
  return (
    <Text style={textStyle} {...restOfProps}>
      {children}
    </Text>
  );
};

export default StyledText;
