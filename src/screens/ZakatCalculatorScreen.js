import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export default function ZakatCalculatorScreen() {
  const [cash, setCash] = useState('');
  const [gold, setGold] = useState('');
  const [silver, setSilver] = useState('');
  const [investments, setInvestments] = useState('');
  const [debts, setDebts] = useState('');
  const [totalZakat, setTotalZakat] = useState(0);

  useEffect(() => {
    const assets = (parseFloat(cash) || 0) + (parseFloat(gold) || 0) + (parseFloat(silver) || 0) + (parseFloat(investments) || 0);
    const liability = (parseFloat(debts) || 0);
    const netAssets = assets - liability;
    
    if (netAssets > 0) {
      setTotalZakat(netAssets * 0.025);
    } else {
      setTotalZakat(0);
    }
  }, [cash, gold, silver, investments, debts]);

  const InputField = ({ label, value, onChange, icon }) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={18} color={THEME.gold} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="numeric"
          value={value}
          onChangeText={onChange}
          placeholderTextColor="#CCC"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.micro}>FINANCIAL OBLIGATION</Text>
        <Text style={styles.title}>Zakat Calculator</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>TOTAL ZAKAT DUE</Text>
          <Text style={styles.resultValue}>{totalZakat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <Text style={styles.resultSub}>2.5% of your net wealth</Text>
        </View>

        <View style={styles.form}>
          <InputField label="CASH & SAVINGS" value={cash} onChange={setCash} icon="cash-outline" />
          <InputField label="GOLD VALUE" value={gold} onChange={setGold} icon="diamond-outline" />
          <InputField label="SILVER VALUE" value={silver} onChange={setSilver} icon="medal-outline" />
          <InputField label="INVESTMENTS" value={investments} onChange={setInvestments} icon="trending-up-outline" />
          <InputField label="DEBTS TO PAY" value={debts} onChange={setDebts} icon="alert-circle-outline" />
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#888" />
          <Text style={styles.infoText}>
            Nisab is the minimum amount of wealth a Muslim must possess before they become eligible to pay Zakat. Please check current market rates for Gold/Silver Nisab.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 24, paddingVertical: 20 },
  micro: { color: THEME.gold, fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  title: { color: '#000', fontSize: 32, fontWeight: '900', letterSpacing: -1, marginTop: 4 },
  
  scroll: { paddingHorizontal: 24 },
  resultCard: { 
    backgroundColor: THEME.gold, 
    padding: 32, 
    borderRadius: 24, 
    alignItems: 'center', 
    marginBottom: 32,
    shadowColor: THEME.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8
  },
  resultLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  resultValue: { color: '#FFF', fontSize: 42, fontWeight: '900', marginVertical: 8 },
  resultSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },

  form: { gap: 20 },
  inputWrapper: {},
  inputLabel: { fontSize: 10, fontWeight: '900', color: '#AAA', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#EEE',
    paddingHorizontal: 16,
    height: 60
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 18, fontWeight: '700', color: '#000' },

  infoBox: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderRadius: 16, 
    marginTop: 32, 
    borderWidth: 1, 
    borderColor: '#EEE',
    gap: 12
  },
  infoText: { flex: 1, fontSize: 12, color: '#888', lineHeight: 18, fontWeight: '500' }
});
