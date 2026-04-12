// src/screens/InsightsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getInsights } from '../services/api';

const CARDS = [
  { key: 'profile_views',      label: 'Profile Views',      icon: '👁️',  bg: '#EFF6FF', accent: '#3B82F6', trend: '+12%' },
  { key: 'search_views',       label: 'Search Views',       icon: '🔍',  bg: '#F0FDF4', accent: '#22C55E', trend: '+8%'  },
  { key: 'website_clicks',     label: 'Website Clicks',     icon: '🌐',  bg: '#FFFBEB', accent: '#F59E0B', trend: '+5%'  },
  { key: 'phone_calls',        label: 'Phone Calls',        icon: '📞',  bg: '#FFF1F2', accent: '#F43F5E', trend: '+3%'  },
  { key: 'direction_requests', label: 'Direction Requests', icon: '📍',  bg: '#F5F3FF', accent: '#8B5CF6', trend: '+7%'  },
];

const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : (n ?? 0).toString();

export default function InsightsScreen() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(true);

  const fetch = async () => {
    try {
      setError(null);
      const res = await getInsights();
      setInsights(res.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={s.loadTxt}>Loading insights…</Text>
    </View>
  );

  if (error) return (
    <View style={s.center}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>⚠️</Text>
      <Text style={s.errTitle}>Failed to load</Text>
      <Text style={s.errMsg}>{error}</Text>
      <TouchableOpacity style={s.retryBtn} onPress={fetch}>
        <Text style={s.retryTxt}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const totalViews = (insights?.profile_views ?? 0) + (insights?.search_views ?? 0);
  const totalActions = (insights?.website_clicks ?? 0) + (insights?.phone_calls ?? 0) + (insights?.direction_requests ?? 0);
  const conversion = totalViews ? ((totalActions / totalViews) * 100).toFixed(1) : '0';

  const chartData = {
    labels: ['Profile', 'Search', 'Website', 'Calls', 'Directions'],
    datasets: [{ data: CARDS.map(c => insights?.[c.key] ?? 0) }],
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

      {/* KPI row */}
      <View style={s.kpiRow}>
        {[
          { label: 'Total Views', value: fmt(totalViews), icon: '👁️', color: '#3B82F6' },
          { label: 'Total Actions', value: fmt(totalActions), icon: '⚡', color: '#22C55E' },
          { label: 'Conversion Rate', value: conversion + '%', icon: '📈', color: '#F59E0B' },
        ].map(k => (
          <View key={k.label} style={s.kpiCard}>
            <View style={[s.kpiIcon, { backgroundColor: k.color + '18' }]}>
              <Text style={{ fontSize: 22 }}>{k.icon}</Text>
            </View>
            <Text style={s.kpiValue}>{k.value}</Text>
            <Text style={s.kpiLabel}>{k.label}</Text>
          </View>
        ))}
      </View>

      {/* Metric cards */}
      <Text style={s.sectionTitle}>Detailed Metrics</Text>
      <View style={s.grid}>
        {CARDS.map(card => {
          const val = insights?.[card.key] ?? 0;
          const pct = Math.min((val / 1500) * 100, 100);
          return (
            <View key={card.key} style={[s.metricCard, { backgroundColor: card.bg }]}>
              <View style={s.metricTop}>
                <View style={[s.metricIconBox, { backgroundColor: card.accent + '20' }]}>
                  <Text style={{ fontSize: 20 }}>{card.icon}</Text>
                </View>
                <View style={[s.trendBadge, { backgroundColor: card.accent + '18' }]}>
                  <Text style={[s.trendText, { color: card.accent }]}>{card.trend}</Text>
                </View>
              </View>
              <Text style={[s.metricVal, { color: card.accent }]}>{fmt(val)}</Text>
              <Text style={s.metricLabel}>{card.label}</Text>
              <View style={s.bar}>
                <View style={[s.barFill, { width: `${pct}%`, backgroundColor: card.accent }]} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Chart */}
      <View style={s.chartCard}>
        <View style={s.chartHeader}>
          <Text style={s.sectionTitle}>Metrics Overview</Text>
          <TouchableOpacity style={s.toggleBtn} onPress={() => setShowChart(v => !v)}>
            <Text style={s.toggleTxt}>{showChart ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {showChart && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={chartData}
              width={560}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (o = 1) => `rgba(59,130,246,${o})`,
                labelColor: () => '#64748B',
                propsForBackgroundLines: { stroke: '#F1F5F9' },
              }}
              style={{ borderRadius: 12 }}
              showValuesOnTopOfBars
              fromZero
            />
          </ScrollView>
        )}
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { padding: 24, paddingBottom: 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadTxt: { marginTop: 12, color: '#64748B', fontSize: 14 },
  errTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  errMsg: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  retryTxt: { color: '#fff', fontWeight: '600' },

  kpiRow: { flexDirection: 'row', gap: 16, marginBottom: 28 },
  kpiCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  kpiIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  kpiValue: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  kpiLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 14 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 28 },
  metricCard: {
    width: 'calc(20% - 12px)', minWidth: 160,
    borderRadius: 16, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  metricIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  trendBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  trendText: { fontSize: 11, fontWeight: '700' },
  metricVal: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  metricLabel: { fontSize: 13, color: '#475569', fontWeight: '500', marginBottom: 12 },
  bar: { height: 4, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },

  chartCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  toggleBtn: { backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  toggleTxt: { color: '#3B82F6', fontSize: 13, fontWeight: '600' },
});
