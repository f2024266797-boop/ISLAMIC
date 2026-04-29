import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, Vibration, StatusBar, Modal, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME } from '../constants/theme';
import useHabitStore from '../store/useHabitStore';
import useAuthStore from '../store/useAuthStore';

import useJournalStore from '../store/useJournalStore';

const TASBIH_LIST = [
  { id: 'fatima', title: 'Tasbih Fatima', isSequence: true, goal: 100 },
  { id: 'allah', title: 'Dhikr Allah', arabic: 'ٱللَّٰهُ', english: 'Allah', desc: 'The Greatest Name', goal: 100 },
  { id: 'allahu', title: 'Dhikr Allah Hu', arabic: 'ٱللَّٰهُ هُوَ', english: 'Allahu', desc: 'He is Allah', goal: 100 },
  { id: 'lailaha', title: 'La Ilaha Illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', english: 'La Ilaha Illallah', desc: 'There is no deity but Allah', goal: 100 },
  { id: 'subhanallah', title: 'Subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', english: 'Subhanallah', desc: 'Glory be to Allah', goal: 100 },
  { id: 'astaghfirullah', title: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', english: 'Astaghfirullah', desc: 'I seek forgiveness from Allah', goal: 100 },
  { id: 'yahayyu', title: 'Ya Hayyu Ya Qayyum', arabic: 'يَا حَيُّ يَا قَيُّومُ', english: 'Ya Hayyu Ya Qayyum', desc: 'O Living, O Sustaining', goal: 100 },
  { id: 'lahawla', title: 'La Hawla Wala Quwwata', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', english: 'La Hawla...', desc: 'There is no power but with Allah', goal: 100 },
  { id: 'tayyab', title: 'Tayyab', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَسُولُ ٱللَّٰهِ', english: 'Tayyab', desc: 'The Word of Purity', goal: 100 },
  { id: 'shahadat', title: 'Shahadat', arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', english: 'Shahadat', desc: 'The Word of Testimony', goal: 100 },
];

export default function TasbihScreen({ navigation }) {
  const [counts, setCounts] = useState({}); // { [zikrId]: number }
  const [sessionTotal, setSessionTotal] = useState(0);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [activeTasbih, setActiveTasbih] = useState(TASBIH_LIST[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Custom Tasbih State
  const [customTasbihs, setCustomTasbihs] = useState([]);
  const [isAddCustomVisible, setIsAddCustomVisible] = useState(false);
  const [customArabic, setCustomArabic] = useState('');
  const [customEnglish, setCustomEnglish] = useState('');

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const completionAnim = useRef(new Animated.Value(0)).current;
  const { addPoints } = useHabitStore();
  const { incrementZikr } = useJournalStore();
  const user = useAuthStore((state) => state.user);
  
  const userId = user ? user.id : 'guest';
  const countsKey = `@tasbih_counts_obj_${userId}`;
  const sessionKey = `@tasbih_session_${userId}`;
  const activeIdKey = `@tasbih_active_id_${userId}`;
  const customsKey = `@tasbih_customs_${userId}`;

  const currentCount = counts[activeTasbih.id] || 0;

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedCounts = await AsyncStorage.getItem(countsKey);
        const savedSession = await AsyncStorage.getItem(sessionKey);
        const savedActiveId = await AsyncStorage.getItem(activeIdKey);
        const savedCustoms = await AsyncStorage.getItem(customsKey);
        
        let loadedCustoms = [];
        if (savedCustoms) {
          loadedCustoms = JSON.parse(savedCustoms);
          setCustomTasbihs(loadedCustoms);
        }

        if (savedCounts) setCounts(JSON.parse(savedCounts));
        if (savedSession) setSessionTotal(parseInt(savedSession));
        
        if (savedActiveId) {
          const allList = [...TASBIH_LIST, ...loadedCustoms];
          const found = allList.find(t => t.id === savedActiveId);
          if (found) setActiveTasbih(found);
        }
      } catch (e) {
        console.error("Failed to load tasbih state", e);
      } finally {
        setIsLoaded(true);
      }
    };
    
    // Reset state before loading new account data
    setIsLoaded(false);
    setCounts({});
    setSessionTotal(0);
    setActiveTasbih(TASBIH_LIST[0]);
    
    loadState();
  }, [userId]);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(countsKey, JSON.stringify(counts));
      AsyncStorage.setItem(sessionKey, sessionTotal.toString());
      AsyncStorage.setItem(activeIdKey, activeTasbih.id);
    }
  }, [counts, sessionTotal, activeTasbih, isLoaded, userId]);

  const handlePress = () => {
    const phrase = getPhrase();
    const newCount = currentCount + 1;
    
    setCounts(prev => ({ ...prev, [activeTasbih.id]: newCount }));
    setSessionTotal(sessionTotal + 1);
    incrementZikr(1, phrase.english);
    
    if (hapticEnabled && Platform.OS !== 'web') Vibration.vibrate(10);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 50, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5, tension: 40 }),
    ]).start();

    if (newCount > 0 && newCount % activeTasbih.goal === 0) {
      if (hapticEnabled && Platform.OS !== 'web') Vibration.vibrate([0, 50, 100, 50]);
      setShowCompletion(true);
      Animated.sequence([
        Animated.timing(completionAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(completionAnim, { toValue: 0, duration: 400, useNativeDriver: true })
      ]).start(() => setShowCompletion(false));
    }
  };

  const reset = () => {
    if (currentCount > 0) addPoints(Math.floor(currentCount / activeTasbih.goal) * 10);
    setCounts(prev => ({ ...prev, [activeTasbih.id]: 0 }));
  };

  const handleMinus = () => {
    if (currentCount > 0) {
      setCounts(prev => ({ ...prev, [activeTasbih.id]: currentCount - 1 }));
      setSessionTotal(prev => prev > 0 ? prev - 1 : 0);
      if (hapticEnabled && Platform.OS !== 'web') Vibration.vibrate(5);
    }
  };

  const getArabicFont = (variant = 'default') => {
    return 'PTSans_400Regular';
  };

  const getPhrase = () => {
    if (activeTasbih.isSequence) {
      const cycle = currentCount % 100;
      if (cycle < 33) return { arabic: 'سُبْحَانَ ٱللَّٰهِ', english: 'Subhanallah', desc: 'Glory be to Allah' };
      if (cycle < 66) return { arabic: 'ٱلْحَمْدُ لِلَّٰهِ', english: 'Alhamdulillah', desc: 'Praise be to Allah' };
      return { arabic: 'ٱللَّٰهُ أَكْبَرُ', english: 'Allahu Akbar', desc: 'Allah is the Greatest' };
    }
    return activeTasbih;
  };

  const selectTasbih = (tasbih) => {
    setActiveTasbih(tasbih);
    setModalVisible(false);
  };

  const handleAddCustom = () => {
    if (!customEnglish.trim() && !customArabic.trim()) return;
    
    const newCustom = {
      id: 'custom_' + Date.now(),
      title: 'Custom Dhikr',
      arabic: customArabic.trim(),
      english: customEnglish.trim() || 'Custom Tasbih',
      desc: 'My Custom Tasbih',
      goal: 100,
      isCustom: true
    };
    
    const updatedList = [...customTasbihs, newCustom];
    setCustomTasbihs(updatedList);
    AsyncStorage.setItem(customsKey, JSON.stringify(updatedList));
    
    selectTasbih(newCustom);
    setIsAddCustomVisible(false);
    setCustomArabic('');
    setCustomEnglish('');
  };

  const phrase = getPhrase();
  const currentGoal = activeTasbih.goal;
  const laps = Math.floor(sessionTotal / currentGoal);
  const ALL_TASBIHS = [...TASBIH_LIST, ...customTasbihs];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      
      {showCompletion && (
        <Animated.View style={[styles.completionBadge, { 
          opacity: completionAnim, 
          transform: [{ translateY: completionAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] 
        }]}>
          <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.completionText}>1 Tasbih Completed!</Text>
        </Animated.View>
      )}

      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)} 
          style={styles.selectorButton}
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerTitle}>SELECT DHIKR</Text>
            <Text style={styles.headerSub}>{activeTasbih.title}</Text>
          </View>
          <Ionicons name="caret-down" size={16} color={THEME.gold} style={{ marginLeft: 8, marginTop: 4 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setHapticEnabled(!hapticEnabled)} style={styles.iconBtn}>
          <Ionicons name={hapticEnabled ? "phone-portrait" : "phone-portrait-outline"} size={20} color={hapticEnabled ? THEME.gold : '#CCC'} />
        </TouchableOpacity>
      </View>

      {/* Main Display (Scrollable for large custom texts) */}
      <View style={styles.displayContainer}>
        <ScrollView contentContainerStyle={styles.displaySection} showsVerticalScrollIndicator={false}>
          <Text style={styles.arabicText}>{phrase.arabic}</Text>
          <Text style={styles.englishText}>{phrase.english}</Text>
          {phrase.desc ? <Text style={styles.descText}>{phrase.desc}</Text> : null}
        </ScrollView>
      </View>

      {/* Counter Section */}
      <View style={styles.interactionSection}>
        <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.counterTouchable}>
          <Animated.View style={[styles.counterRing, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.counterInner}>
              <Text style={styles.countText}>{currentCount}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={handleMinus} style={styles.secondaryBtn}>
            <Ionicons name="remove" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={reset} style={[styles.secondaryBtn, { backgroundColor: THEME.gold, borderColor: THEME.gold }]}>
            <Ionicons name="refresh" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Stats & Progress */}
      <View style={styles.footerContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min((currentCount / currentGoal) * 100, 100)}%` }]} />
        </View>

        <View style={styles.footerRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>LAPS</Text>
            <Text style={styles.statVal}>{laps}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SESSION</Text>
            <Text style={styles.statVal}>{sessionTotal}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>GOAL</Text>
            <Text style={styles.statVal}>{currentCount} / {currentGoal}</Text>
          </View>
        </View>
      </View>

      {/* Selector Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Tasbih</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#CCC" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {ALL_TASBIHS.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.modalItem, activeTasbih.id === item.id && styles.modalItemActive]}
                  onPress={() => selectTasbih(item)}
                >
                  <Text style={[styles.modalItemTitle, activeTasbih.id === item.id && { color: THEME.gold }]}>{item.title}</Text>
                  {item.arabic && <Text style={styles.modalItemArabic}>{item.arabic}</Text>}
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                style={styles.addCustomBtn} 
                onPress={() => {
                  setModalVisible(false);
                  setIsAddCustomVisible(true);
                }}
              >
                <Ionicons name="add-circle" size={24} color={THEME.gold} />
                <Text style={styles.addCustomText}>Add Custom Tasbih</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Custom Tasbih Modal */}
      <Modal visible={isAddCustomVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '60%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Custom Tasbih</Text>
              <TouchableOpacity onPress={() => setIsAddCustomVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#CCC" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>English Text / Translation</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="e.g. Astaghfirullah..." 
                value={customEnglish} 
                onChangeText={setCustomEnglish} 
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Arabic Text (Optional)</Text>
              <TextInput 
                style={[styles.textInput, { fontFamily: THEME.fonts.primary, fontSize: 20, textAlign: 'right' }]} 
                placeholder="أَسْتَغْفِرُ ٱللَّٰهَ..." 
                value={customArabic} 
                onChangeText={setCustomArabic} 
                multiline
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddCustom}>
              <Text style={styles.saveBtnText}>Save & Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 },
  headerTitle: { color: THEME.gold, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  headerSub: { color: '#000', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  selectorButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#EBEBEB' },

  completionBadge: { position: 'absolute', top: 90, alignSelf: 'center', backgroundColor: THEME.gold, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, flexDirection: 'row', alignItems: 'center', shadowColor: THEME.gold, shadowOffset: {width:0, height:4}, shadowOpacity: 0.4, shadowRadius: 10, elevation: 10, zIndex: 100 },
  completionText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },

  displayContainer: { flex: 1, paddingHorizontal: 32 },
  displaySection: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  arabicText: { fontFamily: THEME.fonts.primary, color: '#000', fontSize: 36, marginBottom: 16, textAlign: 'center' },
  englishText: { fontFamily: THEME.fonts.primary, color: THEME.gold, fontSize: 16, fontWeight: '900', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase', textAlign: 'center' },
  descText: { fontFamily: THEME.fonts.primary, color: '#666', fontSize: 12, fontWeight: '600', letterSpacing: 1, textAlign: 'center' },

  interactionSection: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  counterTouchable: { shadowColor: THEME.gold, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 30, elevation: 15 },
  counterRing: { width: 240, height: 240, borderRadius: 120, backgroundColor: '#F9F9F9', borderWidth: 3, borderColor: THEME.gold + '60', alignItems: 'center', justifyContent: 'center', padding: 12 },
  counterInner: { width: '100%', height: '100%', borderRadius: 110, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEE' },
  countText: { color: '#000', fontSize: 80, fontWeight: '900', letterSpacing: -2 },

  actionRow: { flexDirection: 'row', marginTop: 32, gap: 24 },
  secondaryBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEE', shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },

  footerContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  progressTrack: { height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, marginBottom: 24, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: THEME.gold },
  footerRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  statBox: { alignItems: 'center', flex: 1 },
  statLabel: { color: '#888', fontSize: 8, fontWeight: '900', letterSpacing: 2, marginBottom: 6 },
  statVal: { color: '#000', fontSize: 20, fontWeight: '900' },
  divider: { width: 1, height: 30, backgroundColor: '#EEE' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#000' },
  modalItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalItemActive: { backgroundColor: '#FFF9E6', borderRadius: 12, paddingHorizontal: 16, borderBottomWidth: 0, marginVertical: 4 },
  modalItemTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  modalItemArabic: { fontFamily: 'Lustria_400Regular', fontSize: 18, color: '#666', marginTop: 8, textAlign: 'right' },
  
  addCustomBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, marginTop: 10, borderTopWidth: 1, borderTopColor: '#EEE', gap: 10 },
  addCustomText: { color: THEME.gold, fontSize: 16, fontWeight: 'bold' },

  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  textInput: { borderWidth: 1, borderColor: '#EEE', borderRadius: 12, padding: 16, fontSize: 16, backgroundColor: '#F9F9F9', minHeight: 60, color: '#000' },
  saveBtn: { backgroundColor: THEME.gold, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
