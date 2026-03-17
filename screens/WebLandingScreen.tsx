import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type Nav = StackNavigationProp<any>;

export default function WebLandingScreen() {
  const navigation = useNavigation<Nav>();

  const goToAdmin = () => {
    navigation.navigate('Admin' as never);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>MotorIQ</Text>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            AI Agents for modern motor insurance operations.
          </Text>
          <Text style={styles.heroSubtitle}>
            This demo shows how MotorIQ can triage claims, detect fraud and guide drivers through
            incident reporting using agentic workflows.
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={goToAdmin}>
              <Text style={styles.primaryButtonText}>Enter admin console</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>View driver app (mobile)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: {
    paddingHorizontal: 40,
    paddingTop: 32,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 40,
  },
  hero: {
    maxWidth: 720,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  heroButtons: {
    flexDirection: 'row',
    columnGap: 12,
  },
  primaryButton: {
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: '#111827',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  secondaryButton: {
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E7EB',
  },
});

