import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export function DevnexesBranding() {
  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      <View style={styles.center}>
        <Ionicons name="code-slash" size={12} color={THEME.gold} style={{ marginRight: 5 }} />
        <Text style={styles.text}>Made with care by </Text>
        <Text style={styles.brand}>Devnexes</Text>
      </View>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:   { flexDirection: 'row', alignItems: 'center', marginVertical: 20, paddingHorizontal: 20 },
  line:   { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: THEME.border },
  center: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 },
  text:   { color: THEME.grayDim, fontSize: 11 },
  brand:  { color: THEME.gold, fontWeight: '700', fontSize: 11 },
});
