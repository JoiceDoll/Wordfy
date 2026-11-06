import React, { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSafeAreaProps = {
  children?: ReactNode;
  /** Extra space above the system home indicator / nav bar. */
  extraPadding?: number;
  /** Floor used when the inset reports 0 (common on some modal presentations). */
  minInset?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Reserves bottom space so footers/CTAs never sit under the device nav bar.
 */
export function BottomSafeArea({
  children,
  extraPadding = 12,
  minInset = 16,
  style,
}: BottomSafeAreaProps) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, minInset) + extraPadding;

  return (
    <View style={[styles.base, { paddingBottom: bottom }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
});
