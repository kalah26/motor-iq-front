import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import useClaimsStore from '../stores/claimsStore';

export default function AdminDashboardScreen() {
  const claims = useClaimsStore((s) => s.claims);

  const totalClaims = claims.length;
  const highRisk = claims.filter((c) => c.fraud_risk_score >= 70).length;
  const pending = claims.filter((c) => c.status === 'Submitted' || c.status === 'Under Review')
    .length;

  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <Text style={styles.logo}>MotorIQ</Text>
        <Text style={styles.navItemActive}>Dashboard</Text>
        <Text style={styles.navItem}>Claims</Text>
        <Text style={styles.navItem}>Policies</Text>
        <Text style={styles.navItem}>Reports</Text>
        <View style={styles.sidebarFooter}>
          <Text style={styles.agentLabel}>AI Agents</Text>
          <Text style={styles.agentText}>Fraud detection, triage, auto‑verification.</Text>
        </View>
      </View>

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
        <Text style={styles.mainTitle}>Main Dashboard</Text>
        <Text style={styles.mainSubtitle}>
          Real‑time fleet performance and claim intelligence (simulation).
        </Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Active Claims</Text>
            <Text style={styles.metricValue}>{totalClaims}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>High‑risk Claims</Text>
            <Text style={styles.metricValue}>{highRisk}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Pending Reviews</Text>
            <Text style={styles.metricValue}>{pending}</Text>
          </View>
        </View>

        <View style={styles.panelRow}>
          <View style={styles.prioritizedCard}>
            <Text style={styles.sectionTitle}>Prioritized claims</Text>
            {claims.slice(0, 5).map((c) => (
              <View key={c.id} style={styles.claimRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.claimId}>{c.claimId}</Text>
                  <Text style={styles.claimDesc}>{c.description}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {c.fraud_risk_score >= 70
                      ? 'High'
                      : c.fraud_risk_score >= 30
                      ? 'Medium'
                      : 'Low'}
                  </Text>
                </View>
                <Text style={styles.statusText}>{c.status}</Text>
              </View>
            ))}
          </View>

          <View style={styles.aiPanel}>
            <Text style={styles.sectionTitle}>AI Recommendation</Text>
            <Text style={styles.aiText}>
              MotorIQ agents can automatically route high‑risk claims to fraud analysts and fast‑
              track low‑risk claims for instant payout.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#020617',
  },
  sidebar: {
    width: 220,
    paddingTop: 32,
    paddingHorizontal: 20,
    backgroundColor: '#020617',
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: 24,
  },
  navItem: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  navItemActive: {
    fontSize: 13,
    color: '#F9FAFB',
    fontWeight: '600',
    marginBottom: 10,
  },
  sidebarFooter: {
    marginTop: 40,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0F172A',
  },
  agentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 4,
  },
  agentText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  main: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    columnGap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#020617',
    padding: 14,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  panelRow: {
    flexDirection: 'row',
    columnGap: 16,
    marginTop: 4,
  },
  prioritizedCard: {
    flex: 2,
    borderRadius: 16,
    backgroundColor: '#020617',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 10,
  },
  claimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#111827',
  },
  claimId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  claimDesc: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#1D4ED8',
    marginHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    color: '#EFF6FF',
  },
  statusText: {
    fontSize: 11,
    color: '#FBBF24',
  },
  aiPanel: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#111827',
    padding: 16,
  },
  aiText: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 6,
  },
});

