import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TextInput, Share, Platform, StatusBar, Animated, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { DUAS, DUA_CATEGORIES } from '../constants/duas';
import useSettingsStore from '../store/useSettingsStore';

function CategoryChip({ item, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{(item?.name || '').toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

export default function DuasLibraryScreen({ navigation }) {
  const { arabicFont } = useSettingsStore();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const filtered = useMemo(() => {
    return DUAS.filter(d => {
      const mCat = cat === 'all' || d.category === cat;
      const mSearch = d.title.toLowerCase().includes(search.toLowerCase());
      return mCat && mSearch;
    });
  }, [search, cat]);

  const handleShare = async (dua) => {
    try {
      await Share.share({ message: `${dua.title}\n\n${dua.arabic}\n\n${dua.translation}` });
    } catch (e) { console.error(e); }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{(item?.title || '').toUpperCase()}</Text>
        <TouchableOpacity onPress={() => handleShare(item)}>
          <Ionicons name="share-outline" size={14} color={THEME.gold} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.arabic, { fontFamily: THEME.getArabicFont(arabicFont) }]}>{item.arabic}</Text>
      <Text style={styles.translation}>{item.translation}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.microLabel}>{(item?.reference || '').toUpperCase()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={THEME.white} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.microHeader}>SUPPLICATIONS</Text>
          <Text style={styles.title}>DUA LIBRARY</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={12} color="#333" />
        <TextInput
          style={styles.input}
          placeholder="SEARCH DUA..."
          placeholderTextColor="#222"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chipContent}>
        {DUA_CATEGORIES.map(c => (
          <CategoryChip key={c.id} item={c} active={cat === c.id} onPress={() => setCat(c.id)} />
        ))}
      </ScrollView>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={filtered}
          keyExtractor={d => d.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 24 },
  headerTitle: { alignItems: 'center' },
  microHeader: { color: THEME.gold, fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  title: { color: THEME.white, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#111' },

  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#050505', borderRadius: 8, marginHorizontal: 24, paddingHorizontal: 16, height: 40, borderWidth: 1, borderColor: '#111', marginBottom: 16 },
  input: { flex: 1, color: THEME.white, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginLeft: 10 },

  chipScroll: { marginBottom: 20, maxHeight: 40 },
  chipContent: { paddingHorizontal: 24 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#0A0A0A', marginRight: 8, borderWidth: 1, borderColor: '#111' },
  chipActive: { backgroundColor: THEME.gold, borderColor: THEME.gold },
  chipText: { color: '#444', fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  chipTextActive: { color: '#000' },

  list: { paddingHorizontal: 24, paddingBottom: 100 },
  card: { backgroundColor: '#070707', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#111' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { color: THEME.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  arabic: { color: THEME.white, fontSize: 22, textAlign: 'right', lineHeight: 40, marginBottom: 16 },
  translation: { color: '#666', fontSize: 13, lineHeight: 20, fontStyle: 'italic', marginBottom: 16 },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#111', paddingTop: 12 },
  microLabel: { color: THEME.gold, fontSize: 7, fontWeight: '900', letterSpacing: 1 },
});
