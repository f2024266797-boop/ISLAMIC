import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export default function AppLogo({ size = 40, showText = true, color = THEME.gold }) {
  return (
    <View style={styles.container}>
      <View style={[styles.logoCircle, { width: size, height: size, borderRadius: size / 2.5, borderColor: color }]}>
        <MaterialCommunityIcons name="moon-waning-crescent" size={size * 0.6} color={color} style={styles.icon} />
        <View style={[styles.star, { top: size * 0.2, right: size * 0.2 }]}>
          <MaterialCommunityIcons name="star-four-points" size={size * 0.25} color={color} />
        </View>
      </View>
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.brandText, { color: '#000' }]}>ISLAMIC</Text>
          <Text style={[styles.subText, { color: color }]}>HABIT TRACKER</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  icon: {
    transform: [{ rotate: '-15deg' }],
  },
  star: {
    position: 'absolute',
  },
  textContainer: {
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 18,
  },
  subText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 3,
    marginTop: 2,
  },
});
