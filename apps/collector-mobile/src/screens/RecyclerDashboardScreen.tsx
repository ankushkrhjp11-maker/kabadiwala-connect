import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    AppRoute,
} from '../navigation/types';

import { colors, spacing, typography } from '../theme';

type Props = {
    onNavigate: (route: AppRoute) => void;
};

export function RecyclerDashboardScreen({
    onNavigate,
}: Props) {
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >

                {/* ================= HEADER ================= */}

                <View style={styles.header}>
                    <View>
                        <Text style={styles.smallGreeting}>
                            Welcome back 👋
                        </Text>

                        <Text style={styles.title}>
                            Recycler Dashboard
                        </Text>

                        <Text style={styles.subtitle}>
                            Manage e-waste lots, purchases and recycling
                            operations.
                        </Text>
                    </View>

                    <Pressable
                        style={styles.notificationButton}
                        onPress={() => {}}
                    >
                        <Text style={styles.notificationIcon}>
                            🔔
                        </Text>

                        <View style={styles.notificationDot} />
                    </Pressable>
                </View>

                {/* ================= VERIFICATION ================= */}

                <View style={styles.verificationCard}>
                    <View style={styles.verificationIcon}>
                        <Text style={styles.verificationIconText}>
                            ✓
                        </Text>
                    </View>

                    <View style={styles.verificationContent}>
                        <Text style={styles.verificationTitle}>
                            Recycler account
                        </Text>

                        <Text style={styles.verificationText}>
                            Your business verification status will
                            appear here.
                        </Text>
                    </View>

                    <Text style={styles.arrow}>
                        ›
                    </Text>
                </View>

                {/* ================= OVERVIEW ================= */}

                <Text style={styles.sectionTitle}>
                    Overview
                </Text>

                <View style={styles.summaryGrid}>
                    <SummaryCard
                        icon="₹"
                        title="Earnings"
                        value="—"
                        subtitle="This month"
                    />

                    <SummaryCard
                        icon="📦"
                        title="Available Lots"
                        value="—"
                        subtitle="Ready to purchase"
                    />

                    <SummaryCard
                        icon="🚚"
                        title="Pickups"
                        value="—"
                        subtitle="Scheduled"
                    />

                    <SummaryCard
                        icon="🤝"
                        title="Transactions"
                        value="—"
                        subtitle="Total activity"
                    />
                </View>

                {/* ================= QUICK ACTIONS ================= */}

                <Text style={styles.sectionTitle}>
                    Quick Actions
                </Text>

                <View style={styles.actionGrid}>

                    {/* AVAILABLE E-WASTE */}

                    <ActionCard
                        icon="♻️"
                        title="Available E-Waste"
                        subtitle="Find material lots from collectors"
                        onPress={() =>
                            onNavigate('myLots')
                        }
                    />

                    {/* PRICE BOARD */}

                    <ActionCard
                        icon="💰"
                        title="Price Board"
                        subtitle="Check current market prices"
                        onPress={() => {}}
                    />

                    {/* NEARBY COLLECTORS */}

                    <ActionCard
                        icon="📍"
                        title="Nearby Collectors"
                        subtitle="Find collection partners"
                        onPress={() => {}}
                    />

                    {/* TRANSACTIONS */}

                    <ActionCard
                        icon="📋"
                        title="Transactions"
                        subtitle="View purchase history"
                        onPress={() => {}}
                    />

                </View>

                {/* ================= E-WASTE CATEGORIES ================= */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        E-Waste Categories
                    </Text>

                    <Pressable
                        onPress={() => {}}
                    >
                        <Text style={styles.viewAll}>
                            View all
                        </Text>
                    </Pressable>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    <CategoryCard
                        icon="🔋"
                        title="Batteries"
                    />

                    <CategoryCard
                        icon="🖥️"
                        title="CRT / LCD"
                    />

                    <CategoryCard
                        icon="🔌"
                        title="Cables"
                    />

                    <CategoryCard
                        icon="🔧"
                        title="PCB"
                    />

                    <CategoryCard
                        icon="⚙️"
                        title="Motors"
                    />

                    <CategoryCard
                        icon="♻️"
                        title="Plastics"
                    />
                </ScrollView>

                {/* ================= AVAILABLE LOTS ================= */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Available Lots
                    </Text>

                    <Pressable
                        onPress={() =>
                            onNavigate('myLots')
                        }
                    >
                        <Text style={styles.viewAll}>
                            View all
                        </Text>
                    </Pressable>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.emptyCard,
                        pressed && styles.pressed,
                    ]}
                    onPress={() =>
                        onNavigate('myLots')
                    }
                >
                    <View style={styles.emptyIconCircle}>
                        <Text style={styles.emptyIcon}>
                            📦
                        </Text>
                    </View>

                    <Text style={styles.emptyTitle}>
                        No lots available yet
                    </Text>

                    <Text style={styles.emptyText}>
                        New e-waste lots from collectors will
                        appear here when they become available.
                    </Text>

                    <View style={styles.emptyAction}>
                        <Text style={styles.emptyActionText}>
                            Browse Available Lots →
                        </Text>
                    </View>
                </Pressable>

                {/* ================= PRICE BOARD ================= */}

                <Text style={styles.sectionTitle}>
                    Today's Price Board
                </Text>

                <View style={styles.priceCard}>
                    <PriceRow
                        icon="🔧"
                        name="PCB"
                        price="—"
                    />

                    <PriceRow
                        icon="🔌"
                        name="Cables"
                        price="—"
                    />

                    <PriceRow
                        icon="🔋"
                        name="Batteries"
                        price="—"
                    />

                    <PriceRow
                        icon="🖥️"
                        name="LCD / LED"
                        price="—"
                    />
                </View>

                {/* ================= SAFETY ================= */}

                <Pressable
                    style={({ pressed }) => [
                        styles.safetyCard,
                        pressed && styles.pressed,
                    ]}
                    onPress={() =>
                        onNavigate('safety')
                    }
                >
                    <View style={styles.safetyIcon}>
                        <Text style={styles.safetyIconText}>
                            🛡️
                        </Text>
                    </View>

                    <View style={styles.safetyContent}>
                        <Text style={styles.safetyTitle}>
                            E-Waste Safety
                        </Text>

                        <Text style={styles.safetyText}>
                            Learn safe handling and storage practices.
                        </Text>
                    </View>

                    <Text style={styles.arrow}>
                        ›
                    </Text>
                </Pressable>

                <View style={styles.bottomSpace} />

            </ScrollView>

            {/* ================= BOTTOM NAVIGATION ================= */}

            <View style={styles.bottomNav}>

                <NavItem
                    icon="⌂"
                    label="Home"
                    active
                    onPress={() =>
                        onNavigate('recyclerDashboard')
                    }
                />

                <NavItem
                    icon="♻"
                    label="Lots"
                    onPress={() =>
                        onNavigate('myLots')
                    }
                />

                <NavItem
                    icon="₹"
                    label="Earnings"
                    onPress={() =>
                        onNavigate('earnings')
                    }
                />

                <NavItem
                    icon="♙"
                    label="Profile"
                    onPress={() =>
                        onNavigate('profile')
                    }
                />

            </View>
        </View>
    );
}

