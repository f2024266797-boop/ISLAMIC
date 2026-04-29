import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, TextInput, Platform, StatusBar, Share, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useHabitStore from '../store/useHabitStore';
import useAuthStore from '../store/useAuthStore';
import useJournalStore from '../store/useJournalStore';
import { THEME } from '../constants/theme';
import { DAILY_AYAT } from '../constants/islamicContent';

function StatCard({ label, value, icon, color }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
      </View>
    </View>
  );
}

function MiniStat({ label, value, icon }) {
  return (
    <View style={styles.miniStat}>
      <Ionicons name={icon} size={14} color={THEME.gold} />
      <Text style={styles.miniStatVal}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { totalPoints, getLevel, streaks } = useHabitStore();
  const { user, logout, updateProfile } = useAuthStore();
  const { history, dailyZikr } = useJournalStore();

  const level = getLevel();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');

  // Calculate Lifetime Stats
  const historyDays = Object.keys(history);
  const totalDays = historyDays.length + 1;
  const lifetimeZikr = Object.values(history).reduce((acc, curr) => acc + (curr.zikr || 0), 0) + dailyZikr;
  const lifetimePrayers = Object.values(history).reduce((acc, curr) => {
    return acc + (curr.tasks || []).filter(t => t.completed && t.isCore).length;
  }, 0) + useJournalStore.getState().tasks.filter(t => t.completed && t.isCore).length;

  const fixedAyat = {
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
    translationUrdu: "اے ایمان والو! صبر اور نماز کے ذریعے مدد چاہو، بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔",
    reference: "Surah Al-Baqarah 2:153"
  };
  const totalStreak = Object.values(streaks).reduce((a, b) => Math.max(a, b), 0);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Assalam-u-Alaikum! I am using Islamic app to track my spiritual journey. It's a premium, minimalist habit tracker for Muslims. \n\nDownload it now from our official website: \nhttps://www.islamic.com`,
        title: 'Islamic'
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFeedback = () => {
    Linking.openURL('mailto:devnexes.support@gmail.com?subject=Nexus OS Feedback');
  };

  const handleSave = () => {
    if (newName.trim()) {
      updateProfile({ name: newName.trim() });
      setEditing(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('SESSION', 'Terminate current session?', [
      { text: 'KEEP' },
      { text: 'TERMINATE', onPress: async () => { await logout(); }, style: 'destructive' }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity</Text>
        <TouchableOpacity onPress={() => editing ? handleSave() : setEditing(true)} style={styles.headerBtn}>
          <Ionicons name={editing ? "checkmark" : "pencil-outline"} size={20} color={THEME.gold} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.hero}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>{level.icon}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{level.name.split(' ')[0]}</Text>
            </View>
          </View>

          {editing ? (
            <TextInput style={styles.nameInput} value={newName} onChangeText={setNewName} autoFocus placeholder="Your Name" />
          ) : (
            <Text style={styles.userName}>{user?.name || 'Servant of Allah'}</Text>
          )}
          <Text style={styles.userEmail}>{user?.email?.toLowerCase()}</Text>
        </View>

        {/* Lifetime Dashboard */}
        <View style={styles.dashboard}>
          <Text style={styles.sectionLabel}>LIFETIME JOURNEY</Text>
          <View style={styles.miniStatsRow}>
            <MiniStat label="Days Active" value={totalDays} icon="calendar-outline" />
            <MiniStat label="Prayers" value={lifetimePrayers} icon="time-outline" />
            <MiniStat label="Dhikr Count" value={lifetimeZikr} icon="finger-print-outline" />
          </View>
        </View>



        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <MaterialCommunityIcons name="format-quote-open" size={24} color={THEME.gold} />
            <Text style={styles.insightTitle}>SPIRITUAL INSIGHT</Text>
          </View>
          <Text style={styles.insightArabic}>{fixedAyat.arabic}</Text>
          <Text style={styles.insightUrdu}>{fixedAyat.translationUrdu}</Text>
          <Text style={styles.insightTranslation}>{fixedAyat.translation}</Text>
          <Text style={styles.insightRef}>{fixedAyat.reference}</Text>
        </View>

        <TouchableOpacity style={styles.actionCard} onPress={handleShare}>
          <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="share-social-outline" size={18} color="#2E7D32" />
          </View>
          <Text style={styles.menuLabel}>Invite Friends</Text>
          <Ionicons name="chevron-forward" size={16} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={handleFeedback}>
          <View style={[styles.menuIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="mail-outline" size={18} color="#1565C0" />
          </View>
          <Text style={styles.menuLabel}>Feedback & Support</Text>
          <Ionicons name="chevron-forward" size={16} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={handleSignOut}>
          <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="log-out-outline" size={18} color="#C62828" />
          </View>
          <Text style={[styles.menuLabel, { color: '#C62828' }]}>Sign Out</Text>
          <Ionicons name="chevron-forward" size={16} color="#CCC" />
        </TouchableOpacity>

        <Text style={styles.version}>VERSION 2.4.0 (ISLAMIC APP)</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#000' },

  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  hero: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  avatarContainer: { width: 120, height: 120, borderRadius: 24, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: THEME.gold, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8, marginBottom: 25 },
  avatarEmoji: { fontSize: 56 },
  levelBadge: { position: 'absolute', bottom: -10, backgroundColor: THEME.gold, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, borderWidth: 2, borderColor: '#FFF' },
  levelBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  userName: { fontSize: 24, fontWeight: '900', color: '#000', letterSpacing: -0.5 },
  nameInput: { fontSize: 24, fontWeight: '900', color: '#000', borderBottomWidth: 2, borderBottomColor: THEME.gold, textAlign: 'center', paddingVertical: 5 },
  userEmail: { fontSize: 12, color: '#AAA', fontWeight: '600', marginTop: 4 },

  dashboard: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  sectionLabel: { fontSize: 10, fontWeight: '900', color: '#AAA', letterSpacing: 2, marginBottom: 20 },
  miniStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  miniStat: { alignItems: 'center', flex: 1 },
  miniStatVal: { fontSize: 18, fontWeight: '900', color: '#000', marginVertical: 6 },
  miniStatLabel: { fontSize: 9, fontWeight: '800', color: '#AAA' },

  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#FFF', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  statIconCircle: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', color: '#000' },
  statLabel: { fontSize: 8, fontWeight: '800', color: '#AAA', letterSpacing: 0.5 },

  insightCard: { backgroundColor: THEME.gold + '08', padding: 24, borderRadius: 16, marginBottom: 30, borderWidth: 1, borderColor: THEME.gold + '20' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  insightTitle: { fontSize: 10, fontWeight: '900', color: THEME.gold, letterSpacing: 1 },
  insightArabic: { fontSize: 20, color: '#000', textAlign: 'center', lineHeight: 34, marginBottom: 10, fontWeight: '700' },
  insightUrdu: { fontSize: 16, color: THEME.gold, textAlign: 'center', lineHeight: 28, marginBottom: 10, fontWeight: '700' },
  insightTranslation: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 20, fontStyle: 'italic', marginBottom: 10 },
  insightRef: { fontSize: 10, color: THEME.gold, textAlign: 'center', fontWeight: '700' },

  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 18, borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  menuIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 18 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#333' },

  version: { textAlign: 'center', color: '#CCC', fontSize: 10, fontWeight: '800', marginVertical: 30, letterSpacing: 2 },
});

