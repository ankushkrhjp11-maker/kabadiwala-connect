import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '../components/Screen';
import {
  Button,
  Card,
  Chip,
  StateView,
} from '../components/UI';

import type { AppRoute } from '../navigation/types';
import type { LocalLot } from '../database/database';
import { getLots } from '../database/database';

import {
  colors,
  spacing,
  typography,
} from '../theme';

type MyLotsScreenProps = {
  onNavigate: (route: AppRoute) => void;
  onBack: () => void;
};

function getStatusText(status: LocalLot['status']) {
  switch (status) {
    case 'AVAILABLE':
      return 'Available';

    case 'SOLD':
      return 'Sold';

    case 'PENDING_SYNC':
      return 'Pending sync';

    default:
      return 'Pending';
  }
}

function getStatusColors(status: LocalLot['status']) {
  switch (status) {
    case 'AVAILABLE':
      return {
        background: '#E8F7EE',
        text: '#18864B',
      };

    case 'SOLD':
      return {
        background: '#EEF1F5',
        text: '#626B78',
      };

    case 'PENDING_SYNC':
      return {
        background: '#FFF4DD',
        text: '#A86B00',
      };

    default:
      return {
        background: '#EEF1F5',
        text: '#626B78',
      };
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatValue(value: number) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function MyLotsScreen({
  onNavigate,
  onBack,
}: MyLotsScreenProps) {
  const [lots, setLots] = useState<LocalLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadLots() {
    try {
      setLoading(true);
      setError(false);

      const result = await getLots();

      setLots(result);
    } catch (err) {
      console.error('Failed to load lots:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLots();
  }, []);

  /* =====================================================
     LOADING STATE
     ===================================================== */

  if (loading) {
    return (
      <Screen
        title="My lots"
        subtitle="Your saved collection records."
        showBack
        onBack={onBack}
      >
        <StateView
          icon="▱"
          title="Loading your lots"
          message="Reading your saved collection records..."
          loading
        />
      </Screen>
    );
  }

  /* =====================================================
     ERROR STATE
     ===================================================== */

  if (error) {
    return (
      <Screen
        title="My lots"
        subtitle="Your saved collection records."
        showBack
        onBack={onBack}
      >
        <StateView
          icon="!"
          title="Couldn't load your lots"
          message="Something went wrong while reading your saved lots."
          action={
            <Button
              label="Try again"
              onPress={loadLots}
            />
          }
        />
      </Screen>
    );
  }

  /* =====================================================
     MAIN SCREEN
     ===================================================== */

  return (
    <Screen
      title="My lots"
      subtitle="Your saved collection records."
      showBack
      onBack={onBack}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header summary */}
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.eyebrow}>
              COLLECTION
            </Text>

            <Text style={styles.heading}>
              Your e-waste lots
            </Text>

            <Text style={styles.subheading}>
              Keep track of everything you collect.
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.count}>
              {lots.length}
            </Text>

            <Text style={styles.countLabel}>
              LOTS
            </Text>
          </View>
        </View>

        {/* Empty state */}
        {lots.length === 0 ? (
          <Card accent>
            <View style={styles.emptyContent}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyEmoji}>
                  📦
                </Text>
              </View>

              <Text style={styles.emptyTitle}>
                No lots yet
              </Text>

              <Text style={styles.emptyMessage}>
                Start by creating your first collection
                lot. Your records will be stored safely
                on your phone.
              </Text>

              <Button
                icon="＋"
                label="Create your first lot"
                onPress={() =>
                  onNavigate('createLot')
                }
              />
            </View>
          </Card>
        ) : (
          <>
            {/* Statistics */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>
                  TOTAL LOTS
                </Text>

                <Text style={styles.statNumber}>
                  {lots.length}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>
                  TOTAL WEIGHT
                </Text>

                <Text style={styles.statNumber}>
                  {lots
                    .reduce(
                      (sum, lot) =>
                        sum + lot.weightKg,
                      0,
                    )
                    .toFixed(1)}
                  kg
                </Text>
              </View>
            </View>

            {/* Section heading */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Recent lots
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Your latest collection records
                </Text>
              </View>

              <Chip>
                {`${lots.length} saved`}
              </Chip>
            </View>

            {/* Lots */}
            {lots.map((lot) => {
              const status =
                getStatusColors(lot.status);

              return (
                <Card key={lot.id}>
                  {/* Lot heading */}
                  <View style={styles.lotHeader}>
                    <View style={styles.materialRow}>
                      <View style={styles.materialIcon}>
                        <Text
                          style={
                            styles.materialEmoji
                          }
                        >
                          {lot.materialIcon}
                        </Text>
                      </View>

                      <View style={styles.materialInfo}>
                        <Text
                          style={
                            styles.materialName
                          }
                        >
                          {lot.materialName}
                        </Text>

                        <Text style={styles.reference}>
                          {lot.reference}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            status.background,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor:
                              status.text,
                          },
                        ]}
                      />

                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: status.text,
                          },
                        ]}
                      >
                        {getStatusText(
                          lot.status,
                        )}
                      </Text>
                    </View>
                  </View>

                  {/* Main information */}
                  <View style={styles.infoBox}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>
                        WEIGHT
                      </Text>

                      <Text style={styles.infoValue}>
                        {lot.weightKg.toFixed(1)} kg
                      </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>
                        ESTIMATED VALUE
                      </Text>

                      <Text style={styles.infoValue}>
                        {formatValue(
                          lot.estimatedLow,
                        )}{' '}
                        –{' '}
                        {formatValue(
                          lot.estimatedHigh,
                        )}
                      </Text>
                    </View>
                  </View>

                  {/* Date */}
                  <View style={styles.dateRow}>
                    <Text style={styles.dateIcon}>
                      🗓
                    </Text>

                    <View>
                      <Text style={styles.dateLabel}>
                        Collected on
                      </Text>

                      <Text style={styles.dateValue}>
                        {formatDate(
                          lot.collectionDate,
                        )}
                      </Text>
                    </View>
                  </View>

                  {/* Sync status */}
                  <View style={styles.bottomRow}>
                    <View style={styles.syncRow}>
                      <View
                        style={[
                          styles.syncDot,
                          {
                            backgroundColor:
                              lot.synced === 1
                                ? '#18864B'
                                : '#D99100',
                          },
                        ]}
                      />

                      <Text style={styles.syncText}>
                        {lot.synced === 1
                          ? 'Synced'
                          : 'Saved offline'}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => {
                        console.log(
                          'Lot selected:',
                          lot.id,
                        );
                      }}
                      style={({ pressed }) => [
                        styles.detailsButton,
                        pressed &&
                          styles.pressed,
                      ]}
                    >
                      <Text
                        style={
                          styles.detailsText
                        }
                      >
                        Details →
                      </Text>
                    </Pressable>
                  </View>
                </Card>
              );
            })}

            {/* Offline information */}
            <View style={styles.offlineBox}>
              <View style={styles.offlineIcon}>
                <Text style={styles.offlineIconText}>
                  ✓
                </Text>
              </View>

              <View style={styles.offlineContent}>
                <Text style={styles.offlineTitle}>
                  Your data is safe offline
                </Text>

                <Text style={styles.offlineText}>
                  Collection records are stored on this
                  phone and can be synchronized when
                  internet is available.
                </Text>
              </View>
            </View>

            {/* Create another */}
            <Button
              icon="＋"
              label="Create new lot"
              onPress={() =>
                onNavigate('createLot')
              }
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  /* =========================
     SCREEN CONTENT
  ========================= */

  content: {
    paddingBottom: 48,
  },

  /* =========================
     HEADER
  ========================= */

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.brand,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.68)',
    marginBottom: 5,
  },

  heading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },

  subheading: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 5,
    lineHeight: 16,
    maxWidth: 210,
  },

  countBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  count: {
    fontSize: 25,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  countLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.68)',
    marginTop: 1,
  },

  /* =========================
     STATISTICS
  ========================= */

  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: spacing.md,
    marginHorizontal: 4,
    minHeight: 82,
    justifyContent: 'center',
  },

  statLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: colors.muted,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 6,
  },

  /* =========================
     SECTION HEADER
  ========================= */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.ink,
  },

  sectionSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },

  /* =========================
     EMPTY STATE
  ========================= */

  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
  },

  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  emptyEmoji: {
    fontSize: 38,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
  },

  emptyMessage: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    lineHeight: 21,
    fontSize: 11,
  },

  /* =========================
     LOT CARD HEADER
  ========================= */

  lotHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  materialRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },

  materialIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  materialEmoji: {
    fontSize: 27,
  },

  materialInfo: {
    flex: 1,
    marginLeft: spacing.sm,
    minWidth: 0,
  },

  materialName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink,
  },

  reference: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.muted,
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* =========================
     STATUS
  ========================= */

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginLeft: spacing.xs,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '900',
  },

  /* =========================
     INFORMATION BOX
  ========================= */

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FAF8',
    borderRadius: 15,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },

  infoItem: {
    flex: 1,
  },

  divider: {
    width: 1,
    height: 38,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },

  infoLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: colors.muted,
  },

  infoValue: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 5,
  },

  /* =========================
     DATE
  ========================= */

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },

  dateIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.brandSoft,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 15,
    marginRight: spacing.sm,
  },

  dateLabel: {
    fontSize: 9,
    color: colors.muted,
    fontWeight: '600',
  },

  dateValue: {
    fontSize: 12,
    color: colors.ink,
    fontWeight: '800',
    marginTop: 2,
  },

  /* =========================
     BOTTOM ROW
  ========================= */

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderColor: colors.border,
  },

  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  syncText: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '700',
  },

  detailsButton: {
    minHeight: 32,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.brandSoft,
    justifyContent: 'center',
  },

  detailsText: {
    fontSize: 10,
    color: colors.brand,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.55,
    transform: [{ scale: 0.97 }],
  },

  /* =========================
     OFFLINE INFORMATION
  ========================= */

  offlineBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF8F4',
    borderWidth: 1,
    borderColor: '#D5EDE2',
    borderRadius: 18,
    padding: spacing.md,
    marginVertical: spacing.md,
  },

  offlineIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  offlineIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  offlineContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  offlineTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.ink,
  },

  offlineText: {
    fontSize: 10,
    lineHeight: 17,
    color: colors.muted,
    marginTop: 4,
  },
});