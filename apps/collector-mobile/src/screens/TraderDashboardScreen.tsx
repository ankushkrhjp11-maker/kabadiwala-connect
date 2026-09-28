import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { AppRoute } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Props = {
    onNavigate: (route: AppRoute) => void;
};

export function TraderDashboardScreen({
    onNavigate,
}: Props) {
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.greeting}>
                            Welcome back 👋
                        </Text>

                        <Text style={styles.title}>
                            Trader Dashboard
                        </Text>

                        <Text style={styles.subtitle}>
                            Buy, sell and manage your e-waste trading
                            activity.
                        </Text>
                    </View>

                    <Pressable style={styles.notification}>
                        <Text style={styles.notificationIcon}>
                            🔔
                        </Text>

                        <View style={styles.notificationDot} />
                    </Pressable>
                </View>

                {/* Account Status */}
                <View style={styles.statusCard}>
                    <View style={styles.statusIcon}>
                        <Text style={styles.statusIconText}>
                            ✓
                        </Text>
                    </View>

                    <View style={styles.statusContent}>
                        <Text style={styles.statusTitle}>
                            Trader account
                        </Text>

                        <Text style={styles.statusText}>
                            Your business verification status will
                            appear here.
                        </Text>
                    </View>

                    <Text style={styles.arrow}>›</Text>
                </View>

                {/* Overview */}
                <Text style={styles.sectionTitle}>
                    Trading Overview
                </Text>

                <View style={styles.summaryGrid}>
                    <SummaryCard
                        icon="₹"
                        title="Sales"
                        value="—"
                        subtitle="This month"
                    />

                    <SummaryCard
                        icon="🛒"
                        title="Purchases"
                        value="—"
                        subtitle="This month"
                    />

                    <SummaryCard
                        icon="📦"
                        title="Active Lots"
                        value="—"
                        subtitle="In marketplace"
                    />

                    <SummaryCard
                        icon="🤝"
                        title="Deals"
                        value="—"
                        subtitle="Completed"
                    />
                </View>

                {/* Main Actions */}
                <Text style={styles.sectionTitle}>
                    What would you like to do?
                </Text>

                <View style={styles.actionGrid}>
                    <ActionCard
                        icon="🛒"
                        title="Buy E-Waste"
                        subtitle="Browse available lots"
                        onPress={() =>
                            onNavigate('myLots')
                        }
                    />

                    <ActionCard
                        icon="💰"
                        title="Sell Materials"
                        subtitle="List your materials"
                        onPress={() =>
                            onNavigate('createLot')
                        }
                    />

                    <ActionCard
                        icon="📊"
                        title="Market Prices"
                        subtitle="Check current rates"
                        onPress={() => { }}
                    />

                    <ActionCard
                        icon="📋"
                        title="Transactions"
                        subtitle="View your trading history"
                        onPress={() => { }}
                    />
                </View>

                {/* Market Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Market Categories
                    </Text>

                    <Pressable onPress={() => { }}>
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
                        icon="🔧"
                        title="PCB"
                    />

                    <CategoryCard
                        icon="🔌"
                        title="Cables"
                    />

                    <CategoryCard
                        icon="🔋"
                        title="Batteries"
                    />

                    <CategoryCard
                        icon="🖥️"
                        title="LCD / LED"
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

                {/* Current Market */}
                <Text style={styles.sectionTitle}>
                    Current Market
                </Text>

                <View style={styles.marketCard}>
                    <MarketRow
                        icon="🔧"
                        name="PCB"
                        price="—"
                        trend="Market rate"
                    />

                    <MarketRow
                        icon="🔌"
                        name="Cables"
                        price="—"
                        trend="Market rate"
                    />

                    <MarketRow
                        icon="🔋"
                        name="Batteries"
                        price="—"
                        trend="Market rate"
                    />

                    <MarketRow
                        icon="🖥️"
                        name="LCD / LED"
                        price="—"
                        trend="Market rate"
                    />
                </View>

                {/* Recent Activity */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Recent Activity
                    </Text>

                    <Pressable onPress={() => { }}>
                        <Text style={styles.viewAll}>
                            View all
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.emptyCard}>
                    <View style={styles.emptyIcon}>
                        <Text style={styles.emptyIconText}>
                            📋
                        </Text>
                    </View>

                    <Text style={styles.emptyTitle}>
                        No trading activity yet
                    </Text>

                    <Text style={styles.emptyText}>
                        Your purchases, sales and completed deals
                        will appear here.
                    </Text>
                </View>

                {/* Partner Section */}
                <Pressable style={styles.partnerCard}>
                    <View style={styles.partnerIcon}>
                        <Text style={styles.partnerIconText}>
                            🤝
                        </Text>
                    </View>

                    <View style={styles.partnerContent}>
                        <Text style={styles.partnerTitle}>
                            Find trading partners
                        </Text>

                        <Text style={styles.partnerText}>
                            Connect with collectors, recyclers and
                            other verified businesses.
                        </Text>
                    </View>

                    <Text style={styles.arrow}>
                        ›
                    </Text>
                </Pressable>

                {/* Safety */}
                <Pressable
                    style={styles.safetyCard}
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
                            Follow safe handling and storage
                            practices.
                        </Text>
                    </View>

                    <Text style={styles.arrow}>
                        ›
                    </Text>
                </Pressable>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <NavItem
                    icon="⌂"
                    label="Home"
                    active
                    onPress={() =>
                        onNavigate('traderDashboard')
                    }
                />

                <NavItem
                    icon="🛒"
                    label="Market"
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

