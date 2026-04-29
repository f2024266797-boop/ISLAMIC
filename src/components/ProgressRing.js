import React from 'react';
import { View, Text, Platform } from 'react-native';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

/**
 * Circular progress ring with configurable appearance.
 * Uses border trick for smooth rendering — no SVG required.
 */
export function ProgressRing({
  progress = 0,
  size = 72,
  strokeWidth = 5,
  color = THEME.gold,
  label,
}) {
  const p = Math.min(Math.max(progress, 0), 1);
  const pct = Math.round(p * 100);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Track ring */}
      <View style={{
        position: 'absolute',
        width: size, height: size, borderRadius: size / 2,
        borderWidth: strokeWidth, borderColor: THEME.border,
      }} />

      {/* Progress arc (quadrant trick) */}
      <View style={{
        position: 'absolute',
        width: size, height: size, borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderTopColor:    p > 0.04 ? color : 'transparent',
        borderRightColor:  p > 0.29 ? color : 'transparent',
        borderBottomColor: p > 0.54 ? color : 'transparent',
        borderLeftColor:   p > 0.79 ? color : 'transparent',
        transform: [{ rotate: '-90deg' }],
      }} />

      {/* Center content */}
      <View style={{ alignItems: 'center' }}>
        {p >= 1 ? (
          <Ionicons name="checkmark-circle" size={size * 0.38} color={THEME.greenBright} />
        ) : (
          <>
            <Text style={{ color, fontSize: size * 0.23, fontWeight: '800', lineHeight: size * 0.27 }}>
              {pct}
            </Text>
            <Text style={{ color: THEME.gray, fontSize: size * 0.12, fontWeight: '700' }}>%</Text>
          </>
        )}
        {label ? (
          <Text style={{ color: THEME.gray, fontSize: size * 0.11, marginTop: 2 }} numberOfLines={1}>
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
