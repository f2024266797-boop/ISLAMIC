import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { qiblaService } from '../services/qiblaService';
import { IslamicPattern, GoldDivider } from '../components/IslamicPattern';
import usePrayerStore from '../store/usePrayerStore';
import { TouchableOpacity } from 'react-native';

export default function QiblaScreen({ navigation }) {
  const { location } = usePrayerStore();
  const subscriptionRef = useRef(null);
  const [magnetometer, setMagnetometer] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(0);

  useEffect(() => {
    if (location) {
      const angle = qiblaService.calculateQibla(location.latitude, location.longitude);
      setQiblaDir(angle);
    }
    _subscribe();
    return () => _unsubscribe();
  }, [location]);

  const _subscribe = async () => {
    _unsubscribe();
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const sub = await Location.watchHeadingAsync((data) => {
        // Use trueHeading if available, otherwise fallback to magHeading
        const heading = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
        setMagnetometer(Math.round(heading));
      });
      subscriptionRef.current = sub;
    } catch (e) {
      console.warn("Heading tracking error:", e);
    }
  };

  const _unsubscribe = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  };

  // needle rotation: qiblaDir - magnetometer
  const rotation = qiblaDir - magnetometer;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bgCard} />
      <IslamicPattern />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={THEME.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Qibla Direction</Text>
        <Text style={styles.h1Ar}>اتِّجَاهُ الْقِبْلَةِ</Text>
        <View style={styles.locBanner}>
          <Ionicons name="location-outline" size={14} color={THEME.gold} />
          <Text style={styles.subtitle}>
            {location?.city ? `Aligning from ${location.city}` : 'Calibrating sensors...'}
          </Text>
        </View>
      </View>

      {!location ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="location-outline" size={54} color={THEME.grayDim} />
          </View>
          <Text style={styles.emptyTitle}>Location Required</Text>
          <Text style={styles.emptySub}>
            Please enable location services in the Prayer Times tab to calculate the Qibla accurately.
          </Text>
        </View>
      ) : (
        <View style={styles.compassArea}>
          {/* Degree Display */}
          <View style={styles.degreeBox}>
            <Text style={styles.degreeNum}>{magnetometer}°</Text>
            <Text style={styles.degreeLabel}>MAGNETIC NORTH</Text>
          </View>

          {/* Compass Body */}
          <View style={styles.compassOuter}>
            <View style={styles.compassInner}>
              <IslamicPattern opacity={0.05} />
              
              {/* Scale marks */}
              {[...Array(12)].map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.mark, 
                    { transform: [{ rotate: `${i * 30}deg` }] }
                  ]} 
                />
              ))}

              <Animated.View style={[styles.needleWrapper, { transform: [{ rotate: `${rotation}deg` }] }]}>
                {/* Pointer Line */}
                <View style={styles.needlePointer} />
                <View style={styles.needleHead}>
                  <MaterialCommunityIcons name="mosque" size={32} color={THEME.gold} />
                </View>
              </Animated.View>

              {/* Central Hub */}
              <View style={styles.hub}>
                <View style={styles.hubInner} />
              </View>
            </View>
          </View>

          <View style={styles.qiblaInfo}>
            <Text style={styles.qiblaAngleLabel}>QIBLA ANGLE</Text>
            <Text style={styles.qiblaAngleVal}>{Math.round(qiblaDir)}°</Text>
          </View>
        </View>
      )}

      {/* Calibration Footer */}
      <View style={styles.footer}>
        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}>
            <Ionicons name="sync-outline" size={20} color={THEME.gold} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.infoTitle}>Calibration Tip</Text>
            <Text style={styles.infoText}>
              Move your phone in a "figure-8" motion to calibrate sensors for maximum accuracy.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  header: { padding: 24, alignItems: 'center', position: 'relative' },
  backButton: { position: 'absolute', left: 20, top: 24, zIndex: 10, padding: 4 },
  title: { color: THEME.white, fontSize: 24, fontWeight: '800' },
  h1Ar: {
    fontFamily: Platform.OS === 'ios' ? 'Amiri' : 'serif',
    color: THEME.gold, fontSize: 16, marginTop: 4
  },
  locBanner: { 
    flexDirection: 'row', alignItems: 'center', 
    marginTop: 12, backgroundColor: THEME.bgCard2, 
    paddingHorizontal: 12, paddingVertical: 6, 
    borderRadius: THEME.radius.full, borderWidth: 1, borderColor: THEME.border
  },
  subtitle: { color: THEME.grayLight, fontSize: 11, fontWeight: '700', marginLeft: 6 },

  compassArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  degreeBox: { alignItems: 'center', marginBottom: 20 },
  degreeNum: { color: THEME.white, fontSize: 44, fontWeight: '800' },
  degreeLabel: { color: THEME.gray, fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },

  compassOuter: { 
    width: 280, height: 280, borderRadius: 140, 
    borderWidth: 2, borderColor: THEME.borderGold,
    padding: 10, backgroundColor: THEME.bgCard,
    ...THEME.shadow(THEME.gold, 0.15, 20, 0)
  },
  compassInner: { 
    flex: 1, borderRadius: 130, 
    backgroundColor: THEME.bg, alignItems: 'center', 
    justifyContent: 'center', overflow: 'hidden'
  },
  mark: {
    position: 'absolute', width: 2, height: 10,
    backgroundColor: THEME.border, top: 10
  },
  needleWrapper: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  needlePointer: { 
    width: 4, height: 100, 
    backgroundColor: THEME.gold, borderRadius: 2,
    position: 'absolute', top: 40,
    ...THEME.shadow(THEME.gold, 0.4, 10, 0)
  },
  needleHead: { position: 'absolute', top: 5 },
  
  hub: { 
    position: 'absolute', width: 24, height: 24, 
    borderRadius: 12, backgroundColor: THEME.bgCard, 
    borderWidth: 1, borderColor: THEME.gold,
    alignItems: 'center', justifyContent: 'center'
  },
  hubInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.gold },

  qiblaInfo: { marginTop: 32, alignItems: 'center' },
  qiblaAngleLabel: { color: THEME.gray, fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },
  qiblaAngleVal: { color: THEME.gold, fontSize: 24, fontWeight: '800', marginTop: 4 },

  footer: { padding: 24 },
  infoCard: { 
    flexDirection: 'row', backgroundColor: THEME.bgCard, 
    padding: 20, borderRadius: THEME.radius.lg, 
    borderWidth: 1, borderColor: THEME.border, alignItems: 'center'
  },
  infoIconBox: { 
    width: 44, height: 44, borderRadius: 12, 
    backgroundColor: THEME.goldGlow, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: THEME.borderGold
  },
  infoTitle: { color: THEME.white, fontWeight: '800', fontSize: 14 },
  infoText: { color: THEME.gray, fontSize: 12, marginTop: 4, lineHeight: 18 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIconBox: { marginBottom: 20, padding: 20, backgroundColor: THEME.bgCard, borderRadius: 20 },
  emptyTitle: { color: THEME.white, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  emptySub: { color: THEME.gray, fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 22 },
});
