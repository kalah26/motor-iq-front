import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

export default function ReportAccidentScreen() {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);

  const handleReport = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
      // Assume driver_id and vehicle_id
      const claim = {
        driver_id: 1,
        vehicle_id: 1,
        description,
        location_lat: locationData.coords.latitude,
        location_lng: locationData.coords.longitude,
      };
      await api.post('/claims', claim);
      Alert.alert('Success', 'Claim reported');
    } catch (error) {
      Alert.alert('Error', 'Failed to report');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Report Accident</Text>
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <Button title="Upload Photos" onPress={async () => {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
          // handle upload
        }
      }} />
      <Button title="Report" onPress={handleReport} />
    </View>
  );
}