import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Animated, Platform, StatusBar, Image, ImageBackground, Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import useHabitStore from '../store/useHabitStore';
import useAuthStore from '../store/useAuthStore';
import usePrayerStore from '../store/usePrayerStore';
import { prayerService } from '../services/prayerService';
import AppLogo from '../components/AppLogo';

const { width } = Dimensions.get('window');

function PrayerTimeline({ times, currentPrayer, completedPrayers = [] }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const [currentDate, setCurrentDate] = useState({ day: '', fullDate: '' });

  useEffect(() => {
    // Heartbeat pulse for active icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();

    // Dotted sequence animation
    const d = 300;
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: d, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: d, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: d, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(dot1, { toValue: 0, duration: d, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 0, duration: d, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 0, duration: d, useNativeDriver: true }),
        ]),
        Animated.delay(200)
      ])
    ).start();

    // Real-time Date
    const date = new Date();
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    
    const dayName = days[date.getDay()];
    const full = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    
    setCurrentDate({ day: dayName, fullDate: full });
  }, []);

  const prayers = [
    { name: 'Fajr', icon: 'weather-sunset-up' },
    { name: 'Dhuhr', icon: 'weather-sunny' },
    { name: 'Asr', icon: 'weather-partly-cloudy' },
    { name: 'Maghrib', icon: 'weather-sunset' },
    { name: 'Isha', icon: 'weather-night' }
  ];

  const currentIndex = prayers.findIndex(p => p.name.toLowerCase() === (currentPrayer ? currentPrayer.toLowerCase() : ''));

  return (
    <View style={styles.treeSection}>
      <View style={styles.treeHeader}>
        <Text style={styles.microText}>{currentDate.day || 'TODAY'}</Text>
        <Text style={styles.microText}>PRAYER TIMES</Text>
      </View>
      <Text style={styles.hijriDate}>{currentDate.fullDate || 'DATE'}</Text>

      <View style={styles.timelineRow}>
        {prayers.map((p, i) => {
          const isCurrentTime = currentIndex === i;
          const isCompleted = completedPrayers.includes(p.name.toLowerCase());
          const isPassed = currentIndex !== -1 && i <= currentIndex;
          const isPassedLineLeft = currentIndex !== -1 && i <= currentIndex;
          const isPassedLineRight = currentIndex !== -1 && i < currentIndex;

          const shouldPulse = isCurrentTime && !isCompleted;
          const showDots = isCurrentTime && isCompleted;

          return (
            <View key={p.name} style={styles.node}>
              <Text style={[styles.nodeLabel, isPassed && styles.textGold]}>{p.name}</Text>
              <View style={styles.iconBox}>
                {i > 0 && <View style={[styles.line, isPassedLineLeft && styles.lineGold]} />}
                
                <Animated.View style={shouldPulse ? { transform: [{ scale: pulseAnim }] } : {}}>
                  <MaterialCommunityIcons 
                    name={p.icon} 
                    size={18} 
                    color={isPassed ? THEME.gold : '#DDD'} 
                    style={p.flipX ? { transform: [{ scaleX: -1 }] } : {}}
                  />
                </Animated.View>

                {i < prayers.length - 1 && (
                  <View style={[styles.line, { backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }]}>
                    {isPassedLineRight ? (
                      <View style={[StyleSheet.absoluteFillObject, styles.lineGold]} />
                    ) : showDots ? (
                      <>
                        <Animated.View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: THEME.gold, opacity: dot1 }} />
                        <Animated.View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: THEME.gold, opacity: dot2 }} />
                        <Animated.View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: THEME.gold, opacity: dot3 }} />
                      </>
                    ) : (
                      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#F0F0F0' }]} />
                    )}
                  </View>
                )}
              </View>
              <Text style={[styles.nodeTime, isPassed && styles.textGold]}>
                {times ? times[p.name] : '--:--'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function BentoCard({ label, title, icon, onPress, sub, size = 'small', widthType = 'half', bg = '#F8F9FA', imageSource }) {
  const isWide = widthType === 'full';
  const isLarge = size === 'large';
  
  const innerStyle = { padding: 20, flex: 1, justifyContent: 'space-between' };
  
  const content = (
    <>
      {imageSource && (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 16 }]} />
      )}
      
      <View style={styles.bentoTop}>
        <View style={[styles.bentoIcon, imageSource && { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 0, elevation: 0 }]}>
          <Ionicons name={icon} size={22} color={imageSource ? '#FFF' : THEME.gold} />
        </View>
        {sub && (
          <View style={[styles.bentoSubBadge, imageSource && { backgroundColor: 'rgba(255,255,255,0.2)', elevation: 0 }]}>
            <Text style={[styles.bentoSub, imageSource && { color: '#FFF' }]}>{sub}</Text>
          </View>
        )}
      </View>
      <View style={styles.bentoBottom}>
        <Text style={[
          styles.bentoLabel, 
          imageSource && { color: '#EEE', textShadowColor: 'rgba(0,0,0,0.7)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }
        ]}>{label}</Text>
        <Text style={[
          styles.bentoTitle, 
          imageSource && { color: '#FFF', fontWeight: 'bold', fontSize: 22, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 5 }
        ]}>{title}</Text>
      </View>
    </>
  );

  return (
    <TouchableOpacity 
      style={[
        styles.bentoCard, 
        isWide ? styles.bentoWide : styles.bentoHalf,
        isLarge ? styles.bentoLarge : styles.bentoSmall,
        { backgroundColor: bg },
        imageSource && { borderWidth: 0 }
      ]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      {imageSource ? (
        <ImageBackground 
          source={imageSource} 
          style={innerStyle} 
          imageStyle={{ borderRadius: 16, resizeMode: 'cover' }}
        >
          {content}
        </ImageBackground>
      ) : (
        <View style={innerStyle}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const { points, completionHistory } = useHabitStore();
  const { prayerTimes, calculateTimes, location, updateLocation } = usePrayerStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    
    // Auto-fetch location if missing
    if (!location && updateLocation) {
      updateLocation();
    }
    
    // Auto refresh prayer times every minute
    const timer = setInterval(() => {
      if (calculateTimes) calculateTimes();
    }, 60000);
    
    return () => clearInterval(timer);
  }, [calculateTimes, location]);

  const formattedTimes = useMemo(() => {
    if (!prayerTimes) return null;
    return {
      Fajr: prayerService.formatTime(prayerTimes.fajr),
      Dhuhr: prayerService.formatTime(prayerTimes.dhuhr),
      Asr: prayerService.formatTime(prayerTimes.asr),
      Maghrib: prayerService.formatTime(prayerTimes.maghrib),
      Isha: prayerService.formatTime(prayerTimes.isha),
    };
  }, [prayerTimes]);

  const currentPrayer = prayerTimes?.current === 'none' ? null : prayerTimes?.current;
  
  const todayDate = new Date(); 
  const dateStr = todayDate.getFullYear() + '-' + String(todayDate.getMonth() + 1).padStart(2, '0') + '-' + String(todayDate.getDate()).padStart(2, '0');
  const todayCompletions = completionHistory[dateStr] || [];

  const bentoCards = useMemo(() => [
    { id: 'tasbih', label: "SPIRITUAL TOOLS", title: "Tasbih", icon: "finger-print-outline", route: 'Tasbih', size: "small", widthType: "half", imageSource: require('../../assets/bento/tasbih.png') },
    { id: 'hadith', label: "DAILY GUIDANCE", title: "Hadith", icon: "book-outline", route: 'Hadith', size: "small", widthType: "half", imageSource: require('../../assets/bento/duas.png') },
    { id: 'qibla', label: "QIBLA", title: "Compass", icon: "compass-outline", route: 'Qibla', size: "large", widthType: "half", imageSource: require('../../assets/bento/qibla.png') },
    { id: 'journal', label: "PLANNER", title: "Daily Tasks", icon: "calendar-outline", route: 'Journal', size: "large", widthType: "half", imageSource: require('../../assets/bento/journal.png') },
    { id: 'azkar', label: "REMEMBRANCE", title: "Daily Azkar", icon: "moon-outline", route: 'Azkar', size: "small", widthType: "full", imageSource: require('../../assets/bento/performance.png') },
  ], [points]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <Animated.ScrollView 
        style={{ flex: 1, opacity: fadeAnim }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Minimalist Top Nav */}
        <View style={styles.header}>
          <View style={{ flex: 1, flexShrink: 1, paddingRight: 10 }}>
            <AppLogo size={32} />
            <Text style={styles.greeting} numberOfLines={1}>Assalamu Alaikum {user?.name || ''}</Text>
          </View>
          <View style={{ width: 44, alignItems: 'flex-end' }}>
            <TouchableOpacity style={styles.profile} onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person-outline" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* PRO PRAYER TREE - DIRECT ON WHITE */}
        <PrayerTimeline times={formattedTimes} currentPrayer={currentPrayer} completedPrayers={todayCompletions} />

        {!location && (
          <TouchableOpacity 
            style={styles.locationWarning} 
            onPress={() => updateLocation()}
          >
            <Ionicons name="location-outline" size={16} color="#FFF" />
            <Text style={styles.locationWarningText}>
              Location services disabled. Tap to retry.
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider} />

        {/* BENTO GRID CARDS */}
        <View style={styles.bentoContainer}>
          {bentoCards.map((card) => (
            <BentoCard 
              key={card.id}
              label={card.label}
              title={card.title}
              icon={card.icon}
              onPress={() => navigation.navigate(card.route)}
              sub={card.sub}
              size={card.size}
              widthType={card.widthType}
              bg={card.bg}
              imageSource={card.imageSource}
            />
          ))}
        </View>

        <View style={{ height: 10 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { padding: 24 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 },
  brand: { color: THEME.gold, fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  greeting: { fontFamily: 'PTSans_400Regular', color: '#000', fontSize: 24, fontWeight: '900', letterSpacing: -1, marginTop: 4 },
  profile: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F0F0F0' },

  treeSection: { marginBottom: 48 },
  treeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  microText: { color: '#AAA', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  hijriDate: { fontFamily: 'PTSans_400Regular', color: '#000', fontSize: 22, fontWeight: '900', letterSpacing: -0.5, marginBottom: 32 },
  
  timelineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  node: { alignItems: 'center', flex: 1 },
  nodeLabel: { color: '#AAA', fontSize: 9, fontWeight: '900', marginBottom: 12 },
  iconBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginVertical: 8 },
  line: { flex: 1, height: 1, backgroundColor: '#F0F0F0' },
  lineGold: { backgroundColor: THEME.gold + '40' },
  textGold: { color: THEME.gold },
  nodeTime: { color: '#AAA', fontSize: 9, fontWeight: '900', marginTop: 12 },

  divider: { height: 1, backgroundColor: '#F8F9FA', marginBottom: 32 },

  bentoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bentoCard: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  bentoWide: { width: '100%' },
  bentoHalf: { width: '47.5%' },
  bentoSmall: { height: 140 },
  bentoLarge: { height: 190 },
  
  bentoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bentoBottom: {
    marginTop: 'auto',
  },
  bentoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bentoLabel: {
    color: '#888',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bentoTitle: {
    fontFamily: 'PTSans_400Regular',
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  bentoSubBadge: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bentoSub: {
    color: THEME.gold,
    fontSize: 10,
    fontWeight: '900',
  },
  locationWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 24,
    marginTop: -24,
  },
  locationWarningText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
  }
});
