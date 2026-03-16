import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../services/api';
import { Driver } from '../types';

export default function ProfileScreen() {
  const [driver, setDriver] = useState<Driver | null>(null);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await api.get('/drivers/1');
        setDriver(response.data);
      } catch (error) {
        // handle
      }
    };
    fetchDriver();
  }, []);

  const handleUpdate = async () => {
    if (driver) {
      try {
        await api.put(`/drivers/${driver.id}`, driver);
        Alert.alert('Success', 'Profile updated');
      } catch (error) {
        Alert.alert('Error', 'Update failed');
      }
    }
  };

  if (!driver) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text>Profile</Text>
      <TextInput placeholder="Name" value={driver.name} onChangeText={(text) => setDriver({ ...driver, name: text })} />
      <TextInput placeholder="Email" value={driver.email} onChangeText={(text) => setDriver({ ...driver, email: text })} />
      <TextInput placeholder="Phone" value={driver.phone} onChangeText={(text) => setDriver({ ...driver, phone: text })} />
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
}