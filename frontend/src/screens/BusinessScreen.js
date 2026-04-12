// src/screens/BusinessScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
  TouchableOpacity, RefreshControl, Linking, StatusBar,
} from 'react-native';
import { getBusiness } from '../services/api';
import { colors, spacing, borderRadius, typography, shadow } from '../theme';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={{ fontSize: 18, color: i <= Math.round(rating) ? colors.star : colors.starEmpty }}>
        ★
      </Text>
    );
  }
  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};

const InfoRow = ({ icon, label, value, onPress, tappable }) => (
  <TouchableOpacity
    style={styles.infoRow}
    onPress={onPress}
    disabled={!tappable}
    activeOpacity={tappable ? 0.6 : 1}>
    <View style={styles.infoIconBox}>
      <Text style={styles.infoIcon}>{icon}</Text>
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, tappable && { color: colors.primary }]}>{value}</Text>
    </View>
    {tappable && <Text style={styles.chevron}>›</Text>}
  </TouchableOpacity>
);

export default function BusinessScreen() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchBusiness = async () => {
    try {
      setError(null);
      const res = await getBusiness();
      setBusiness(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBusiness(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchBusiness(); };

  const handleCall = () => {
    if (business?.phone) Linking.openURL(`tel:${business.phone}`);
  };

  const handleMap = () => {
    if (business?.address) {
      const query = encodeURIComponent(business.address);
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Failed to load business</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchBusiness}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}>

        {/* Hero Banner */}
        <View style={styles.hero}>
          <View style={styles.businessAvatar}>
            <Text style={styles.avatarText}>
              {business?.name?.charAt(0) ?? 'B'}
            </Text>
          </View>
          <Text style={styles.businessName}>{business?.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{business?.category}</Text>
          </View>
          <View style={styles.ratingRow}>
            <StarRating rating={business?.rating ?? 0} />
            <Text style={styles.ratingText}>{business?.rating?.toFixed(1)}</Text>
          </View>
          <Text style={styles.reviewCount}>{business?.total_reviews} reviews</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCall} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionLabel}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleMap} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionLabel}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>↗️</Text>
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.infoCard}>
            <InfoRow
              icon="🏢"
              label="Business Name"
              value={business?.name}
            />
            <View style={styles.divider} />
            <InfoRow
              icon="🏷️"
              label="Category"
              value={business?.category}
            />
            <View style={styles.divider} />
            <InfoRow
              icon="📍"
              label="Address"
              value={business?.address}
              onPress={handleMap}
              tappable
            />
            <View style={styles.divider} />
            <InfoRow
              icon="📞"
              label="Phone Number"
              value={business?.phone}
              onPress={handleCall}
              tappable
            />
          </View>
        </View>

        {/* Rating Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating Summary</Text>
          <View style={styles.ratingCard}>
            <View style={styles.ratingBig}>
              <Text style={styles.ratingNumber}>{business?.rating?.toFixed(1)}</Text>
              <StarRating rating={business?.rating ?? 0} />
              <Text style={styles.ratingSubtext}>
                Based on {business?.total_reviews} reviews
              </Text>
            </View>
            <View style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = star === 5 ? 55 : star === 4 ? 25 : star === 3 ? 12 : star === 2 ? 5 : 3;
                return (
                  <View key={star} style={styles.ratingBarRow}>
                    <Text style={styles.ratingBarLabel}>{star}★</Text>
                    <View style={styles.ratingBarTrack}>
                      <View style={[styles.ratingBarFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.ratingBarPct}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  loadingText: { ...typography.body2, color: colors.textSecondary, marginTop: spacing.md },
  errorIcon: { fontSize: 48, marginBottom: spacing.md },
  errorTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  errorMsg: { ...typography.body2, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  retryBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  retryText: { ...typography.button, color: colors.textOnPrimary },

  hero: {
    backgroundColor: colors.primary, alignItems: 'center',
    paddingTop: spacing.xl, paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg,
  },
  businessAvatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center',
    alignItems: 'center', marginBottom: spacing.md, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: 36, color: colors.textOnPrimary, fontWeight: '700' },
  businessName: { ...typography.h1, color: colors.textOnPrimary, textAlign: 'center', marginBottom: spacing.sm },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md, paddingVertical: 4, marginBottom: spacing.sm,
  },
  categoryText: { ...typography.label, color: colors.textOnPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingText: { ...typography.h3, color: colors.textOnPrimary, marginLeft: spacing.sm },
  reviewCount: { ...typography.body2, color: 'rgba(255,255,255,0.75)' },

  actionsRow: {
    flexDirection: 'row', marginHorizontal: spacing.lg,
    marginTop: -spacing.md, marginBottom: spacing.lg,
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, ...shadow.md,
    overflow: 'hidden',
  },
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  actionIcon: { fontSize: 22, marginBottom: 4 },
  actionLabel: { ...typography.label, color: colors.textSecondary },

  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  infoCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, ...shadow.sm, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  infoIconBox: {
    width: 36, height: 36, borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  infoIcon: { fontSize: 16 },
  infoContent: { flex: 1 },
  infoLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { ...typography.body1, color: colors.textPrimary, fontWeight: '500' },
  chevron: { fontSize: 20, color: colors.textTertiary },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: spacing.md + 36 + spacing.md },

  ratingCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, ...shadow.sm,
    padding: spacing.md, flexDirection: 'row', alignItems: 'center',
  },
  ratingBig: { alignItems: 'center', marginRight: spacing.lg },
  ratingNumber: { fontSize: 48, fontWeight: '700', color: colors.textPrimary, lineHeight: 56 },
  ratingSubtext: { ...typography.caption, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  ratingBars: { flex: 1 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ratingBarLabel: { ...typography.caption, color: colors.textSecondary, width: 24 },
  ratingBarTrack: { flex: 1, height: 8, backgroundColor: colors.divider, borderRadius: 4, marginHorizontal: spacing.sm, overflow: 'hidden' },
  ratingBarFill: { height: '100%', backgroundColor: colors.star, borderRadius: 4 },
  ratingBarPct: { ...typography.caption, color: colors.textSecondary, width: 28, textAlign: 'right' },
});
