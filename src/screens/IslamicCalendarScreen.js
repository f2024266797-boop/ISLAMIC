import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  FlatList, Animated, Platform, StatusBar, ImageBackground 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { IslamicPattern } from '../components/IslamicPattern';

const IMPORTANT_DAYS = [
  { id: '1', date: '1 Ramadan', title: 'Start of Ramadan', detail: 'The blessed month of fasting, prayer, and reflection.', icon: 'moon-waning-crescent' },
  { id: '2', date: '27 Ramadan', title: 'Laylat al-Qadr', detail: 'The Night of Power, better than a thousand months.', icon: 'star-shooting' },
  { id: '3', date: '1 Shawwal', title: 'Eid al-Fitr', detail: 'The festival of breaking the fast at the end of Ramadan.', icon: 'madi-crescent' },
  { id: '4', date: '10 Dhul-Hijjah', title: 'Eid al-Adha', detail: 'The Feast of Sacrifice honoring Prophet Ibrahim (AS).', icon: 'mosque' },
  { id: '5', date: '1 Muharram', title: 'Islamic New Year', detail: 'Marking the beginning of the new Hijri year.', icon: 'calendar-sync' },
  { id: '6', date: '10 Muharram', title: 'Day of Ashura', detail: 'A day of great historical and spiritual significance.', icon: 'water-percent' },
  { id: '7', date: '12 Rabi al-Awwal', title: 'Mawlid an-Nabi', detail: 'Commemorating the birth of Prophet Muhammad ﷺ.', icon: 'heart-outline' },
];

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi I", "Rabi II", "Jumada I", "Jumada II", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Q", "Dhu al-H"
];

export default function IslamicCalendarScreen() {
  const [selectedDay, setSelectedDay] = useState(IMPORTANT_DAYS[0]);
  const [selectedMonth, setSelectedMonth] = useState(8); // Ramadan by default
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleDayPress = (day) => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 5, useNativeDriver: true }),
      ])
    ]).start();
    setSelectedDay(day);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <IslamicPattern opacity={0.02} />

      <View style={styles.header}>
        <View>
          <Text style={styles.microHeader}>HIJRI 1445-1446</Text>
          <Text style={styles.title}>Sacred Calendar</Text>
        </View>
        <TouchableOpacity style={styles.todayBtn}>
          <Text style={styles.todayText}>TODAY</Text>
        </TouchableOpacity>
      </View>

      {/* MONTH PICKER CAROUSEL */}
      <View style={styles.monthSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthScroll}>
          {HIJRI_MONTHS.map((month, index) => (
            <TouchableOpacity 
              key={month} 
              onPress={() => setSelectedMonth(index)}
              style={[styles.monthChip, selectedMonth === index && styles.activeMonthChip]}
            >
              <Text style={[styles.monthText, selectedMonth === index && styles.activeMonthText]}>{month}</Text>
              {selectedMonth === index && <View style={styles.monthDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.main}>
        {/* EVENT CARDS */}
        <FlatList
          data={IMPORTANT_DAYS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => {
            const isSelected = selectedDay.id === item.id;
            return (
              <TouchableOpacity 
                onPress={() => handleDayPress(item)}
                style={[styles.eventCard, isSelected && styles.selectedEventCard]}
                activeOpacity={0.9}
              >
                <View style={[styles.iconFrame, isSelected && { backgroundColor: THEME.gold }]}>
                  <MaterialCommunityIcons 
                    name={item.icon || 'star'} 
                    size={20} 
                    color={isSelected ? '#000' : THEME.gold} 
                  />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventDate, isSelected && { color: THEME.gold }]}>{item.date.toUpperCase()}</Text>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={isSelected ? THEME.gold : "#EEE"} />
              </TouchableOpacity>
            );
          }}
        />

        {/* PREMIUM DETAIL BOX */}
        <Animated.View style={[
          styles.detailCard, 
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <View style={styles.detailOverlay}>
            <View style={styles.detailHeader}>
              <View style={styles.detailIconBg}>
                <MaterialCommunityIcons name={selectedDay.icon} size={24} color={THEME.gold} />
              </View>
              <View>
                <Text style={styles.detailDate}>{selectedDay.date}</Text>
                <Text style={styles.detailTitleText}>{selectedDay.title}</Text>
              </View>
            </View>
            <Text style={styles.detailDesc}>{selectedDay.detail}</Text>
            
            <TouchableOpacity style={styles.reminderBtn}>
              <Ionicons name="notifications-outline" size={16} color="#FFF" />
              <Text style={styles.reminderText}>NOTIFY ME</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20 },
  microHeader: { color: THEME.gold, fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#000', fontSize: 26, fontWeight: '900', letterSpacing: -1 },
  todayBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#F0F0F0' },
  todayText: { fontSize: 9, fontWeight: '900', color: '#888', letterSpacing: 1 },

  monthSection: { marginBottom: 10 },
  monthScroll: { paddingHorizontal: 20, paddingBottom: 15 },
  monthChip: { paddingHorizontal: 18, paddingVertical: 10, marginRight: 10, alignItems: 'center' },
  activeMonthChip: { backgroundColor: '#FFF' },
  monthText: { fontSize: 13, fontWeight: '700', color: '#BBB' },
  activeMonthText: { color: '#000', fontWeight: '900' },
  monthDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: THEME.gold, marginTop: 4 },

  main: { flex: 1, paddingHorizontal: 24 },
  listPadding: { paddingBottom: 20 },
  eventCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F8F9FA'
  },
  selectedEventCard: {
    borderColor: THEME.gold + '30',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3
  },
  iconFrame: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  eventInfo: { flex: 1 },
  eventDate: { fontSize: 9, fontWeight: '900', color: '#AAA', letterSpacing: 1 },
  eventTitle: { fontSize: 15, fontWeight: '800', color: '#333', marginTop: 2 },

  detailCard: { 
    backgroundColor: '#000', 
    borderRadius: 30, 
    overflow: 'hidden',
    marginTop: 'auto',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10
  },
  detailOverlay: { padding: 30 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  detailIconBg: { width: 50, height: 50, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  detailDate: { color: THEME.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  detailTitleText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  detailDesc: { color: '#AAA', fontSize: 14, lineHeight: 22, fontWeight: '500' },
  
  reminderBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 24
  },
  reminderText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginLeft: 8 }
});
