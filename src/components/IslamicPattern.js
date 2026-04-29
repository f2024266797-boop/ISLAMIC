import React from 'react';
import { View, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

/**
 * IslamicPattern — Pure React Native geometric background.
 * Renders a grid of rotated diamonds + corner rings. No SVG / no emoji.
 */
export function IslamicPattern({ style, opacity = 0.055 }) {
  const rows = 7, cols = 7;
  const size = 12;
  const gap = 52;

  const diamonds = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offset = c % 2 === 0 ? 0 : gap / 2;
      diamonds.push(
        <View
          key={`d-${r}-${c}`}
          style={{
            position: 'absolute',
            top:  r * gap + offset - 6,
            left: c * gap - 6,
            width: size,
            height: size,
            backgroundColor: THEME.gold,
            opacity,
            transform: [{ rotate: '45deg' }],
            borderRadius: 1,
          }}
        />,
      );
    }
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.wrap, style]} pointerEvents="none">
      {diamonds}
      <View style={[styles.ring, { top: -50, right: -50, opacity: opacity * 1.2 }]} />
      <View style={[styles.ring, { bottom: -50, left: -50, opacity: opacity * 1.2 }]} />
      <View style={[styles.ringSmall, { top: 30, left: 30, opacity: opacity * 0.8 }]} />
    </View>
  );
}

/**
 * Gold ornamental divider — line · diamond · line
 */
export function GoldDivider({ style }) {
  return (
    <View style={[styles.divider, style]}>
      <View style={styles.divLine} />
      <View style={styles.divDiamond} />
      <View style={styles.divLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  ring: {
    position: 'absolute',
    width: 150, height: 150, borderRadius: 75,
    borderWidth: 1, borderColor: THEME.gold,
  },
  ringSmall: {
    position: 'absolute',
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 1, borderColor: THEME.gold,
  },
  divider: { flexDirection: 'row', alignItems: 'center' },
  divLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: THEME.borderGold },
  divDiamond: {
    width: 7, height: 7, backgroundColor: THEME.gold,
    transform: [{ rotate: '45deg' }], marginHorizontal: 10,
  },
});
