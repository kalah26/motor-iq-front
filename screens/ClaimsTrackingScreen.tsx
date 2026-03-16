import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import api from '../services/api';
import { Claim } from '../types';

export default function ClaimsTrackingScreen() {
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get('/claims/driver/1');
        setClaims(response.data);
      } catch (error) {
        // handle
      }
    };
    fetchClaims();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Claims Tracking</Text>
      <FlatList
        data={claims}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.description}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Risk Score: {item.fraud_risk_score}</Text>
          </View>
        )}
      />
    </View>
  );
}