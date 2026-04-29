import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, Animated, StatusBar, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { IslamicPattern } from '../components/IslamicPattern';
import useAuthStore from '../store/useAuthStore';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  
  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const inputScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 10, friction: 5, useNativeDriver: true })
    ]).start();
  }, []);

  const handleJoin = async () => {
    if (!name.trim()) {
      Alert.alert('Bismillah', 'Please enter your name to begin.');
      return;
    }
    setLoading(true);
    const res = await login(name);
    setLoading(false);
    if (!res.success) Alert.alert('Error', res.message);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <IslamicPattern opacity={0.03} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              
              {/* TOP BRANDING */}
              <View style={styles.header}>
                <Text style={styles.bismillah}>بِسْمِ اللّٰهِ الرَّحٰمَنِ الرَّحِيْمِ</Text>
                
                <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
                  <View style={styles.logoInner}>
                    <Ionicons name="moon-outline" size={32} color={THEME.gold} />
                  </View>
                  <View style={styles.logoRing} />
                </Animated.View>
                
                <Text style={styles.micro}>ISLAMIC MASTER • PRECISION EDITION</Text>
                <Text style={styles.title}>Soulful Connection</Text>
                <Text style={styles.subTitle}>Experience the peace of a mindful lifestyle</Text>
              </View>

              {/* INPUT SECTION */}
              <View style={styles.form}>
                <Animated.View style={[styles.inputContainer, { transform: [{ scale: inputScale }] }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="ENTER YOUR NAME"
                    placeholderTextColor="#BBB"
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    maxLength={20}
                    returnKeyType="join"
                    onSubmitEditing={handleJoin}
                    blurOnSubmit={false}
                    onFocus={() => Animated.spring(inputScale, { toValue: 1.05, useNativeDriver: true }).start()}
                    onBlur={() => Animated.spring(inputScale, { toValue: 1, useNativeDriver: true }).start()}
                  />
                </Animated.View>

                <TouchableOpacity 
                  style={[styles.joinBtn, !name.trim() && styles.joinBtnDisabled]} 
                  onPress={handleJoin}
                  activeOpacity={0.8}
                  disabled={loading || !name.trim()}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <View style={styles.btnContent}>
                      <Text style={styles.joinText}>START JOURNEY</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* BOTTOM FEATURES - CLEANER LIST */}
              <View style={styles.featuresRow}>
                <FeatureItem icon="finger-print" label="ZIKR" />
                <FeatureItem icon="book-outline" label="HADITH" />
                <FeatureItem icon="calendar-outline" label="HIJRI" />
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>YOUR SPIRITUAL HABIT TRACKER</Text>
              </View>

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function FeatureItem({ icon, label }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={14} color={THEME.gold} />
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 40 },
  content: { alignItems: 'center' },
  
  header: { alignItems: 'center', marginBottom: 60 },
  bismillah: { 
    fontSize: 26, 
    color: THEME.gold + '40', 
    marginBottom: 40, 
    fontFamily: Platform.OS === 'ios' ? 'Amiri' : 'serif',
    fontWeight: '400'
  },
  
  logoContainer: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  logoInner: { 
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFF', 
    alignItems: 'center', justifyContent: 'center', zIndex: 2,
    borderWidth: 1, borderColor: '#F0F0F0',
    shadowColor: THEME.gold, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5
  },
  logoRing: { 
    position: 'absolute', width: 90, height: 90, borderRadius: 45, 
    borderWidth: 1, borderColor: THEME.gold + '15', borderStyle: 'dashed' 
  },

  micro: { color: THEME.gold, fontSize: 8, fontWeight: '900', letterSpacing: 3 },
  title: { color: '#000', fontSize: 28, fontWeight: '900', letterSpacing: -1, marginTop: 12 },
  subTitle: { color: '#AAA', fontSize: 13, textAlign: 'center', marginTop: 8, fontWeight: '500', paddingHorizontal: 20 },

  form: { width: '100%', alignItems: 'center' },
  inputContainer: { width: '100%', marginBottom: 32 },
  input: { 
    fontSize: 16, 
    fontFamily: 'PTSans_400Regular', 
    color: '#000', 
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 12
  },
  
  joinBtn: { 
    backgroundColor: '#000', 
    paddingHorizontal: 40, 
    paddingVertical: 18, 
    borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5
  },
  joinBtnDisabled: { backgroundColor: '#F8F9FA', shadowOpacity: 0 },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  joinText: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 2, marginRight: 12 },
  
  featuresRow: { flexDirection: 'row', gap: 12, marginTop: 80 },
  featureItem: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, 
    borderRadius: 14, borderWidth: 1, borderColor: '#F8F9FA' 
  },
  featureLabel: { color: '#AAA', fontSize: 8, fontWeight: '900', letterSpacing: 1.5, marginLeft: 8 },

  footer: { marginTop: 60 },
  footerText: { color: '#EEE', fontSize: 9, fontWeight: '900', letterSpacing: 2.5 }
});
