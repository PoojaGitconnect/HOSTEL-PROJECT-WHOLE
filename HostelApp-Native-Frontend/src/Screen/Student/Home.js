import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Dimensions, Alert, RefreshControl } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Activity_Opacity } from '../../../utils/global';
import { ApiContext } from '../../Context/Context';

const { width } = Dimensions.get('window');

export default function StudentHome() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const initialLoadRef = useRef(true);

  const {
    studentData,
    studentLogout,
    myLogs,
    fetchMyLogs,
    isLoading,
    error,
    clearError,
    baseIp
  } = useContext(ApiContext);

  // Memoize processed logs with stable dependencies
  const processedLogs = useMemo(() => {
    if (!myLogs?.length) return [];

    const processed = [];
    
    myLogs.forEach(log => {
      if (log.entry_time) {
        processed.push({
          id: `${log.id}_entry`,
          type: 'Entry',
          time: log.entry_time,
          status: log.entry_status,
          date_only: log.entry_time.split(' ')
        });
      }
      
      if (log.exit_time) {
        processed.push({
          id: `${log.id}_exit`,
          type: 'Exit',
          time: log.exit_time,
          status: log.exit_status,
          date_only: log.exit_time.split(' ')
        });
      }
    });

    return processed.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [myLogs]);

  // Memoize stats with stable today calculation
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T');
    
    const todayEntry = processedLogs.filter(log => log.type === 'Entry' && log.date_only === today).length;
    const todayExit = processedLogs.filter(log => log.type === 'Exit' && log.date_only === today).length;
    const totalEntry = processedLogs.filter(log => log.type === 'Entry').length;
    const totalExit = processedLogs.filter(log => log.type === 'Exit').length;

    return { todayEntry, todayExit, totalEntry, totalExit };
  }, [processedLogs]);

  // Memoize recent logs
  const recentLogs = useMemo(() => processedLogs.slice(0, 5), [processedLogs]);

  // Stable format functions - no dependencies needed
  const formatTime = useCallback((dateTimeString) => {
    try {
      return new Date(dateTimeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Invalid Time';
    }
  }, []);

  const formatDate = useCallback((dateTimeString) => {
    try {
      return new Date(dateTimeString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  }, []);

  // Single focus effect with ref to prevent rerenders
  useFocusEffect(
    useCallback(() => {
      if (studentData?.student_id && initialLoadRef.current) {
        fetchMyLogs(studentData.student_id).finally(() => {
          initialLoadRef.current = false;
        });
      }
    }, [studentData?.student_id, fetchMyLogs])
  );

  // Stable handlers
  const onRefresh = useCallback(async () => {
    if (refreshing || !studentData?.student_id) return;
    
    setRefreshing(true);
    try {
      await fetchMyLogs(studentData.student_id);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, studentData?.student_id, fetchMyLogs]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await studentLogout();
              // navigation.replace('Login');
            } catch {
              Alert.alert('Logout Failed', 'Could not logout. Please try again.');
            }
          }
        }
      ]
    );
  }, [studentLogout, navigation]);

  const navigateToLogs = useCallback(() => {
    navigation.navigate('StudentLogs');
  }, [navigation]);

  // Don't render until we have student data
  if (!studentData) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background_default }}>
        <View className="flex-1 items-center justify-center">
          <Icon name="hourglass-empty" size={48} color={colors.text_secondary} />
          <Text className="text-base font-p_med mt-4" style={{ color: colors.text_secondary }}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background_default }}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="pt-2 pb-10"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View 
          className="rounded-b-[24px] pb-12 px-4 pt-3" 
          style={{ 
            backgroundColor: colors.primary_main,
            shadowColor: colors.primary_main,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-p_bold" style={{ color: colors.text_temp }}>
              Welcome Back! 👋
            </Text>
            <TouchableOpacity onPress={handleLogout} activeOpacity={Activity_Opacity}>
              <Icon name="logout" size={24} color={colors.text_temp} />
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <View className="relative">
              {studentData.profile_picture ? (
                <View 
                  className="w-20 h-20 rounded-full overflow-hidden"
                  style={{ 
                    borderWidth: 3, 
                    borderColor: colors.text_temp,
                  }}
                >
                  <Image
                    source={{ 
                      uri: `${baseIp}/static/${studentData.profile_picture}`,
                      // Add cache control
                      cache: 'reload'
                    }}
                    className="w-full h-full"
                    style={{ resizeMode: 'cover' }}
                    // Add loading placeholder
                    defaultSource={require('../../../assets/defaultavatar.png')}
                    // Add loading indicator
                    onLoadStart={() => console.log('Loading image...')}
                    onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                  />
                </View>
              ) : (
                <View 
                  className="w-20 h-20 rounded-full items-center justify-center"
                  style={{ 
                    borderWidth: 3, 
                    borderColor: colors.text_temp,
                    backgroundColor: colors.text_temp + '20'
                  }}
                >
                  <Icon name="person" size={40} color={colors.text_temp} />
                </View>
              )}
            </View>

            <Text className="text-lg font-p_bold mt-2" style={{ color: colors.text_temp }}>
              {studentData.name}
            </Text>
            <View 
              className="px-3 py-1 rounded-full mb-1"
              style={{ backgroundColor: colors.text_temp + '20' }}
            >
              <Text className="text-xs font-p_bold" style={{ color: colors.text_temp }}>
                Reg No: {studentData.register_no}
              </Text>
            </View>

            <View className="flex-row justify-center space-x-4 w-full mt-2">
              <View className="flex-1 max-w-[120px] p-2 rounded-xl items-center">
                <Icon name="badge" size={18} color={colors.text_temp} />
                <Text className="text-xs font-p_reg mt-1 text-center" style={{ color: colors.text_temp }}>
                  ID: {studentData.student_id}
                </Text>
              </View>
              <View className="flex-1 max-w-[120px] p-2 rounded-xl items-center">
                <Icon name="refresh" size={18} color={colors.text_temp} />
                <Text className="text-xs font-p_reg mt-1" style={{ color: colors.text_temp }}>
                  Pull to Refresh
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View className="mx-4 mt-4 p-4 rounded-xl border border-red-200" style={{ backgroundColor: '#fee2e2' }}>
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Icon name="warning" size={16} color="#dc2626" />
                  <Text className="text-sm font-p_semi ml-2" style={{ color: '#dc2626' }}>
                    Error Loading Data
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

        {/* Stats Cards */}
        <View className="px-4" style={{ marginTop: error ? -20 : -40 }}>
          <View 
            className="flex-row justify-between p-4 rounded-2xl mb-6" 
            style={{ 
              backgroundColor: colors.background_paper,
              shadowColor: colors.text_primary,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <View 
              className="flex-1 mr-2 p-3 rounded-2xl items-center" 
              style={{ 
                backgroundColor: colors.primary_main + '15',
                borderWidth: 1,
                borderColor: colors.primary_main + '30',
              }}
            >
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: colors.primary_main + '20' }}
              >
                <Icon name="login" size={20} color={colors.primary_main} />
              </View>
              <Text className="text-sm font-p_bold mb-2" style={{ color: colors.text_primary }}>
                Entry
              </Text>
              <Text className="text-xs font-p_reg mb-1" style={{ color: colors.text_secondary }}>
                Today: <Text className="font-p_bold" style={{ color: colors.primary_main }}>{stats.todayEntry}</Text>
              </Text>
              <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
                Total: <Text className="font-p_bold" style={{ color: colors.primary_main }}>{stats.totalEntry}</Text>
              </Text>
            </View>

            <View 
              className="flex-1 ml-2 p-3 rounded-2xl items-center" 
              style={{ 
                backgroundColor: colors.error_main + '15',
                borderWidth: 1,
                borderColor: colors.error_main + '30',
              }}
            >
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: colors.error_main + '20' }}
              >
                <Icon name="logout" size={20} color={colors.error_main} />
              </View>
              <Text className="text-sm font-p_bold mb-2" style={{ color: colors.text_primary }}>
                Exit
              </Text>
              <Text className="text-xs font-p_reg mb-1" style={{ color: colors.text_secondary }}>
                Today: <Text className="font-p_bold" style={{ color: colors.error_main }}>{stats.todayExit}</Text>
              </Text>
              <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
                Total: <Text className="font-p_bold" style={{ color: colors.error_main }}>{stats.totalExit}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activity Header */}
        <View className="px-4 mb-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-p_bold mb-1" style={{ color: colors.text_primary }}>
                Recent Activity
              </Text>
              <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
                Your latest entry and exit logs ({recentLogs.length} records)
              </Text>
            </View>
            <TouchableOpacity
              className="px-3 py-2 rounded-full"
              activeOpacity={Activity_Opacity}
              onPress={navigateToLogs}
            >
              <Text className="text-xs font-p_bold" style={{ color: colors.primary_main }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Cards */}
        <View className="px-4">
          {isLoading && initialLoadRef.current ? (
            <View className="items-center py-8">
              <Icon name="hourglass-empty" size={32} color={colors.text_secondary} />
              <Text className="text-sm font-p_med mt-2" style={{ color: colors.text_secondary }}>
                Loading your logs...
              </Text>
            </View>
          ) : recentLogs.length > 0 ? (
            recentLogs.map((log) => (
              <LogCard
                key={log.id}
                log={log}
                colors={colors}
                formatTime={formatTime}
                formatDate={formatDate}
              />
            ))
          ) : (
            <View className="items-center py-8">
              <Icon name="event-note" size={48} color={colors.text_secondary} />
              <Text className="text-base font-p_bold mt-4 mb-2" style={{ color: colors.text_primary }}>
                No Activity Yet
              </Text>
              <Text className="text-sm font-p_reg text-center px-4" style={{ color: colors.text_secondary }}>
                Your entry and exit logs will appear here once you start using the system.
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-4 mt-6 py-4">
          <Text className="text-base font-p_bold mb-4" style={{ color: colors.text_primary }}>
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="flex-1 p-4 rounded-2xl mr-2 items-center"
              style={{ backgroundColor: colors.background_paper }}
              activeOpacity={Activity_Opacity}
              onPress={navigateToLogs}
            >
              <Icon name="timeline" size={24} color={colors.primary_main} />
              <Text className="text-sm font-p_med mt-2" style={{ color: colors.text_primary }}>
                View Logs
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 p-4 rounded-2xl ml-2 items-center"
              style={{ backgroundColor: colors.background_paper }}
              activeOpacity={Activity_Opacity}
              onPress={onRefresh}
              disabled={refreshing}
            >
              <Icon 
                name="refresh" 
                size={24} 
                color={refreshing ? colors.text_secondary : colors.primary_main} 
              />
              <Text 
                className="text-sm font-p_med mt-2" 
                style={{ color: refreshing ? colors.text_secondary : colors.text_primary }}
              >
                {refreshing ? 'Loading...' : 'Refresh'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Memoized LogCard component to prevent individual card rerenders
const LogCard = React.memo(({ log, colors, formatTime, formatDate }) => (
  <View
    className="flex-row items-center justify-between px-4 py-4 rounded-2xl mb-3"
    style={{
      backgroundColor: colors.background_paper,
      borderLeftWidth: 4,
      borderLeftColor: log.type === 'Entry' ? colors.primary_main : colors.error_main,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    }}
  >
    <View className="flex-1">
      <View className="flex-row items-center mb-1">
        <Text className="text-sm font-p_bold mr-2" style={{ color: colors.text_primary }}>
          {log.type}
        </Text>
        {log.status && (
          <View 
            className="px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: log.status === 'On Time' ? '#10b981' : '#f59e0b'
            }}
          >
            <Text className="text-xs font-p_med text-white">
              {log.status}
            </Text>
          </View>
        )}
      </View>
      <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
        {formatDate(log.time)} • {formatTime(log.time)}
      </Text>
    </View>
    <View 
      className="w-10 h-10 rounded-full items-center justify-center"
      style={{ 
        backgroundColor: log.type === 'Entry' 
          ? colors.primary_main + '20' 
          : colors.error_main + '20' 
      }}
    >
      <Icon
        name={log.type === 'Entry' ? 'login' : 'logout'}
        size={20}
        color={log.type === 'Entry' ? colors.primary_main : colors.error_main}
      />
    </View>
  </View>
));
