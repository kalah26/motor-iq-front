import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import useClaimsStore from '../stores/claimsStore';

type NavProp = StackNavigationProp<RootStackParamList, 'ReportAccident'>;

type Step = 1 | 2 | 3 | 4 | 5;

export default function ReportAccidentScreen() {
  const navigation = useNavigation<NavProp>();
  const addClaim = useClaimsStore((state) => state.addClaim);
  const vehicles = useClaimsStore((state) => state.profile.vehicles);
  const addVehicle = useClaimsStore((state) => state.addVehicle);

  const [step, setStep] = useState<Step>(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    vehicles[0]?.id ?? null,
  );
  const [date, setDate] = useState('2026-03-16');
  const [time, setTime] = useState('14:30');
  const [accidentType, setAccidentType] = useState('Car Accident');
  const [description, setDescription] = useState('');
  const [damageDescription, setDamageDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [locationLabel, setLocationLabel] = useState('Tap to confirm accident spot on map');
  const [newVehicleMake, setNewVehicleMake] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const goNext = () => {
    if (step < 5) {
      setStep((s) => (s + 1) as Step);
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    if (step === 1) {
      navigation.goBack();
    } else {
      setStep((s) => (s - 1) as Step);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleSubmit = () => {
    const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
    addClaim({
      description,
      status: 'Submitted',
      date_created: date,
      fraud_risk_score: 0,
      vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown vehicle',
      submissionDate: date,
      images,
    });
    navigation.navigate('ClaimsTracking');
  };

  const renderStepIndicator = () => (
    <View style={styles.stepHeader}>
      <Text style={styles.stepTitle}>Filling Incident</Text>
      <Text style={styles.stepSubtitle}>Step {step} of 5</Text>
    </View>
  );

  const renderPrimaryButtonLabel = () => {
    if (step === 5) return 'Submit Claim';
    return 'Next';
  };

  const renderContent = () => {
    if (step === 1) {
      return (
        <View>
          <Text style={styles.sectionTitle}>What happened?</Text>
          <Text style={styles.sectionSubtitle}>
            Select the category that best describes your situation.
          </Text>
          {['Car Accident', 'Vehicle Damage', 'Theft', 'Other'].map((type) => {
            const isActive = accidentType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.optionCard, isActive && styles.optionCardActive]}
                onPress={() => setAccidentType(type)}
              >
                <Text
                  style={[
                    styles.optionTitle,
                    isActive && styles.optionTitleActive,
                  ]}
                >
                  {type}
                </Text>
                <Text style={styles.optionSubtitle}>
                  {type === 'Car Accident'
                    ? 'Collision with another vehicle or object.'
                    : type === 'Vehicle Damage'
                    ? 'Damage caused by weather or other events.'
                    : type === 'Theft'
                    ? 'Stolen vehicle or parts.'
                    : 'Something else happened.'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    if (step === 2) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Accident details</Text>
          <Text style={styles.inputLabel}>Vehicle</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            {vehicles.map((vehicle) => {
              const isActive = vehicle.id === selectedVehicleId;
              return (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleCard,
                    isActive && styles.vehicleCardActive,
                  ]}
                  onPress={() => setSelectedVehicleId(vehicle.id)}
                >
                  <Text
                    style={[
                      styles.vehicleTitle,
                      isActive && styles.vehicleTitleActive,
                    ]}
                  >
                    {vehicle.make} {vehicle.model}
                  </Text>
                  <Text style={styles.vehicleSubtitle}>{vehicle.license_plate}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.vehicleCard, styles.addVehicleCard]}
              onPress={() => setIsAddingVehicle(true)}
            >
              <Text style={styles.addVehiclePlus}>+</Text>
              <Text style={styles.addVehicleText}>Add new vehicle</Text>
            </TouchableOpacity>
          </ScrollView>
          {isAddingVehicle && (
            <View style={styles.newVehicleForm}>
              <Text style={styles.inputLabel}>New vehicle make</Text>
              <TextInput
                style={styles.input}
                value={newVehicleMake}
                onChangeText={setNewVehicleMake}
              />
              <Text style={styles.inputLabel}>Model</Text>
              <TextInput
                style={styles.input}
                value={newVehicleModel}
                onChangeText={setNewVehicleModel}
              />
              <Text style={styles.inputLabel}>License plate</Text>
              <TextInput
                style={styles.input}
                value={newVehiclePlate}
                onChangeText={setNewVehiclePlate}
              />
              <TouchableOpacity
                style={styles.saveVehicleButton}
                onPress={() => {
                  if (!newVehicleMake || !newVehicleModel || !newVehiclePlate) {
                    return;
                  }
                  const created = addVehicle({
                    make: newVehicleMake,
                    model: newVehicleModel,
                    year: new Date().getFullYear(),
                    license_plate: newVehiclePlate,
                  });
                  setSelectedVehicleId(created.id);
                  setIsAddingVehicle(false);
                  setNewVehicleMake('');
                  setNewVehicleModel('');
                  setNewVehiclePlate('');
                }}
              >
                <Text style={styles.saveVehicleText}>Save vehicle</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.inputLabel}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
          />
          <Text style={styles.inputLabel}>Time</Text>
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
          />
          <Text style={styles.inputLabel}>Short description</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="E.g. Another vehicle backed into the front bumper while exiting the parking spot."
          />
        </View>
      );
    }

    if (step === 3) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Upload evidence</Text>
          <Text style={styles.sectionSubtitle}>
            Add photos and describe the visible damage.
          </Text>
          <TouchableOpacity
            style={styles.uploadCard}
            onPress={pickImage}
            activeOpacity={0.9}
          >
            <Text style={styles.uploadIcon}>⬆</Text>
            <Text style={styles.uploadTitle}>Tap to upload or scan report</Text>
            <Text style={styles.uploadSubtitle}>JPG, PNG up to 10MB</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri) => (
              <Image
                key={uri}
                source={{ uri }}
                style={styles.previewImage}
              />
            ))}
          </ScrollView>
          <Text style={styles.inputLabel}>Damage description</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={damageDescription}
            onChangeText={setDamageDescription}
            multiline
          />
        </View>
      );
    }

    if (step === 4) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Confirm accident location</Text>
          <Text style={styles.sectionSubtitle}>
            Use the map placeholder below to confirm where the accident occurred.
          </Text>
          <TouchableOpacity
            style={styles.mapPlaceholder}
            onPress={() =>
              setLocationLabel('Accident location verified • 21 Ndabaningi Sithole Rd, Accra')
            }
          >
            <Text style={styles.mapLabel}>MAP PLACEHOLDER</Text>
          </TouchableOpacity>
          <View style={styles.locationBadgeRow}>
            <View style={styles.locationBadge}>
              <Text style={styles.locationBadgeText}>ACCIDENT LOCATION VERIFIED</Text>
            </View>
          </View>
          <Text style={styles.locationText}>{locationLabel}</Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Review & submit</Text>
        <View style={styles.reviewCard}>
          <Text style={styles.reviewTitle}>Incident details</Text>
          <Text style={styles.reviewLabel}>Type</Text>
          <Text style={styles.reviewValue}>{accidentType}</Text>
          <Text style={styles.reviewLabel}>Date & time</Text>
          <Text style={styles.reviewValue}>
            {date} • {time}
          </Text>
          <Text style={styles.reviewLabel}>Description</Text>
          <Text style={styles.reviewValue}>{description}</Text>
          <Text style={styles.reviewLabel}>Damage</Text>
          <Text style={styles.reviewValue}>{damageDescription || 'Not specified'}</Text>
          <Text style={styles.reviewLabel}>Location</Text>
          <Text style={styles.reviewValue}>{locationLabel}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MotorIQ</Text>
        <View style={{ width: 40 }} />
      </View>
      {renderStepIndicator()}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 24 }}>
        {renderContent()}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={goBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={goNext}>
          <Text style={styles.primaryButtonText}>{renderPrimaryButtonLabel()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  backText: {
    color: '#2563EB',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  stepHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  stepSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionCardActive: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionTitleActive: {
    color: '#FFFFFF',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 160,
  },
  vehicleCardActive: {
    borderColor: '#111827',
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  vehicleTitleActive: {
    color: '#111827',
  },
  vehicleSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  addVehicleCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addVehiclePlus: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  addVehicleText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  newVehicleForm: {
    marginBottom: 12,
  },
  saveVehicleButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  saveVehicleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  uploadCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadIcon: {
    fontSize: 22,
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 12,
  },
  mapPlaceholder: {
    height: 180,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  locationBadgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  locationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#10B981',
  },
  locationBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  locationText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  reviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  reviewValue: {
    fontSize: 13,
    color: '#111827',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#111827',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginLeft: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
