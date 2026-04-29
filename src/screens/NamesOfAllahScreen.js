import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { ALLAH_NAMES } from '../constants/namesOfAllah'; // Refresh trigger

const NameCard = ({ name }) => (
  <View style={styles.card}>
    <View style={styles.idBadge}>
      <Text style={styles.idText}>{name.id}</Text>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.arabic}>{name.arabic}</Text>
      <View style={styles.textDetails}>
        <Text style={styles.transliteration}>{name.transliteration}</Text>
        <Text style={styles.translation}>{name.translation}</Text>
      </View>
    </View>
  </View>
);

export default function NamesOfAllahScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>99 Names of Allah</Text>
        <Text style={styles.subtitle}>AL-ASMA-UL-HUSNA</Text>
        <Text style={styles.description}>"To Allah belong the Most Beautiful Names, so call upon Him by them." (Quran 7:180)</Text>
      </View>

      <FlatList
        data={ALLAH_NAMES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <NameCard name={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#000', letterSpacing: 0.5, textAlign: 'center' },
  subtitle: { fontSize: 10, color: THEME.gold, fontWeight: '800', letterSpacing: 6, marginTop: 8, textTransform: 'uppercase', textAlign: 'center' },
  description: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 12, paddingHorizontal: 20, fontStyle: 'italic', lineHeight: 18 },
  list: { padding: 20 },
  card: {
    backgroundColor: '#FFF',
    marginBottom: 15,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden'
  },
  cardContent: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  textDetails: { flex: 1, alignItems: 'flex-start' },
  idBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: THEME.gold + '15', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  idText: { fontSize: 10, fontWeight: '900', color: THEME.gold },
  arabic: { fontSize: 32, fontWeight: '700', color: '#000', marginLeft: 20 },
  transliteration: { fontSize: 16, fontWeight: '800', color: THEME.gold, marginBottom: 2 },
  translation: { fontSize: 12, color: '#666', fontWeight: '600' },
});
