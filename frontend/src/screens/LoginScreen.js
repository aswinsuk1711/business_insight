// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, Platform,
} from 'react-native';
import { login, saveToken } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      await saveToken(res.data.token);
      setToken(res.data.token);
    } catch (err) {
      if (Platform.OS === 'web') {
        alert('Login Failed: ' + (err.message || 'Invalid credentials'));
      } else {
        Alert.alert('Login Failed', err.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* Left panel */}
      <View style={styles.leftPanel}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}><Text style={{ fontSize: 28 }}>📊</Text></View>
          <Text style={styles.brandName}>BizInsights</Text>
        </View>
        <Text style={styles.heroTitle}>Understand your{'\n'}business better.</Text>
        <Text style={styles.heroSub}>
          Real-time analytics, customer reviews, and business intelligence — all in one place.
        </Text>
        <View style={styles.featureList}>
          {['📈  Live performance metrics', '⭐  Customer review insights', '🗺️  Location & call tracking'].map(f => (
            <View key={f} style={styles.featureItem}>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Right panel */}
      <View style={styles.rightPanel}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back 👋</Text>
          <Text style={styles.cardSub}>Sign in to your dashboard</Text>

          {/* Demo hint */}
          <View style={styles.demoBox}>
            <Text style={styles.demoText}>🔑  admin@business.com  /  password123</Text>
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputRow, errors.email && styles.inputErr]}>
              <Text style={styles.inputEmoji}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="admin@business.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={t => { setEmail(t); setErrors(p => ({ ...p, email: null })); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errText}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputRow, errors.password && styles.inputErr]}>
              <Text style={styles.inputEmoji}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={t => { setPassword(t); setErrors(p => ({ ...p, password: null })); }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                <Text style={{ fontSize: 16 }}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.btnText}>Sign In →</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: '#0F172A', minHeight: '100vh' },

  leftPanel: {
    flex: 1, backgroundColor: '#0F172A',
    padding: 56, justifyContent: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 48 },
  brandIcon: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  brandName: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  heroTitle: { fontSize: 44, fontWeight: '800', color: '#FFFFFF', lineHeight: 52, marginBottom: 16, letterSpacing: -1 },
  heroSub: { fontSize: 16, color: '#94A3B8', lineHeight: 26, marginBottom: 40, maxWidth: 380 },
  featureList: { gap: 12 },
  featureItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  featureText: { color: '#CBD5E1', fontSize: 14, fontWeight: '500' },

  rightPanel: {
    width: 480, backgroundColor: '#F8FAFC',
    justifyContent: 'center', alignItems: 'center', padding: 40,
  },
  card: {
    width: '100%', backgroundColor: '#FFFFFF',
    borderRadius: 24, padding: 36,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 24, elevation: 8,
  },
  cardTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  cardSub: { fontSize: 14, color: '#64748B', marginBottom: 24 },

  demoBox: {
    backgroundColor: '#EFF6FF', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14, marginBottom: 24,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  demoText: { fontSize: 12, color: '#2563EB', fontWeight: '500' },

  field: { marginBottom: 18 },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    paddingHorizontal: 14, height: 50,
  },
  inputErr: { borderColor: '#EF4444' },
  inputEmoji: { fontSize: 15, marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: '#0F172A', outlineStyle: 'none' },
  errText: { fontSize: 11, color: '#EF4444', marginTop: 4 },

  btn: {
    backgroundColor: '#3B82F6', borderRadius: 12,
    height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 8,
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
});