/* Summary Card */

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

/* Action Card */

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

/* Category */

function CategoryCard({
    icon,
    title,
}: {
    icon: string;
    title: string;
}) {
    return (
        <Pressable style={styles.categoryCard}>
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

/* Market Row */

function MarketRow({
    icon,
    name,
    price,
    trend,
}: {
    icon: string;
    name: string;
    price: string;
    trend: string;
}) {
    return (
        <View style={styles.marketRow}>
            <View style={styles.marketMaterial}>
                <View style={styles.marketIcon}>
                    <Text>{icon}</Text>
                </View>

                <View>
                    <Text style={styles.marketName}>
                        {name}
                    </Text>

                    <Text style={styles.marketTrend}>
                        {trend}
                    </Text>
                </View>
            </View>

            <Text style={styles.marketPrice}>
                {price}
            </Text>
        </View>
    );
}

/* Bottom Navigation */

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
                        active &&
                        styles.navIconActiveText,
                    ]}
                >
                    {icon}
                </Text>
            </View>

            <Text
                style={[
                    styles.navLabel,
                    active &&
                    styles.navLabelActive,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.canvas,
    },

    content: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: 105,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },

    headerText: {
        flex: 1,
    },

    greeting: {
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

    notification: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },

    notificationIcon: {
        fontSize: 21,
    },

    notificationDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D33131',
        right: 9,
        top: 9,
    },

    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 20,
        backgroundColor: colors.brandSoft,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg,
    },

    statusIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.brand,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },

    statusIconText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
    },

    statusContent: {
        flex: 1,
    },

    statusTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.ink,
    },

    statusText: {
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
    },

    viewAll: {
        fontSize: 13,
        fontWeight: '800',
        color: colors.brand,
        marginBottom: spacing.sm,
    },

    categoryScroll: {
        gap: spacing.sm,
        paddingBottom: spacing.lg,
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

    marketCard: {
        backgroundColor: colors.surface,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.lg,
    },

    marketRow: {
        minHeight: 67,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    marketMaterial: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    marketIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },

    marketName: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.ink,
    },

    marketTrend: {
        fontSize: 11,
        color: colors.muted,
        marginTop: 2,
    },

    marketPrice: {
        fontSize: 16,
        fontWeight: '900',
        color: colors.brand,
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

    emptyIcon: {
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },

    emptyIconText: {
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

    partnerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.brandSoft,
        borderRadius: 20,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },

    partnerIcon: {
        width: 46,
        height: 46,
        borderRadius: 15,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },

    partnerIconText: {
        fontSize: 23,
    },

    partnerContent: {
        flex: 1,
    },

    partnerTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.ink,
    },

    partnerText: {
        fontSize: 12,
        lineHeight: 17,
        color: colors.muted,
        marginTop: 2,
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
        backgroundColor: colors.surface,
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