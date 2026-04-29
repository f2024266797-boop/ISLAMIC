import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import useSunnahStore from '../store/useSunnahStore';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

const SUNNAH_DATA = [
  { id: '1', category: 'Morning', title: 'Waking up', description: 'Rubbing the face with hands to remove sleep.', icon: 'sunny-outline' },
  { id: '2', category: 'Morning', title: 'Morning Dua', description: 'Reciting the dua for waking up.', icon: 'chatbubble-outline' },
  { id: '3', category: 'Food', title: 'Using Right Hand', description: 'Eating and drinking with the right hand.', icon: 'hand-right-outline' },
  { id: '4', category: 'Food', title: 'Sitting Down', description: 'Sitting down while drinking water.', icon: 'body-outline' },
  { id: '5', category: 'Social', title: 'Salam First', description: 'Being the first to say Assalam-u-Alaikum.', icon: 'people-outline' },
  { id: '6', category: 'Social', title: 'Smiling', description: 'Smiling at others as it is a form of charity.', icon: 'happy-outline' },
  { id: '7', category: 'Mosque', title: 'Right Foot First', description: 'Entering the Masjid with the right foot.', icon: 'walk-outline' },
  { id: '8', category: 'Sleeping', title: 'Wudu before Sleep', description: 'Performing Wudu before going to bed.', icon: 'water-outline' },
  { id: '9', category: 'Sleeping', title: 'Right Side', description: 'Sleeping on the right side.', icon: 'bed-outline' },
  { id: '10', category: 'General', title: 'Miswak', description: 'Using Miswak for oral hygiene.', icon: 'sparkles-outline' },
];

function SunnahCard({ item, isDone, onToggle }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onToggle(item.id);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.card, isDone && styles.cardDone]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconBox, isDone && styles.iconBoxDone]}>
          <Ionicons name={item.icon} size={22} color={isDone ? '#FFF' : THEME.gold} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.category, isDone && styles.textDone]}>{item.category.toUpperCase()}</Text>
          <Text style={[styles.title, isDone && styles.textDone]}>{item.title}</Text>
          <Text style={[styles.desc, isDone && styles.textDone]} numberOfLines={2}>{item.description}</Text>
        </View>
        <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
          {isDone && <Ionicons name="checkmark" size={16} color="#FFF" />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function DailySunnahsScreen() {
  const { dailySunnahs, toggleSunnah, loadSunnahs, isLoaded } = useSunnahStore();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoaded) loadSunnahs();
  }, []);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayData = dailySunnahs[today] || {};
  const completedCount = Object.values(todayData).filter(val => val).length;
  const progress = completedCount / SUNNAH_DATA.length;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const handleToggle = (id) => {
    toggleSunnah(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Revive Sunnah</Text>
            <Text style={styles.headerSub}>DAILY CHECKLIST</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{completedCount}/{SUNNAH_DATA.length}</Text>
          </View>
        </View>

        {/* Animated Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            })
          }]} />
        </View>
      </View>

      <FlatList
        data={SUNNAH_DATA}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SunnahCard
            item={item}
            isDone={todayData[item.id]}
            onToggle={handleToggle}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -1 },
  headerSub: { fontSize: 10, color: THEME.gold, fontWeight: '800', letterSpacing: 2, marginTop: 4 },

  statBox: { backgroundColor: THEME.gold + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statNum: { color: THEME.gold, fontWeight: '900', fontSize: 14 },

  progressContainer: { height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: THEME.gold },

  list: { padding: 24, paddingTop: 0 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardDone: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EEEEEE',
    opacity: 0.7
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  iconBoxDone: {
    backgroundColor: THEME.gold,
    borderColor: THEME.gold,
  },
  content: { flex: 1, marginLeft: 16 },
  category: { fontSize: 8, fontWeight: '900', color: THEME.gold, letterSpacing: 1.5, marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '800', color: '#000', marginBottom: 2 },
  desc: { fontSize: 11, color: '#999', lineHeight: 16 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: THEME.gold,
    borderColor: THEME.gold,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: '#CCC'
  }
});
