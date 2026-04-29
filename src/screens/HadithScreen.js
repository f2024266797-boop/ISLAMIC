import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, 
  StatusBar, Share, ActivityIndicator, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { HADITHS } from '../constants/hadiths';

export default function HadithScreen({ navigation }) {
  const [hadith, setHadith] = useState(HADITHS[0]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    loadNewHadith();
  }, []);

  const loadNewHadith = () => {
    setLoading(true);
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    
    // Pick random from real list
    const random = HADITHS[Math.floor(Math.random() * HADITHS.length)];
    setHadith(random);
    
    setTimeout(() => {
      setLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true })
      ]).start();
    }, 400);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${hadith.text}"\n\n— ${hadith.narrator} (${hadith.source})\n\nSent via Islamic Master App`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.microHeader}>DAILY INSPIRATION</Text>
          <Text style={styles.title}>Prophetic Guidance</Text>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Ionicons name="share-social-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        {loading ? (
          <ActivityIndicator size="large" color={THEME.gold} />
        ) : (
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.quoteIcon}>
              <MaterialCommunityIcons name="format-quote-open" size={40} color={THEME.gold + '30'} />
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{hadith.tag}</Text>
              </View>
              
              <Text style={styles.hadithText}>{hadith.text}</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.narrator}>Narrated by {hadith.narrator}</Text>
              <Text style={styles.source}>{hadith.source}</Text>
            </ScrollView>

            <TouchableOpacity style={styles.nextBtn} onPress={loadNewHadith}>
              <Text style={styles.nextText}>REFRESH WISDOM</Text>
              <Ionicons name="refresh" size={16} color="#FFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SAHIH HADITH • VERIFIED SOURCES</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: '#FAFAFA' },
  shareBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: '#FAFAFA' },
  headerTitle: { alignItems: 'center' },
  microHeader: { color: THEME.gold, fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#000', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },

  main: { flex: 1, padding: 24, justifyContent: 'center' },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 32, 
    padding: 32, 
    minHeight: 400,
    borderWidth: 1, 
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 10,
    alignItems: 'center'
  },
  quoteIcon: { position: 'absolute', top: 20, left: 20 },
  scrollContent: { alignItems: 'center' },
  tagBadge: { backgroundColor: THEME.gold + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 24 },
  tagText: { color: THEME.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  hadithText: { fontFamily: 'PTSans_400Regular', color: '#000', fontSize: 24, fontWeight: '700', textAlign: 'center', lineHeight: 36, letterSpacing: -0.5 },
  divider: { width: 40, height: 2, backgroundColor: '#F0F0F0', marginVertical: 32 },
  narrator: { color: '#888', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  source: { color: '#AAA', fontSize: 12, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  
  nextBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#000', 
    paddingHorizontal: 24, 
    paddingVertical: 14, 
    borderRadius: 16,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  nextText: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 1 },

  footer: { paddingBottom: 20, alignItems: 'center' },
  footerText: { color: '#EEE', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
});
