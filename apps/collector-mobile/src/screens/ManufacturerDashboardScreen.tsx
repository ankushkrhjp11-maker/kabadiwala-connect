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

export function ManufacturerDashboardScreen({
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
                        <View style={styles.eyebrowRow}>
                            <View style={styles.liveDot} />
                            <Text style={styles.eyebrow}>
                                MANUFACTURER PORTAL
                            </Text>
                        </View>

                        <Text style={styles.title}>
                            Welcome back 👋
                        </Text>

                        <Text style={styles.subtitle}>
                            Manage your e-waste recovery,
                            compliance and recycling partnerships.
                        </Text>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.notification,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text style={styles.notificationIcon}>
                            🔔
                        </Text>

                        <View style={styles.notificationDot} />
                    </Pressable>
                </View>

                {/* Business Status */}
                <Pressable
                    style={({ pressed }) => [
                        styles.statusCard,
                        pressed && styles.pressed,
                    ]}
                >
                    <View style={styles.statusIcon}>
                        <Text style={styles.statusIconText}>
                            ✓
                        </Text>
                    </View>

                    <View style={styles.statusContent}>
                        <Text style={styles.statusEyebrow}>
                            ACCOUNT STATUS
                        </Text>

                        <Text style={styles.statusTitle}>
                            Manufacturer account
                        </Text>

                        <Text style={styles.statusText}>
                            Your business verification status will
                            appear here.
                        </Text>
                    </View>

                    <View style={styles.statusArrow}>
                        <Text style={styles.arrowText}>›</Text>
                    </View>
                </Pressable>

                {/* Overview */}
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Recovery Overview
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Your recovery performance at a glance
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryGrid}>
                    <SummaryCard
                        icon="📦"
                        title="E-Waste"
                        value="—"
                        subtitle="Collected"
                    />

                    <SummaryCard
                        icon="♻️"
                        title="Recycled"
                        value="—"
                        subtitle="Processed"
                    />

                    <SummaryCard
                        icon="🤝"
                        title="Partners"
                        value="—"
                        subtitle="Active"
                    />

                    <SummaryCard
                        icon="📊"
                        title="Reports"
                        value="—"
                        subtitle="Available"
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Quick Actions
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Common manufacturer activities
                        </Text>
                    </View>
                </View>

                <View style={styles.actionGrid}>
                    <ActionCard
                        icon="♻️"
                        title="Recovery Program"
                        subtitle="Manage e-waste recovery"
                        onPress={() => { }}
                        featured
                    />

                    <ActionCard
                        icon="🤝"
                        title="Find Recycler"
                        subtitle="Connect with recyclers"
                        onPress={() =>
                            onNavigate('myLots')
                        }
                    />

                    <ActionCard
                        icon="📋"
                        title="Compliance"
                        subtitle="Manage recycling records"
                        onPress={() => { }}
                    />

                    <ActionCard
                        icon="📈"
                        title="Reports"
                        subtitle="View recovery reports"
                        onPress={() => { }}
                    />
                </View>

                {/* Material Streams */}
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Material Streams
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Supported e-waste categories
                        </Text>
                    </View>

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
                        icon="🖥️"
                        title="Displays"
                    />

                    <CategoryCard
                        icon="🔋"
                        title="Batteries"
                    />

                    <CategoryCard
                        icon="🔧"
                        title="PCB"
                    />

                    <CategoryCard
                        icon="🔌"
                        title="Cables"
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

                {/* Recovery Partners */}
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Recovery Partners
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Authorized recycling network
                        </Text>
                    </View>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.partnerCard,
                        pressed && styles.pressed,
                    ]}
                >
                    <View style={styles.partnerIcon}>
                        <Text style={styles.partnerIconText}>
                            🤝
                        </Text>
                    </View>

                    <View style={styles.partnerContent}>
                        <Text style={styles.partnerEyebrow}>
                            AUTHORIZED NETWORK
                        </Text>

                        <Text style={styles.partnerTitle}>
                            Find a recycling partner
                        </Text>

                        <Text style={styles.partnerText}>
                            Connect with authorized facilities based
                            on material, location and service area.
                        </Text>
                    </View>

                    <View style={styles.partnerArrow}>
                        <Text style={styles.arrowText}>→</Text>
                    </View>
                </Pressable>

                {/* Compliance */}
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Compliance & Traceability
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Evidence for every recovery activity
                        </Text>
                    </View>
                </View>

                <View style={styles.complianceCard}>
                    <ComplianceRow
                        icon="📸"
                        title="Digital handover"
                        text="Photo and transaction evidence"
                        last={false}
                    />

                    <ComplianceRow
                        icon="📍"
                        title="Location tracking"
                        text="Collection and handover location"
                        last={false}
                    />

                    <ComplianceRow
                        icon="⚖️"
                        title="Weight records"
                        text="Verified material quantities"
                        last={false}
                    />

                    <ComplianceRow
                        icon="🔐"
                        title="Traceability"
                        text="Unique reference for every lot"
                        last
                    />
                </View>

                {/* Activity */}
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Recent Activity
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Latest recovery events
                        </Text>
                    </View>

                    <Pressable onPress={() => { }}>
                        <Text style={styles.viewAll}>
                            View all
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.emptyCard}>
                    <View style={styles.emptyIcon}>
                        <Text style={styles.emptyIconText}>
                            📊
                        </Text>
                    </View>

                    <Text style={styles.emptyTitle}>
                        No recovery activity yet
                    </Text>

                    <Text style={styles.emptyText}>
                        Your collection, recycling and handover
                        activities will appear here once available.
                    </Text>
                </View>

                {/* Safety */}
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
                        <Text style={styles.safetyEyebrow}>
                            SAFETY GUIDANCE
                        </Text>

                        <Text style={styles.safetyTitle}>
                            E-Waste Safety
                        </Text>

                        <Text style={styles.safetyText}>
                            Follow safe handling, storage and
                            transportation practices.
                        </Text>
                    </View>

                    <View style={styles.safetyArrow}>
                        <Text style={styles.arrowText}>›</Text>
                    </View>
                </Pressable>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <NavItem
                    icon="⌂"
                    label="Home"
                    active
                    onPress={() =>
                        onNavigate('manufacturerDashboard')
                    }
                />

                <NavItem
                    icon="♻️"
                    label="Recovery"
                    onPress={() =>
                        onNavigate('myLots')
                    }
                />

                <NavItem
                    icon="📊"
                    label="Reports"
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
            <View style={styles.summaryTop}>
                <View style={styles.summaryIcon}>
                    <Text style={styles.summaryIconText}>
                        {icon}
                    </Text>
                </View>

                <View style={styles.summaryMiniDot} />
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
    featured = false,
}: {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    featured?: boolean;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.actionCard,
                featured && styles.actionCardFeatured,
                pressed && styles.pressed,
            ]}
        >
            <View
                style={[
                    styles.actionIcon,
                    featured && styles.actionIconFeatured,
                ]}
            >
                <Text style={styles.actionIconText}>
                    {icon}
                </Text>
            </View>

            <Text
                style={[
                    styles.actionTitle,
                    featured && styles.actionTitleFeatured,
                ]}
            >
                {title}
            </Text>

            <Text
                style={[
                    styles.actionSubtitle,
                    featured && styles.actionSubtitleFeatured,
                ]}
            >
                {subtitle}
            </Text>

            <View
                style={[
                    styles.actionArrowContainer,
                    featured && styles.actionArrowFeatured,
                ]}
            >
                <Text
                    style={[
                        styles.actionArrow,
                        featured && styles.actionArrowTextFeatured,
                    ]}
                >
                    →
                </Text>
            </View>
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