/* =====================================================
   SUMMARY CARD
   ===================================================== */

function SummaryCard({
    icon,
    title,
    value,
    subtitle,
}: {
    icon: string;
    title: string;
    value: string;
    subtitle: string;
}) {
    return (
        <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
                <Text style={styles.summaryIconText}>
                    {icon}
                </Text>
            </View>

            <Text style={styles.summaryTitle}>
                {title}
            </Text>

            <Text style={styles.summaryValue}>
                {value}
            </Text>

            <Text style={styles.summarySubtitle}>
                {subtitle}
            </Text>
        </View>
    );
}

/* =====================================================
   ACTION CARD
   ===================================================== */

function ActionCard({
    icon,
    title,
    subtitle,
    onPress,
}: {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>
                    {icon}
                </Text>
            </View>

            <Text style={styles.actionTitle}>
                {title}
            </Text>

            <Text style={styles.actionSubtitle}>
                {subtitle}
            </Text>

            <Text style={styles.actionArrow}>
                →
            </Text>
        </Pressable>
    );
}

/* =====================================================
   CATEGORY CARD
   ===================================================== */

function CategoryCard({
    icon,
    title,
}: {
    icon: string;
    title: string;
}) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>
                    {icon}
                </Text>
            </View>

            <Text style={styles.categoryTitle}>
                {title}
            </Text>
        </Pressable>
    );
}

/* =====================================================
   PRICE ROW
   ===================================================== */

function PriceRow({
    icon,
    name,
    price,
}: {
    icon: string;
    name: string;
    price: string;
}) {
    return (
        <View style={styles.priceRow}>
            <View style={styles.priceMaterial}>
                <View style={styles.priceIcon}>
                    <Text>{icon}</Text>
                </View>

                <Text style={styles.priceName}>
                    {name}
                </Text>
            </View>

            <Text style={styles.priceValue}>
                {price}
            </Text>
        </View>
    );
}

/* =====================================================
   BOTTOM NAVIGATION
   ===================================================== */

