import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import useJournalStore from '../store/useJournalStore';
import useAzkarStore from '../store/useAzkarStore';
import useSunnahStore from '../store/useSunnahStore';
import { format, isSameDay, subDays } from 'date-fns';

export default function ProgressScreen() {
  const { tasks, dailyZikr, dailyZikrDetails, history } = useJournalStore();
  const { dailySunnahs, isLoaded: isSunnahLoaded, loadSunnahs } = useSunnahStore();
  const [activeDate, setActiveDate] = useState(new Date().toDateString());
  const [showZikrDetail, setShowZikrDetail] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  useEffect(() => {
    if (!isSunnahLoaded) loadSunnahs();
  }, []);

  const isToday = isSameDay(new Date(activeDate), new Date());
  
  // Get data for active date
  const activeData = isToday 
    ? { tasks, zikr: dailyZikr, zikrDetails: dailyZikrDetails }
    : (history[activeDate] || { tasks: [], zikr: 0, zikrDetails: {} });

  // FIXED: Re-adding missing variables
  const completedTasks = activeData.tasks ? activeData.tasks.filter(t => t.completed) : [];
  const totalTasks = activeData.tasks ? activeData.tasks.length : 0;

  // Generate last 7 days for the report
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i).toDateString());

  const azkarHistory = useAzkarStore(s => s.history);
  const activeDateISO = format(new Date(activeDate), 'yyyy-MM-dd');
  
  const activeAzkarStatus = azkarHistory[activeDateISO];
  const isAzkarRead = !!(activeAzkarStatus && (activeAzkarStatus.morning || activeAzkarStatus.evening));

  const sunnahCount = Object.values(dailySunnahs[activeDateISO] || {}).filter(v => v).length;

  const renderDetailModal = (visible, setVisible, title, content) => (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {content}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const zikrContent = Object.keys(activeData.zikrDetails || {}).filter(k => k !== 'General Dhikr').length > 0 ? (
    Object.entries(activeData.zikrDetails)
      .filter(([name]) => name !== 'General Dhikr')
      .map(([name, count]) => (
        <View key={name} style={styles.detailRow}>
          <Text style={styles.detailName}>{name}</Text>
          <Text style={styles.detailCount}>{count}</Text>
        </View>
      ))
  ) : <Text style={styles.noDataText}>No Zikr recorded for this day.</Text>;

  const taskContent = completedTasks.length > 0 ? (
    completedTasks.map(t => (
      <View key={t.id} style={styles.detailRow}>
        <Ionicons 
          name="checkmark-circle" 
          size={18} 
          color={THEME.emerald} 
          style={{marginRight: 10}}
        />
        <Text style={styles.detailName}>{t.title}</Text>
      </View>
    ))
  ) : <Text style={styles.noDataText}>No tasks completed for this day.</Text>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <Text style={styles.micro}>DAILY REPORT</Text>
        <Text style={styles.title}>{isToday ? "Today" : format(new Date(activeDate), 'MMM dd')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={styles.statCard} 
            onPress={() => setShowZikrDetail(true)}
            activeOpacity={0.7}
          >
            <View style={styles.statIconBox}>
              <Ionicons name="finger-print" size={24} color={THEME.gold} />
            </View>
            <Text style={styles.statLabel}>Zikr Logged</Text>
            <Text style={styles.tapHint}>Tap for details</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard} 
            onPress={() => setShowTaskDetail(true)}
            activeOpacity={0.7}
          >
            <View style={styles.statIconBox}>
              <Ionicons name="checkbox" size={24} color={THEME.emerald} />
            </View>
            <Text style={styles.statLabel}>Tasks Logged</Text>
            <Text style={styles.tapHint}>Tap for details</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Azkar & Sunnah Status */}
        <View style={styles.statsRow}>
          <View style={styles.azkarStatusCard}>
            <View style={styles.azkarStatusHeader}>
              <Ionicons name="book-outline" size={20} color={THEME.gold} />
              <Text style={styles.azkarStatusTitle}>Azkar</Text>
            </View>
            <Text style={[styles.azkarStatusText, isAzkarRead && styles.azkarStatusTextSuccess]}>
              {isAzkarRead ? "Completed ✨" : "Pending"}
            </Text>
          </View>

          <View style={styles.azkarStatusCard}>
            <View style={styles.azkarStatusHeader}>
              <Ionicons name="leaf-outline" size={20} color={THEME.gold} />
              <Text style={styles.azkarStatusTitle}>Sunnah</Text>
            </View>
            <Text style={[styles.azkarStatusText, sunnahCount > 0 && styles.azkarStatusTextSuccess]}>
              {sunnahCount > 0 ? `${sunnahCount} Revived` : "None yet"}
            </Text>
          </View>
        </View>

        {/* Weekly Progress Chart */}
        <Text style={styles.sectionLabel}>WEEKLY ACTIVITY</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartRow}>
            {last7Days.slice().reverse().map((dateStr) => {
              const iso = format(new Date(dateStr), 'yyyy-MM-dd');
              const dayData = history[dateStr] || (isSameDay(new Date(dateStr), new Date()) ? { zikr: dailyZikr } : { zikr: 0 });
              const zCount = dayData.zikr || 0;
              
              // Scale the bar (max 1000 for visual normalization)
              const barHeight = Math.min((zCount / 500) * 80, 80); 
              
              return (
                <View key={dateStr} style={styles.chartBarColumn}>
                  <View style={styles.chartBarBackground}>
                    <View style={[styles.chartBarFill, { height: Math.max(barHeight, 4) }]} />
                  </View>
                  <Text style={styles.chartDayLabel}>{format(new Date(dateStr), 'EE')[0]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* History List */}
        <Text style={styles.sectionLabel}>LAST 7 DAYS HISTORY</Text>
        <View style={styles.historyList}>
          {last7Days.map((dateStr) => {
            const hasActivity = history[dateStr] || isSameDay(new Date(dateStr), new Date());
            const iso = format(new Date(dateStr), 'yyyy-MM-dd');
            const sCount = Object.values(dailySunnahs[iso] || {}).filter(v => v).length;

            return (
              <TouchableOpacity 
                key={dateStr} 
                style={[styles.dateItem, activeDate === dateStr && styles.activeDateItem]}
                onPress={() => setActiveDate(dateStr)}
              >
                <View>
                  <Text style={[styles.dateText, activeDate === dateStr && styles.activeDateText]}>
                    {isSameDay(new Date(dateStr), new Date()) ? "Today" : format(new Date(dateStr), 'EEEE, MMM dd')}
                  </Text>
                  <Text style={styles.dateSub}>
                    {sCount > 0 ? `${sCount} Sunnahs ` : ''}{hasActivity ? 'Activity logged' : 'No record'}
                  </Text>
                </View>
                {activeDate === dateStr ? (
                  <Ionicons name="eye" size={18} color={THEME.gold} />
                ) : hasActivity ? (
                  <Ionicons name="checkmark-circle" size={18} color={THEME.gold + '40'} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Manual Reset Option */}
        {isToday && (
          <View style={styles.resetContainer}>
            <TouchableOpacity 
              style={styles.resetBtn} 
              onPress={() => {
                Alert.alert(
                  "Reset Progress",
                  "Are you sure you want to reset today's Zikr and Tasks?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Reset", style: "destructive", onPress: () => {
                      const { resetToday } = useJournalStore.getState();
                      resetToday();
                    }}
                  ]
                );
              }}
            >
              <Ionicons name="refresh-outline" size={16} color="#FF3B30" />
              <Text style={styles.resetText}>Reset Today's Progress</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {renderDetailModal(showZikrDetail, setShowZikrDetail, "Zikr Details", zikrContent)}
      {renderDetailModal(showTaskDetail, setShowTaskDetail, "Task Details", taskContent)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 24, paddingVertical: 20 },
  micro: { color: THEME.gold, fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  title: { color: '#000', fontSize: 32, fontWeight: '900', letterSpacing: -1, marginTop: 4 },

  scrollContent: { paddingHorizontal: 20 },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#EEE', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  statIconBox: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statVal: { fontSize: 20, fontWeight: '900', color: '#000' },
  statLabel: { fontSize: 11, color: '#888', fontWeight: '600', marginTop: 2 },
  tapHint: { fontSize: 8, color: THEME.gold, fontWeight: '700', marginTop: 6, textTransform: 'uppercase' },

  azkarStatusContainer: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#EEE', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  azkarStatusCard: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#EEE', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  azkarStatusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  azkarStatusTitle: { fontSize: 13, fontWeight: '800', color: '#000', marginLeft: 8 },
  azkarStatusText: { fontSize: 13, color: '#888', fontWeight: '600' },
  azkarStatusTextSuccess: { color: THEME.emerald },

  sectionLabel: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: -0.5, marginBottom: 16, marginLeft: 4 },
  historyList: { gap: 10 },
  dateItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#EEE' },
  activeDateItem: { borderColor: THEME.gold, backgroundColor: 'rgba(212, 175, 55, 0.05)' },
  dateText: { color: '#000', fontSize: 15, fontWeight: 'bold' },
  activeDateText: { color: THEME.gold },
  dateSub: { color: '#AAA', fontSize: 11, marginTop: 2, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#000' },
  modalScroll: { flexGrow: 0 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  detailName: { fontSize: 14, color: '#333', fontWeight: '600', flex: 1 },
  detailCount: { fontSize: 16, fontWeight: '900', color: THEME.gold },
  taskDone: { color: '#AAA', textDecorationLine: 'line-through' },
  noDataText: { textAlign: 'center', color: '#AAA', paddingVertical: 20, fontStyle: 'italic' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FFE5E5', justifyContent: 'center' },
  resetText: { color: '#FF3B30', fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  resetContainer: { marginTop: 32, paddingHorizontal: 4 },
  
  chartContainer: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#EEE' },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  chartBarColumn: { alignItems: 'center', flex: 1 },
  chartBarBackground: { width: 12, height: 80, backgroundColor: '#F8F9FA', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBarFill: { width: '100%', backgroundColor: THEME.gold, borderRadius: 6 },
  chartDayLabel: { fontSize: 10, fontWeight: '800', color: '#AAA', marginTop: 8 },
});