/* Compliance */

function ComplianceRow({
    icon,
    title,
    text,
    last = false,
}: {
    icon: string;
    title: string;
    text: string;
    last?: boolean;
}) {
    return (
        <View
            style={[
                styles.complianceRow,
                !last && styles.complianceRowBorder,
            ]}
        >
            <View style={styles.complianceIcon}>
                <Text style={styles.complianceIconText}>
                    {icon}
                </Text>
            </View>

            <View style={styles.complianceContent}>
                <Text style={styles.complianceTitle}>
                    {title}
                </Text>

                <Text style={styles.complianceText}>
                    {text}
                </Text>
            </View>

            <View style={styles.checkCircle}>
                <Text style={styles.check}>
                    ✓
                </Text>
            </View>
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
            style={({ pressed }) => [
                styles.navItem,
                pressed && styles.pressed,
            ]}
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

    /* Header */

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },

    headerText: {
        flex: 1,
        paddingRight: spacing.sm,
    },

    eyebrowRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 7,
    },

    liveDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.brand,
        marginRight: 6,
    },

    eyebrow: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1.3,
        color: colors.brand,
    },

    title: {
        ...typography.title,
        fontSize: 27,
        fontWeight: '900',
        color: colors.ink,
        letterSpacing: -0.7,
    },

    subtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.muted,
        marginTop: 6,
        maxWidth: 300,
    },

    notification: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    notificationIcon: {
        fontSize: 20,
    },

    notificationDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D33131',
        right: 8,
        top: 8,
        borderWidth: 2,
        borderColor: colors.surface,
    },

    /* Status */

    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 22,
        backgroundColor: colors.brand,
        marginBottom: spacing.lg,
        minHeight: 94,
    },

    statusIcon: {
        width: 48,
        height: 48,
        borderRadius: 17,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
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

    statusEyebrow: {
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1.1,
        color: 'rgba(255,255,255,0.62)',
        marginBottom: 3,
    },

    statusTitle: {
        fontSize: 15,
        fontWeight: '900',
        color: '#FFFFFF',
    },

    statusText: {
        fontSize: 10,
        lineHeight: 15,
        color: 'rgba(255,255,255,0.72)',
        marginTop: 3,
    },

    statusArrow: {
        width: 32,
        height: 32,
        borderRadius: 11,
        backgroundColor: 'rgba(255,255,255,0.10)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    /* Sections */

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: colors.ink,
        letterSpacing: -0.3,
    },

    sectionSubtitle: {
        fontSize: 10,
        color: colors.muted,
        marginTop: 3,
    },

    viewAll: {
        fontSize: 11,
        fontWeight: '900',
        color: colors.brand,
        marginBottom: 2,
    },

    /* Summary */

    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },

    summaryCard: {
        width: '48.3%',
        minHeight: 132,
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm,
    },

    summaryTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },

    summaryIcon: {
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
    },

    summaryIconText: {
        fontSize: 20,
    },

    summaryMiniDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.brand,
        opacity: 0.7,
    },

    summaryTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: colors.muted,
    },

    summaryValue: {
        fontSize: 25,
        fontWeight: '900',
        color: colors.ink,
        marginTop: 3,
    },

    summarySubtitle: {
        fontSize: 9,
        color: colors.muted,
        marginTop: 1,
    },

    /* Actions */

    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },

    actionCard: {
        width: '48.3%',
        minHeight: 145,
        padding: spacing.md,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm,
        position: 'relative',
        overflow: 'hidden',
    },

    actionCardFeatured: {
        backgroundColor: colors.brand,
        borderColor: colors.brand,
    },

    actionIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },

    actionIconFeatured: {
        backgroundColor: 'rgba(255,255,255,0.15)',
    },

    actionIconText: {
        fontSize: 21,
    },

    actionTitle: {
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '900',
        color: colors.ink,
        paddingRight: 6,
    },

    actionTitleFeatured: {
        color: '#FFFFFF',
    },

    actionSubtitle: {
        fontSize: 10,
        lineHeight: 15,
        color: colors.muted,
        marginTop: 4,
        paddingRight: 8,
    },

    actionSubtitleFeatured: {
        color: 'rgba(255,255,255,0.70)',
    },

    actionArrowContainer: {
        position: 'absolute',
        right: 12,
        bottom: 12,
        width: 29,
        height: 29,
        borderRadius: 10,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
    },

    actionArrowFeatured: {
        backgroundColor: 'rgba(255,255,255,0.13)',
    },

    actionArrow: {
        fontSize: 16,
        color: colors.brand,
        fontWeight: '900',
    },

    actionArrowTextFeatured: {
        color: '#FFFFFF',
    },

    /* Categories */

    categoryScroll: {
        paddingBottom: spacing.lg,
    },

    categoryCard: {
        width: 104,
        height: 112,
        borderRadius: 18,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },

    categoryIcon: {
        width: 47,
        height: 47,
        borderRadius: 15,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    categoryIconText: {
        fontSize: 22,
    },

    categoryTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: colors.ink,
        textAlign: 'center',
    },

    /* Partner */

    partnerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.brandSoft,
        borderRadius: 22,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg,
    },

    partnerIcon: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },

    partnerIconText: {
        fontSize: 24,
    },

    partnerContent: {
        flex: 1,
    },

    partnerEyebrow: {
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1,
        color: colors.brand,
        marginBottom: 3,
    },

    partnerTitle: {
        fontSize: 15,
        fontWeight: '900',
        color: colors.ink,
    },

    partnerText: {
        fontSize: 10,
        lineHeight: 16,
        color: colors.muted,
        marginTop: 3,
    },

    partnerArrow: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 7,
    },

    /* Compliance */

    complianceCard: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.lg,
        overflow: 'hidden',
    },

    complianceRow: {
        minHeight: 72,
        flexDirection: 'row',
        alignItems: 'center',
    },

    complianceRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    complianceIcon: {
        width: 41,
        height: 41,
        borderRadius: 13,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },

    complianceIconText: {
        fontSize: 18,
    },

    complianceContent: {
        flex: 1,
    },

    complianceTitle: {
        fontSize: 13,
        fontWeight: '900',
        color: colors.ink,
    },

    complianceText: {
        fontSize: 10,
        lineHeight: 15,
        color: colors.muted,
        marginTop: 2,
    },

    checkCircle: {
        width: 25,
        height: 25,
        borderRadius: 13,
        backgroundColor: colors.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    check: {
        fontSize: 13,
        color: colors.brand,
        fontWeight: '900',
    },

    /* Empty */

    emptyCard: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },

    emptyIcon: {
        width: 68,
        height: 68,
        borderRadius: 23,
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
        fontWeight: '900',
        color: colors.ink,
        textAlign: 'center',
    },

    emptyText: {
        fontSize: 11,
        lineHeight: 18,
        color: colors.muted,
        textAlign: 'center',
        marginTop: 6,
        maxWidth: 285,
    },

    /* Safety */

    safetyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.warningSoft,
        borderRadius: 21,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: '#F0D9A7',
    },

    safetyIcon: {
        width: 47,
        height: 47,
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

    safetyEyebrow: {
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1,
        color: '#9A6B18',
        marginBottom: 3,
    },

    safetyTitle: {
        fontSize: 15,
        fontWeight: '900',
        color: colors.ink,
    },

    safetyText: {
        fontSize: 10,
        lineHeight: 16,
        color: colors.muted,
        marginTop: 2,
    },

    safetyArrow: {
        width: 32,
        height: 32,
        borderRadius: 11,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 7,
    },

    /* Bottom Navigation */

    bottomNav: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 78,
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
        width: 44,
        height: 33,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    navIconActive: {
        backgroundColor: colors.brandSoft,
    },

    navIcon: {
        fontSize: 20,
        color: colors.muted,
    },

    navIconActiveText: {
        color: colors.brand,
        fontWeight: '900',
    },

    navLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: colors.muted,
        marginTop: 3,
    },

    navLabelActive: {
        color: colors.brand,
    },

    /* Press */

    pressed: {
        opacity: 0.65,
        transform: [{ scale: 0.98 }],
    },

    arrowText: {
        fontSize: 22,
        color: colors.brand,
        fontWeight: '900',
    },
});