function NavItem({
    icon,
    label,
    active = false,
    onPress,
}: {
    icon: string;
    label: string;
    active?: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={styles.navItem}
        >
            <View
                style={[
                    styles.navIconContainer,
                    active && styles.navIconActive,
                ]}
            >
                <Text
                    style={[
                        styles.navIcon,
                        active && styles.navIconActiveText,
                    ]}
                >
                    {icon}
                </Text>
            </View>

            <Text
                style={[
                    styles.navLabel,
                    active && styles.navLabelActive,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.canvas,
    },

    content: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: 100,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },

    smallGreeting: {
        fontSize: 14,
        color: colors.muted,
        marginBottom: 4,
    },

    title: {
        ...typography.title,
        fontSize: 25,
    },

    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.muted,
        marginTop: 5,
        maxWidth: 290,
    },

    notificationButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },

    notificationIcon: {
        fontSize: 21,
    },

    notificationDot: {
        position: 'absolute',
        right: 10,
        top: 9,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D33131',
    },

    verificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 20,
        backgroundColor: colors.brandSoft,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg,
    },

    verificationIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.brand,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },

    verificationIconText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
    },

    verificationContent: {
        flex: 1,
    },

    verificationTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.ink,
    },

    verificationText: {
        fontSize: 12,
        lineHeight: 17,
        color: colors.muted,
        marginTop: 2,
    },

    arrow: {
        fontSize: 28,
        color: colors.brand,
        marginLeft: 8,
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: colors.ink,
        marginBottom: spacing.sm,
    },

    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },

    summaryCard: {
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: 19,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },

    summaryIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },

    summaryIconText: {
        fontSize: 19,
        color: colors.brand,
        fontWeight: '800',
    },

    summaryTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.muted,
    },

    summaryValue: {
        fontSize: 25,
        fontWeight: '900',
        color: colors.ink,
        marginTop: 4,
    },

    summarySubtitle: {
        fontSize: 11,
        color: colors.muted,
        marginTop: 2,
    },

    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },

    actionCard: {
        width: '48%',
        minHeight: 145,
        padding: spacing.md,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        position: 'relative',
    },

    pressed: {
        opacity: 0.72,
    },

    actionIcon: {
        width: 46,
        height: 46,
        borderRadius: 15,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },

    actionIconText: {
        fontSize: 22,
    },

    actionTitle: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
        color: colors.ink,
    },

    actionSubtitle: {
        fontSize: 12,
        lineHeight: 17,
        color: colors.muted,
        marginTop: 4,
        paddingRight: 8,
    },

    actionArrow: {
        position: 'absolute',
        right: 14,
        bottom: 13,
        fontSize: 18,
        color: colors.brand,
        fontWeight: '800',
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },

    viewAll: {
        fontSize: 13,
        fontWeight: '800',
        color: colors.brand,
        marginBottom: spacing.sm,
    },

    categoryScroll: {
        paddingBottom: spacing.lg,
        gap: spacing.sm,
    },

    categoryCard: {
        width: 105,
        height: 112,
        borderRadius: 18,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },

    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    categoryIconText: {
        fontSize: 23,
    },

    categoryTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.ink,
        textAlign: 'center',
    },

    emptyCard: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },

    emptyIconCircle: {
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },

    emptyIcon: {
        fontSize: 29,
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.ink,
        textAlign: 'center',
    },

    emptyText: {
        fontSize: 13,
        lineHeight: 19,
        color: colors.muted,
        textAlign: 'center',
        marginTop: 6,
    },

    emptyAction: {
        marginTop: spacing.md,
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 12,
        backgroundColor: colors.brandSoft,
    },

    emptyActionText: {
        fontSize: 12,
        fontWeight: '800',
        color: colors.brand,
    },

    priceCard: {
        backgroundColor: colors.surface,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.lg,
    },

    priceRow: {
        minHeight: 65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    priceMaterial: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    priceIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },

    priceName: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.ink,
    },

    priceValue: {
        fontSize: 16,
        fontWeight: '900',
        color: colors.brand,
    },

    safetyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.warningSoft,
        borderRadius: 20,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: '#F0D9A7',
    },

    safetyIcon: {
        width: 45,
        height: 45,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },

    safetyIconText: {
        fontSize: 23,
    },

    safetyContent: {
        flex: 1,
    },

    safetyTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.ink,
    },

    safetyText: {
        fontSize: 12,
        lineHeight: 17,
        color: colors.muted,
        marginTop: 2,
    },

    bottomSpace: {
        height: 20,
    },

    bottomNav: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 76,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 6,
    },

    navItem: {
        width: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },

    navIconContainer: {
        width: 42,
        height: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    navIconActive: {
        backgroundColor: colors.brandSoft,
    },

    navIcon: {
        fontSize: 21,
        color: colors.muted,
    },

    navIconActiveText: {
        color: colors.brand,
        fontWeight: '900',
    },

    navLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.muted,
        marginTop: 2,
    },

    navLabelActive: {
        color: colors.brand,
    },
});