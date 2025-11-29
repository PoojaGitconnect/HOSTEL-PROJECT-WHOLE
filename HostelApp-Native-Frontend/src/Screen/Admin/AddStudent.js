import React, { useState, useContext } from 'react';
import {
  View, ScrollView, TextInput, TouchableOpacity, Image, 
  Platform, PermissionsAndroid, KeyboardAvoidingView, Alert,
  ActivityIndicator
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/Header';
import { ApiContext } from '../../Context/Context';

export default function AddStudent() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { addStudent, isLoading, error, clearError } = useContext(ApiContext);

  const [student, setStudent] = useState({
    name: '',
    register_no: '',
    room: '',
    year: '',
    student_class: '',
    gender: 'Male',
    dob: new Date(),
    address: '',
    email: '',
    phone: '',
    profile_picture: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    setStudent({ ...student, [field]: value });
    setTouched({ ...touched, [field]: true });
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
    
    // Clear global error
    if (error) {
      clearError();
    }
  };

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ||
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Required', 'Please allow access to photos');
        return;
      }
    }

    launchImageLibrary(options, (res) => {
      if (res.assets && res.assets.length > 0) {
        setStudent({ ...student, profile_picture: res.assets[0] });
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!student.name.trim()) newErrors.name = 'Full name is required';
    if (!student.register_no.trim()) newErrors.register_no = 'Register number is required';
    if (!student.room.trim()) newErrors.room = 'Room number is required';
    if (!student.year.trim()) newErrors.year = 'Year is required';
    if (!student.student_class.trim()) newErrors.student_class = 'Class is required';

    // Format validation
    if (student.register_no && !student.register_no.match(/^\d+$/)) {
      newErrors.register_no = 'Register number must contain only digits';
    }

    if (student.phone && !student.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (student.email && !student.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (student.room && !student.room.match(/^\d+$/)) {
      newErrors.room = 'Room number must contain only digits';
    }

    if (student.year && !student.year.match(/^\d{4}$/)) {
      newErrors.year = 'Year must be a 4-digit number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Mark all fields as touched for validation display
    const allFields = Object.keys(student);
    const touchedFields = {};
    allFields.forEach(field => touchedFields[field] = true);
    setTouched(touchedFields);

    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again');
      return;
    }

    try {
      const formData = new FormData();
      
      Object.keys(student).forEach(key => {
        if (key === 'profile_picture' && student[key]) {
          formData.append('profile_picture', {
            uri: student[key].uri,
            type: student[key].type || 'image/jpeg',
            name: student[key].fileName || `photo_${Date.now()}.jpg`,
          });
        } else if (key === 'dob') {
          formData.append(key, student[key].toISOString().split('T')[0]);
        } else if (student[key] !== null && student[key] !== undefined && student[key] !== '') {
          formData.append(key, student[key].toString());
        }
      });

      console.log('Submitting student data...');
      const response = await addStudent(formData);
      
      console.log('Add student response:', response);
      
      Alert.alert(
        'Success', 
        'Student added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      
    } catch (error) {
      console.error('Add student error:', error);
      
      let errorMessage = 'Failed to add student';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (errorMessage.toLowerCase().includes('duplicate')) {
        errorMessage = 'A student with this register number already exists';
      } else if (errorMessage.toLowerCase().includes('network')) {
        errorMessage = 'Network error. Please check your connection';
      } else if (errorMessage.toLowerCase().includes('timeout')) {
        errorMessage = 'Request timeout. Please try again';
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  const renderInput = (field, placeholder, options = {}) => {
    const hasError = touched[field] && errors[field];
    
    return (
      <View className="mb-4">
        <TextInput
          placeholder={placeholder}
          value={student[field]}
          onChangeText={(val) => handleChange(field, val)}
          className={`px-4 py-3 rounded-xl text-base font-medium ${
            hasError 
              ? 'border-2 border-red-500 bg-red-50' 
              : 'border border-gray-200'
          }`}
          style={{ 
            backgroundColor: hasError ? '#fef2f2' : colors.background_paper, 
            color: colors.text_primary,
            fontFamily: 'System'
          }}
          placeholderTextColor={colors.text_secondary}
          {...options}
        />
        {hasError && (
          <View className="flex-row items-center mt-2 px-2">
            <Icon name="alert-circle" size={16} color="#ef4444" />
            <Text className="text-red-500 text-sm ml-1 font-medium">{errors[field]}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: colors.background_default }}
    >
      <AppHeader screenName="Add Student" />
      
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Profile Picture Section */}
          <View 
            className="mx-4 mt-4 mb-6 rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: colors.background_paper }}
          >
            <TouchableOpacity onPress={pickImage} className="items-center">
              <View 
                className="w-32 h-32 rounded-full border-4 overflow-hidden relative"
                style={{ borderColor: colors.primary_main }}
              >
                <Image
                  source={{
                    uri: student.profile_picture?.uri || 'https://via.placeholder.com/128/e5e7eb/6b7280?text=Photo',
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View 
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary_main }}
                >
                  <Icon name="camera" size={18} color="white" />
                </View>
              </View>
              <Text 
                className="text-sm mt-3 font-medium"
                style={{ color: colors.text_secondary }}
              >
                Tap to {student.profile_picture ? 'change' : 'add'} photo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Personal Information */}
          <View 
            className="mx-4 mb-6 rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: colors.background_paper }}
          >
            <View className="flex-row items-center mb-6">
              <Icon name="account" size={24} color={colors.primary_main} />
              <Text 
                className="text-lg font-bold ml-3"
                style={{ color: colors.text_primary }}
              >
                Personal Information
              </Text>
            </View>

            {renderInput('name', 'Full Name *', { autoCapitalize: 'words' })}
            {renderInput('register_no', 'Register Number *', { keyboardType: 'numeric' })}

            <View className="flex-row space-x-3">
              <View className="flex-1">
                {renderInput('room', 'Room No *', { keyboardType: 'numeric' })}
              </View>
              <View className="flex-1">
                {renderInput('year', 'Year *', { keyboardType: 'numeric' })}
              </View>
            </View>

            {renderInput('student_class', 'Class *', { autoCapitalize: 'words' })}

            {/* Gender Selection */}
            <View className="mb-4">
              <Text 
                className="text-base font-medium mb-3"
                style={{ color: colors.text_primary }}
              >
                Gender *
              </Text>
              <View className="flex-row space-x-3">
                {['Male', 'Female'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    onPress={() => handleChange('gender', gender)}
                    className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl ${
                      student.gender === gender ? '' : 'border border-gray-200'
                    }`}
                    style={{
                      backgroundColor: student.gender === gender 
                        ? colors.primary_main 
                        : colors.background_default
                    }}
                  >
                    <Icon 
                      name={gender === 'Male' ? 'human-male' : 'human-female'} 
                      size={20} 
                      color={student.gender === gender ? 'white' : colors.text_secondary} 
                    />
                    <Text 
                      className="text-base font-medium ml-2"
                      style={{
                        color: student.gender === gender ? 'white' : colors.text_secondary
                      }}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date of Birth */}
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center px-4 py-3 rounded-xl border border-gray-200 mb-4"
              style={{ backgroundColor: colors.background_default }}
            >
              <Icon name="calendar" size={20} color={colors.primary_main} />
              <Text 
                className="text-base font-medium ml-3"
                style={{ color: colors.text_primary }}
              >
                Date of Birth: {student.dob.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={student.dob}
                mode="date"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) handleChange('dob', selectedDate);
                }}
              />
            )}
          </View>

          {/* Contact Information */}
          <View 
            className="mx-4 mb-6 rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: colors.background_paper }}
          >
            <View className="flex-row items-center mb-6">
              <Icon name="phone" size={24} color={colors.primary_main} />
              <Text 
                className="text-lg font-bold ml-3"
                style={{ color: colors.text_primary }}
              >
                Contact Information
              </Text>
            </View>

            {renderInput('email', 'Email Address', { 
              keyboardType: 'email-address',
              autoCapitalize: 'none'
            })}
            
            {renderInput('phone', 'Phone Number', { 
              keyboardType: 'phone-pad' 
            })}
            
            {renderInput('address', 'Address', { 
              multiline: true, 
              numberOfLines: 3,
              textAlignVertical: 'top'
            })}
          </View>

          {/* Error Display */}
          {error && (
            <View className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <View className="flex-row items-center">
                <Icon name="alert-circle" size={20} color="#ef4444" />
                <Text className="text-red-600 font-medium ml-2">{error}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Submit Button */}
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <TouchableOpacity
            className="flex-row items-center justify-center py-4 rounded-xl shadow-lg"
            style={{ 
              backgroundColor: colors.primary_main,
              opacity: isLoading ? 0.7 : 1
            }}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white text-base font-bold ml-2">
                  Adding Student...
                </Text>
              </>
            ) : (
              <>
                <Icon name="account-plus" size={20} color="white" />
                <Text className="text-white text-base font-bold ml-2">
                  Add Student
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
