import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Activity_Opacity } from '../../../utils/global';
import { ApiContext } from '../../Context/Context';

export default function AdminHome() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const {
    adminLogout,
    students,
    fetchStudents,
    logs,
    fetchLogs,
    isLoading,
    error,
    clearError
  } = useContext(ApiContext);

  // Process logs to get individual entry/exit records
  const processLogs = () => {
    const processedLogs = [];
    
    logs.forEach(log => {
      // Add entry record if exists
      if (log.entry_time) {
        processedLogs.push({
          id: `${log.id}_entry`,
          name: log.name,
          register_no: log.register_no,
          type: 'Entry',
          time: log.entry_time,
          status: log.entry_status,
          student_id: log.student_id
        });
      }
      
      // Add exit record if exists
      if (log.exit_time) {
        processedLogs.push({
          id: `${log.id}_exit`,
          name: log.name,
          register_no: log.register_no,
          type: 'Exit',
          time: log.exit_time,
          status: log.exit_status,
          student_id: log.student_id
        });
      }
    });

    // Sort by time (most recent first)
    return processedLogs.sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  // Get today's logs
  const todayLogs = processLogs().filter(log => {
    const logDate = new Date(log.time).toDateString();
    return logDate === new Date().toDateString();
  });

  const todayEntries = todayLogs.filter(log => log.type === 'Entry').length;
  const todayExits = todayLogs.filter(log => log.type === 'Exit').length;

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchStudents(), fetchLogs()]);
      } catch (err) {
        console.log('Error loading dashboard data:', err);
      }
    };
    
    loadData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminLogout();
              // navigation.replace('Login');
            } catch (err) {
              Alert.alert('Logout Failed', error || 'Could not logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Get recent logs (last 5)
  const recentLogs = processLogs().slice(0, 5).map(log => ({
    name: log.name || 'Unknown',
    type: log.type,
    time: new Date(log.time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    register_no: log.register_no
  }));

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background_default }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary_main} />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

        {/* Header with background */}
        <View className="pb-9 px-4" style={{ backgroundColor: colors.primary_main }}>
          {/* Top Header */}
          <View className="flex-row justify-between items-center pt-4 mb-5">
            <View className="flex-row items-center space-x-2">
              <Icon name="school" size={22} color={colors.text_temp} />
              <Text className="text-base font-p_semi" style={{ color: colors.text_temp }}>POLY Hostel</Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <Icon name="logout" size={24} color={colors.text_temp} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text className="text-xl font-p_med mb-5" style={{ color: colors.text_temp }}>Dashboard</Text>

          {/* Date + Total Students */}
          <View className="flex-row justify-between">
            <View className="w-[48%] p-4 rounded-2xl shadow-sm" style={{ backgroundColor: colors.background_paper }}>
              <Icon name="calendar-today" size={24} color={colors.primary_main} />
              <Text className="text-lg font-p_bold mt-2" style={{ color: colors.text_primary }}>{today}</Text>
              <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>Today</Text>
            </View>

            <View className="w-[48%] p-4 rounded-2xl shadow-sm" style={{ backgroundColor: colors.background_paper }}>
              <Icon name="groups" size={24} color={colors.primary_main} />
              <Text className="text-lg font-p_bold mt-2" style={{ color: colors.text_primary }}>
                {students.length || 0}
              </Text>
              <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>Total Students</Text>
            </View>
          </View>
        </View>

        {/* Main Body with rounded top */}
        <View className="px-4 pt-6 rounded-t-3xl -mt-5" style={{ backgroundColor: colors.background_default }}>

          {/* Entry/Exit Summary */}
          <View className="flex-row justify-between mb-6">
            <View className="w-[48%] p-4 rounded-2xl shadow-sm" style={{ backgroundColor: colors.background_paper }}>
              <Icon name="login" size={24} color={colors.primary_main} />
              <Text className="text-lg font-p_bold mt-2" style={{ color: colors.text_primary }}>
                {todayEntries}
              </Text>
              <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>Today's Entries</Text>
            </View>
            <View className="w-[48%] p-4 rounded-2xl shadow-sm" style={{ backgroundColor: colors.background_paper }}>
              <Icon name="logout" size={24} color={colors.error_main} />
              <Text className="text-lg font-p_bold mt-2" style={{ color: colors.text_primary }}>
                {todayExits}
              </Text>
              <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>Today's Exits</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text className="text-base font-p_semi mb-3" style={{ color: colors.text_primary }}>Quick Actions</Text>
          <View className="flex-row justify-between mb-6">
            <TouchableOpacity className="w-[30%] items-center py-4 rounded-2xl shadow-sm" style={{ backgroundColor: colors.background_paper }}
            activeOpacity={Activity_Opacity} onPress={()=>navigation.navigate("AddStudent")}>
              <Icon name="person-add" size={28} color={colors.primary_main} />
              <Text className="text-xs mt-2 font-p_med text-center" style={{ color: colors.text_primary }}>Add Student</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            activeOpacity={Activity_Opacity}
            onPress={()=>navigation.navigate('ManageStudents')}
            className="w-[30%] items-center py-4 rounded-2xl shadow-sm" style={{ backgroundColor: colors.background_paper }}>
              <Icon name="group" size={28} color={colors.primary_main} />
              <Text className="text-xs mt-2 font-p_med text-center" style={{ color: colors.text_primary }}>Manage Students</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            activeOpacity={Activity_Opacity}
            className="w-[30%] items-center py-4 rounded-2xl shadow-sm" style={{ backgroundColor: colors.background_paper }}
              onPress={() => navigation.navigate('ManageLogs')}>
              <Icon name="assignment" size={28} color={colors.primary_main} />
              <Text className="text-xs mt-2 font-p_med text-center" style={{ color: colors.text_primary }}>Manage Logs</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Logs */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-p_semi" style={{ color: colors.text_primary }}>Recent Logs</Text>
              <TouchableOpacity activeOpacity={Activity_Opacity} onPress={() => navigation.navigate('ManageLogs')}>
                <Text className="text-sm font-p_med" style={{ color: colors.primary_main }}>View All</Text>
              </TouchableOpacity>
            </View>

            <View className="rounded-2xl p-4" style={{ backgroundColor: colors.background_paper }}>
              {recentLogs.length > 0 ? (
                recentLogs.map((log, idx) => (
                  <View
                    key={`${log.register_no}_${idx}`}
                    className={`flex-row justify-between items-center py-3 ${idx !== recentLogs.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <View>
                      <Text className="text-sm font-p_semi" style={{ color: colors.text_primary }}>
                        {log.name}
                      </Text>
                      <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
                        {log.type} • {log.time}
                      </Text>
                    </View>
                    <Icon
                      name={log.type === 'Entry' ? 'login' : 'logout'}
                      size={20}
                      color={log.type === 'Entry' ? colors.primary_main : colors.error_main}
                    />
                  </View>
                ))
              ) : (
                <View className="py-4 items-center">
                  <Icon name="event-note" size={32} color={colors.text_secondary} />
                  <Text className="text-sm font-p_med mt-2" style={{ color: colors.text_secondary }}>
                    No recent logs
                  </Text>
                  <Text className="text-xs font-p_reg mt-1" style={{ color: colors.text_secondary }}>
                    {isLoading ? 'Loading...' : 'Logs will appear here'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
