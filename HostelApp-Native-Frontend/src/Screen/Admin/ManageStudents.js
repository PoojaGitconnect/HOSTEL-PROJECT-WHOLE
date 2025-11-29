import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Activity_Opacity } from '../../../utils/global';
import AppHeader from '../components/Header';
import { ApiContext } from '../../Context/Context';

export default function ManageStudents() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  
  // Get context functions and states
  const { students, fetchStudents, deleteStudent, isLoading, error, baseIp, clearError } = useContext(ApiContext);

  // Fetch students on mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        await fetchStudents();
        console.log('Students loaded:', students.length);
      } catch (error) {
        console.log('Error loading students:', error.message);
      }
    };
    
    loadStudents();
  }, []);

  // Filter students based on search with safe property access
  const filtered = students.filter((student) => {
    if (!student) return false;
    
    const searchLower = search.toLowerCase();
    return (
      (student.name || '').toLowerCase().includes(searchLower) ||
      (student.register_no || '').toString().includes(searchLower) ||
      (student.room || '').toString().includes(searchLower) ||
      (student.class || '').toString().includes(searchLower)
    );
  });

  // Format date function with error handling
  const formatDate = (dateString) => {
    try {
      if (!dateString || dateString === '0000-00-00') return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Handle delete with confirmation
  const handleDelete = (student) => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudent(student.id);
              Alert.alert('Success', 'Student deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete student');
            }
          }
        }
      ]
    );
  };

  const renderIcons = () => {
    return (
      <TouchableOpacity 
        activeOpacity={Activity_Opacity} 
        onPress={() => navigation.navigate('AddStudent')}
        className="flex-row items-center px-4 py-2 rounded-full"
        style={{ backgroundColor: colors.primary_main }}
      >
        <Icon name="add" size={18} color="white" />
        <Text className="text-sm font-p_semi text-white ml-1">
          Add 
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background_default }}>
      {/* Fixed Header Section */}
      <View className="px-4 pt-4">
        <AppHeader screenName="Manage Students" RenderIcon={renderIcons} />

        {/* Stats Card */}
        <View 
          className="mb-4 p-4 rounded-2xl shadow-sm"
          style={{ backgroundColor: colors.background_paper }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary_main + '20' }}
              >
                <Icon name="school" size={24} color={colors.primary_main} />
              </View>
              <View>
                <Text className="text-lg font-p_bold" style={{ color: colors.text_primary }}>
                  {filtered.length} Students
                </Text>
                <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
                  Total registered
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => fetchStudents()}
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.background_default }}
              disabled={isLoading}
            >
              <Icon 
                name="refresh" 
                size={20} 
                color={isLoading ? colors.text_secondary : colors.primary_main} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View className="mb-4 p-4 rounded-xl border border-red-200" style={{ backgroundColor: '#fee2e2' }}>
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Icon name="warning" size={16} color="#dc2626" />
                  <Text className="text-sm font-p_semi ml-2" style={{ color: '#dc2626' }}>
                    System Notice
                  </Text>
                </View>
                <Text className="text-xs font-p_reg" style={{ color: '#b91c1c' }}>
                  {error}
                </Text>
              </View>
              <TouchableOpacity onPress={clearError}>
                <Icon name="close" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Search Bar */}
        <View
          className="flex-row items-center mb-4 px-4 rounded-2xl shadow-sm"
          style={{ backgroundColor: colors.background_paper }}
        >
          <Icon name="search" size={20} color={colors.text_secondary} />
          <TextInput
            placeholder="Search students by name, ID, room or class..."
            placeholderTextColor={colors.text_secondary}
            value={search}
            onChangeText={setSearch}
            className="ml-3 flex-1 text-base font-p_reg"
            style={{ color: colors.text_primary }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="clear" size={20} color={colors.text_secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Scrollable Student List */}
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 100, // Extra padding at bottom
          paddingTop: 8 
        }}
        bounces={true}
      >
        {isLoading && students.length === 0 ? (
          <View className="items-center mt-16">
            <View 
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.background_paper }}
            >
              <Icon name="hourglass-empty" size={40} color={colors.text_secondary} />
            </View>
            <Text className="text-base font-p_med" style={{ color: colors.text_secondary }}>
              Loading students...
            </Text>
          </View>
        ) : filtered.length > 0 ? (
          <>
            {filtered.map((student, index) => (
              <TouchableOpacity
                key={student.id}
                onPress={() => navigation.navigate('StudentDetail', { student })}
                className="rounded-2xl shadow-sm overflow-hidden mb-4"
                style={{ backgroundColor: colors.background_paper }}
                activeOpacity={0.7}
              >
                {/* Student Card Header */}
                <View className="p-4">
                  <View className="flex-row items-start">
                    {/* Profile Picture */}
                    <View className="mr-4">
                      {student.profile_picture ? (
                        <Image
                          source={{ uri: `${baseIp}/static/${student.profile_picture}` }}
                          className="w-16 h-16 rounded-2xl"
                          style={{ backgroundColor: colors.background_default }}
                        />
                      ) : (
                        <View 
                          className="w-16 h-16 rounded-2xl items-center justify-center"
                          style={{ backgroundColor: colors.primary_main + '20' }}
                        >
                          <Icon name="person" size={28} color={colors.primary_main} />
                        </View>
                      )}
                      
                      {/* Online Status Indicator */}
                      <View 
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 items-center justify-center"
                        style={{ 
                          backgroundColor: '#10b981',
                          borderColor: colors.background_paper 
                        }}
                      >
                        <View className="w-2 h-2 rounded-full bg-white" />
                      </View>
                    </View>

                    {/* Student Info */}
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-lg font-p_bold" style={{ color: colors.text_primary }}>
                          {student.name || 'N/A'}
                        </Text>
                        <View className="flex-row space-x-2">
                          <TouchableOpacity 
                            onPress={() => navigation.navigate('EditStudent', { student })}
                            className="w-8 h-8 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.primary_main + '20' }}
                          >
                            <Icon name="edit" size={16} color={colors.primary_main} />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={() => handleDelete(student)}
                            className="w-8 h-8 rounded-full items-center justify-center"
                            style={{ backgroundColor: '#fee2e2' }}
                          >
                            <Icon name="delete" size={16} color="#dc2626" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Quick Info Tags */}
                      <View className="flex-row flex-wrap mb-3">
                        <View 
                          className="px-3 py-1 rounded-full mr-2 mb-2"
                          style={{ backgroundColor: colors.primary_main + '15' }}
                        >
                          <Text className="text-xs font-p_med" style={{ color: colors.primary_main }}>
                            #{student.register_no || 'N/A'}
                          </Text>
                        </View>
                        <View 
                          className="px-3 py-1 rounded-full mr-2 mb-2"
                          style={{ backgroundColor: colors.background_default }}
                        >
                          <Text className="text-xs font-p_med" style={{ color: colors.text_secondary }}>
                            Room {student.room || 'N/A'}
                          </Text>
                        </View>
                        <View 
                          className="px-3 py-1 rounded-full mr-2 mb-2"
                          style={{ backgroundColor: colors.background_default }}
                        >
                          <Text className="text-xs font-p_med" style={{ color: colors.text_secondary }}>
                            {student.year || 'N/A'} Year
                          </Text>
                        </View>
                      </View>

                      {/* Contact Info Row */}
                      <View className="flex-row items-center">
                        <Icon name="phone" size={14} color={colors.text_secondary} />
                        <Text className="text-xs font-p_reg ml-1 mr-4" style={{ color: colors.text_secondary }}>
                          {student.phone || 'N/A'}
                        </Text>
                        <Icon name="email" size={14} color={colors.text_secondary} />
                        <Text className="text-xs font-p_reg ml-1 flex-1" style={{ color: colors.text_secondary }} numberOfLines={1}>
                          {student.email || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Additional Info Section */}
                  <View 
                    className="mt-4 pt-3 border-t"
                    style={{ borderTopColor: colors.background_default }}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center">
                        <Icon name="class" size={16} color={colors.text_secondary} />
                        <Text className="text-sm font-p_med ml-2" style={{ color: colors.text_secondary }}>
                          Class: {student.class || 'N/A'}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Icon name="person" size={16} color={colors.text_secondary} />
                        <Text className="text-sm font-p_med ml-2" style={{ color: colors.text_secondary }}>
                          {student.gender || 'N/A'}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Icon name="cake" size={16} color={colors.text_secondary} />
                        <Text className="text-sm font-p_med ml-2" style={{ color: colors.text_secondary }}>
                          {formatDate(student.dob)}
                        </Text>
                      </View>
                    </View>

                    {/* Address */}
                    {student.address && (
                      <View className="flex-row items-start mt-3">
                        <Icon name="location-on" size={16} color={colors.text_secondary} />
                        <Text className="text-sm font-p_reg ml-2 flex-1" style={{ color: colors.text_secondary }}>
                          {student.address}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View className="items-center mt-16">
            <View 
              className="w-24 h-24 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: colors.background_paper }}
            >
              <Icon name="school" size={48} color={colors.text_secondary} />
            </View>
            <Text className="text-lg font-p_bold mb-2" style={{ color: colors.text_primary }}>
              {error ? 'Students Unavailable' : 'No Students Found'}
            </Text>
            <Text className="text-sm font-p_reg text-center mb-6 px-8" style={{ color: colors.text_secondary }}>
              {error 
                ? 'Students list is temporarily unavailable due to server configuration.' 
                : search 
                  ? `No students match "${search}". Try a different search term.`
                  : 'No students have been added yet.'
              }
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddStudent')}
              className="flex-row items-center px-6 py-3 rounded-2xl"
              style={{ backgroundColor: colors.primary_main }}
            >
              <Icon name="add" size={20} color="white" />
              <Text className="text-base font-p_semi text-white ml-2">
                Add First Student
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
