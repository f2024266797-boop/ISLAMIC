import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export default function HabitCard({ habit, onToggle, onLongPress }) {
  const isCompleted = habit.completedDays && habit.completedDays[new Date().toISOString().split('T')[0]];

  return (
    <TouchableOpacity 
      style={[styles.container, isCompleted && styles.completed]} 
      onPress={() => onToggle(habit.id)}
      onLongPress={() => onLongPress(habit)}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <View style={[styles.indicator, isCompleted && styles.indicatorActive]} />
        <View>
          <Text style={[styles.title, isCompleted && styles.textDim]}>{(habit?.title || '').toUpperCase()}</Text>
          <Text style={styles.micro}>{habit.frequency || 'DAILY'}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <View style={styles.streakBox}>
          <Text style={styles.streakVal}>{habit.streak || 0}</Text>
          <Ionicons name="flash" size={8} color={habit.streak > 0 ? THEME.emerald : '#333'} />
        </View>
        <View style={[styles.checkbox, isCompleted && styles.checkboxActive]}>
          {isCompleted && <Ionicons name="checkmark" size={14} color="#000" />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: THEME.bgCard, paddingHorizontal: 16, paddingVertical: 18,
    borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#111'
  },
  completed: { opacity: 0.6, borderColor: 'transparent' },
  left: { flexDirection: 'row', alignItems: 'center' },
  indicator: { width: 2, height: 12, backgroundColor: '#333', marginRight: 16, borderRadius: 1 },
  indicatorActive: { backgroundColor: THEME.emerald },
  
  title: { color: THEME.white, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  textDim: { color: '#666' },
  micro: { color: '#444', fontSize: 7, fontWeight: '900', letterSpacing: 1.5, marginTop: 2 },
  
  right: { flexDirection: 'row', alignItems: 'center' },
  streakBox: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  streakVal: { color: '#444', fontSize: 9, fontWeight: '900', marginRight: 2 },
  
  checkbox: { 
    width: 24, height: 24, borderRadius: 4, 
    borderWidth: 1, borderColor: '#222', 
    alignItems: 'center', justifyContent: 'center' 
  },
  checkboxActive: { backgroundColor: THEME.emerald, borderColor: THEME.emerald },
});
