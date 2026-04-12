// src/screens/ReviewsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TouchableOpacity, RefreshControl, StatusBar,
} from 'react-native';
import { getReviews } from '../services/api';
import { colors, spacing, borderRadius, typography, shadow } from '../theme';

const StarRating = ({ rating, size = 14 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={{ fontSize: size, color: i <= rating ? colors.star : colors.starEmpty }}>
        ★
      </Text>
    );
  }
  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const AVATAR_COLORS = ['#1A73E8', '#34A853', '#FBBC04', '#EA4335', '#A142F4', '#00BCD4', '#FF5722', '#607D8B'];

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < (name?.length ?? 0); i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ReviewCard = ({ item }) => {
  const avatarColor = getAvatarColor(item.name);
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.reviewerName}>{item.name}</Text>
          <View style={styles.ratingDateRow}>
            <StarRating rating={item.rating} />
            <Text style={styles.ratingNum}>{item.rating}.0</Text>
            <Text style={styles.dateDot}>·</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );
};

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filterRating, setFilterRating] = useState(0); // 0 = all

  const fetchReviews = async () => {
    try {
      setError(null);
      const res = await getReviews();
      setReviews(res.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchReviews(); };

  const filteredReviews = filterRating === 0
    ? reviews
    : reviews.filter(r => r.rating === filterRating);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Failed to load reviews</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchReviews}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ListHeader = () => (
    <View>
      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.avgRating}>{avgRating}</Text>
          <StarRating rating={Math.round(parseFloat(avgRating))} size={20} />
          <Text style={styles.totalReviews}>{reviews.length} reviews</Text>
        </View>
        <View style={styles.summaryRight}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter(r => r.rating === star).length;
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <View key={star} style={styles.barRow}>
                <Text style={styles.barLabel}>{star}★</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.barCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {[0, 5, 4, 3, 2, 1].map(star => (
          <TouchableOpacity
            key={star}
            style={[styles.chip, filterRating === star && styles.chipActive]}
            onPress={() => setFilterRating(star)}
            activeOpacity={0.7}>
            <Text style={[styles.chipText, filterRating === star && styles.chipTextActive]}>
              {star === 0 ? 'All' : `${star}★`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.reviewCount}>
        {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
        {filterRating > 0 ? ` for ${filterRating}★` : ''}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <FlatList
        data={filteredReviews}
        keyExtractor={(item, idx) => item._id ?? String(idx)}
        renderItem={({ item }) => <ReviewCard item={item} />}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>No reviews found</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      />
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

  list: { padding: spacing.lg, paddingTop: spacing.md },

  summaryCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, ...shadow.sm,
    padding: spacing.md, flexDirection: 'row', marginBottom: spacing.md,
  },
  summaryLeft: { alignItems: 'center', marginRight: spacing.lg, justifyContent: 'center' },
  avgRating: { fontSize: 48, fontWeight: '700', color: colors.textPrimary, lineHeight: 56 },
  totalReviews: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  summaryRight: { flex: 1, justifyContent: 'center' },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  barLabel: { ...typography.caption, color: colors.textSecondary, width: 22 },
  barTrack: { flex: 1, height: 8, backgroundColor: colors.divider, borderRadius: 4, marginHorizontal: 6, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.star, borderRadius: 4 },
  barCount: { ...typography.caption, color: colors.textSecondary, width: 20, textAlign: 'right' },

  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: 6,
    borderRadius: borderRadius.full, backgroundColor: colors.surface,
    borderWidth: 1.5, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.label, color: colors.textSecondary },
  chipTextActive: { color: colors.textOnPrimary },

  reviewCount: { ...typography.body2, color: colors.textSecondary, marginBottom: spacing.sm },

  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, ...shadow.sm,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  avatarText: { ...typography.h4, color: colors.textOnPrimary },
  cardMeta: { flex: 1 },
  reviewerName: { ...typography.h4, color: colors.textPrimary, marginBottom: 2 },
  ratingDateRow: { flexDirection: 'row', alignItems: 'center' },
  ratingNum: { ...typography.caption, color: colors.textSecondary, marginLeft: 4, fontWeight: '600' },
  dateDot: { ...typography.caption, color: colors.textTertiary, marginHorizontal: 4 },
  date: { ...typography.caption, color: colors.textTertiary },
  comment: { ...typography.body2, color: colors.textSecondary, lineHeight: 22 },

  emptyContainer: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { ...typography.body1, color: colors.textSecondary },
});
