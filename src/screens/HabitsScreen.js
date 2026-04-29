import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import useHabitStore from '../store/useHabitStore';
import HabitCard from '../components/HabitCard';

export default function HabitsScreen({ navigation }) {
  const { habits, toggleHabit, deleteHabit } = useHabitStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.micro}>CORE PROTOCOL</Text>
          <Text style={styles.title}>HABITS</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color={THEME.bg} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard 
            habit={item} 
            onToggle={toggleHabit} 
            onLongPress={(h) => deleteHabit(h.id)} 
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>NO ACTIVE PROTOCOLS</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 32
  },
  micro: { color: THEME.emerald, fontSize: 8, fontWeight: '900', letterSpacing: 3 },
  title: { color: THEME.white, fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  addBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: THEME.emerald, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#222', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
});
