import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import HabitsScreen from '../screens/HabitsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import PrayerTimesScreen from '../screens/PrayerTimesScreen';
import IslamicCalendarScreen from '../screens/IslamicCalendarScreen';
import AzkarScreen from '../screens/AzkarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TasbihScreen from '../screens/TasbihScreen';
import QiblaScreen from '../screens/QiblaScreen';
import HadithScreen from '../screens/HadithScreen';
import JournalScreen from '../screens/JournalScreen';
import NamesOfAllahScreen from '../screens/NamesOfAllahScreen';
import DailySunnahsScreen from '../screens/DailySunnahsScreen';
import ZakatCalculatorScreen from '../screens/ZakatCalculatorScreen';
import useAuthStore from '../store/useAuthStore';
import { THEME } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F8F9FA',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          elevation: 0, // No shadow for clean look
        },
        tabBarActiveTintColor: THEME.gold,
        tabBarInactiveTintColor: '#DDDDDD',
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen 
        name="Sunnahs" 
        component={DailySunnahsScreen} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "leaf" : "leaf-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={IslamicCalendarScreen} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "analytics" : "analytics-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoaded } = useAuthStore();

  if (!isLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Azkar" component={AzkarScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Tasbih" component={TasbihScreen} />
            <Stack.Screen name="Qibla" component={QiblaScreen} />
            <Stack.Screen name="Hadith" component={HadithScreen} />
            <Stack.Screen name="Journal" component={JournalScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
