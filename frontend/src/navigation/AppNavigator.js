// src/navigation/AppNavigator.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import InsightsScreen from '../screens/InsightsScreen';
import BusinessScreen from '../screens/BusinessScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

const NAV_ITEMS = [
  { key: 'Insights',  label: 'Insights',  icon: '📊' },
  { key: 'Business',  label: 'Business',  icon: '🏢' },
  { key: 'Reviews',   label: 'Reviews',   icon: '⭐' },
];

function SidebarLayout({ onLogout }) {
  const [active, setActive] = useState('Insights');

  const renderScreen = () => {
    if (active === 'Insights') return <InsightsScreen />;
    if (active === 'Business') return <BusinessScreen />;
    return <ReviewsScreen />;
  };

  return (
    <View style={styles.shell}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarLogo}>
          <View style={styles.logoCircle}><Text style={styles.logoEmoji}>📊</Text></View>
          <Text style={styles.logoText}>BizInsights</Text>
        </View>

        <View style={styles.navList}>
          {NAV_ITEMS.map(item => (
            <TouchableOpacity
              key={item.key}
              style={[styles.navItem, active === item.key && styles.navItemActive]}
              onPress={() => setActive(item.key)}
              activeOpacity={0.8}>
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, active === item.key && styles.navLabelActive]}>
                {item.label}
              </Text>
              {active === item.key && <View style={styles.navIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.topBarTitle}>{NAV_ITEMS.find(n => n.key === active)?.label}</Text>
            <Text style={styles.topBarSub}>ABC Salon · Hyderabad</Text>
          </View>
          <View style={styles.topBarRight}>
            <View style={styles.avatarBadge}><Text style={styles.avatarBadgeText}>A</Text></View>
          </View>
        </View>
        <View style={styles.screenWrap}>{renderScreen()}</View>
      </View>
    </View>
  );
}

export default function AppNavigator() {
  const { token, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashIcon}>📊</Text>
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 16 }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Main">{() => <SidebarLayout onLogout={logout} />}</Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' },
  splashIcon: { fontSize: 64 },

  shell: { flex: 1, flexDirection: 'row', backgroundColor: '#F1F5F9' },

  sidebar: {
    width: 240, backgroundColor: '#0F172A',
    paddingTop: 24, paddingBottom: 24,
    justifyContent: 'space-between',
  },
  sidebarLogo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 32 },
  logoCircle: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  logoEmoji: { fontSize: 20 },
  logoText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },

  navList: { flex: 1, paddingHorizontal: 12 },
  navItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 12, marginBottom: 4, position: 'relative',
  },
  navItemActive: { backgroundColor: 'rgba(59,130,246,0.15)' },
  navIcon: { fontSize: 18, marginRight: 12 },
  navLabel: { fontSize: 14, fontWeight: '500', color: '#94A3B8' },
  navLabelActive: { color: '#3B82F6', fontWeight: '600' },
  navIndicator: {
    position: 'absolute', right: 0, top: '25%',
    width: 3, height: '50%', backgroundColor: '#3B82F6', borderRadius: 2,
  },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 12, paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 12, backgroundColor: 'rgba(239,68,68,0.1)',
  },
  logoutIcon: { fontSize: 16, marginRight: 10 },
  logoutText: { fontSize: 14, fontWeight: '600', color: '#EF4444' },

  content: { flex: 1, flexDirection: 'column' },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFFFFF', paddingHorizontal: 28, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  topBarTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  topBarSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  topBarRight: { flexDirection: 'row', alignItems: 'center' },
  avatarBadge: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center',
  },
  avatarBadgeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },

  screenWrap: { flex: 1 },
});
