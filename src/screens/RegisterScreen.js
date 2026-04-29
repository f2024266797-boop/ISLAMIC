import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, Animated, StatusBar, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import useAuthStore from '../store/useAuthStore';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Incomplete', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);
    if (!res.success) Alert.alert('Error', res.message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            
            <View style={styles.header}>
              <Text style={styles.micro}>NEW IDENTITY</Text>
              <Text style={styles.title}>NEXUS</Text>
              <Text style={styles.subTitle}>Create your spiritual profile</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>FULL NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="NAME"
                  placeholderTextColor="#DDD"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>IDENTIFIER</Text>
                <TextInput
                  style={styles.input}
                  placeholder="EMAIL"
                  placeholderTextColor="#DDD"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>CREDENTIAL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="PASSWORD"
                  placeholderTextColor="#DDD"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.primeBtn} onPress={handleRegister} activeOpacity={0.8} disabled={loading}>
                <Text style={styles.primeText}>{loading ? 'INITIALIZING...' : 'CREATE IDENTITY'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.secText}>ALREADY REGISTERED? SIGN IN</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>v2.0.5 • ENCRYPTED GATEWAY</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { flexGrow: 1, padding: 40, justifyContent: 'center' },
  content: { flex: 1 },
  
  header: { marginBottom: 64 },
  micro: { color: THEME.gold, fontSize: 10, fontWeight: '900', letterSpacing: 4 },
  title: { color: '#000', fontSize: 44, fontWeight: '900', letterSpacing: -2, marginTop: 8 },
  subTitle: { color: '#AAA', fontSize: 14, fontWeight: '500', marginTop: 4 },

  form: { width: '100%' },
  inputBox: { marginBottom: 32 },
  label: { color: '#DDD', fontSize: 9, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  input: { 
    height: 48, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', 
    color: '#000', fontSize: 14, fontWeight: '700', letterSpacing: 0.5
  },
  
  primeBtn: { 
    height: 60, backgroundColor: THEME.gold, borderRadius: 30, 
    alignItems: 'center', justifyContent: 'center', marginTop: 24,
    ...THEME.shadow.premium
  },
  primeText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  
  secBtn: { alignItems: 'center', marginTop: 40 },
  secText: { color: '#AAA', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  
  footer: { position: 'absolute', bottom: 0, width: '100%', alignItems: 'center' },
  footerText: { color: '#EEE', fontSize: 8, fontWeight: '900', letterSpacing: 2 },
});
