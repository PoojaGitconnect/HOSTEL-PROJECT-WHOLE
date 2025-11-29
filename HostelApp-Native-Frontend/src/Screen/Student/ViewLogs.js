// screens/StudentLogs.js
import React, { useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ApiContext } from '../../Context/Context';
import LogRow from '../components/LogRow';

const StudentLogs = React.memo(() => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  
  const {
    studentData,
    myLogs,
    fetchMyLogs,
    isLoading,
    error,
    clearError
  } = useContext(ApiContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  // Stable format functions
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

  const formatDateOnly = useCallback((dateTimeString) => {
    try {
      return new Date(dateTimeString).toISOString().split('T');
    } catch {
      return 'Invalid Date';
    }
  }, []);

  // Process logs into individual entry/exit records
  const processedLogs = useMemo(() => {
    if (!myLogs?.length) return [];

    const processed = [];
    myLogs.forEach(log => {
      if (log.entry_time) {
        processed.push({
          id: `${log.id}_entry`,
          name: studentData?.name || 'Student',
          register_no: studentData?.register_no || log.register_no,
          student_id: studentData?.student_id || log.student_id,
          type: 'Entry',
          time: log.entry_time,
          status: log.entry_status,
          // Store full date string
          date: new Date(log.entry_time).toISOString()
        });
      }
      
      if (log.exit_time) {
        processed.push({
          id: `${log.id}_exit`,
          name: studentData?.name || 'Student',
          register_no: studentData?.register_no || log.register_no,
          student_id: studentData?.student_id || log.student_id,
          type: 'Exit',
          time: log.exit_time,
          status: log.exit_status,
          // Store full date string
          date: new Date(log.exit_time).toISOString()
        });
      }
    });

    return processed.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [myLogs, studentData]);

  // Filter logs by date and type
  const filteredLogs = useMemo(() => {
    // Set time to start of day in local timezone
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Set time to end of day in local timezone
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    return processedLogs.filter((log) => {
      const logDate = new Date(log.time);
      
      // Check if log falls within the selected day
      const withinDay = logDate >= startOfDay && logDate <= endOfDay;
      const matchType = filter === 'All' || log.type === filter;
      
      console.log('Log filtering:', {
        logDate: logDate.toISOString(),
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
        withinDay,
        type: log.type,
        matchType
      });

      return withinDay && matchType;
    });
  }, [processedLogs, selectedDate, filter]);

  // Refresh handler
  const onRefresh = useCallback(async () => {
    if (refreshing || !studentData?.student_id) return;
    
    setRefreshing(true);
    try {
      await fetchMyLogs(studentData.student_id);
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh logs');
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, studentData?.student_id, fetchMyLogs]);

  // Date picker handler
  const handleDateChange = useCallback((event, date) => {
    setShowPicker(false);
    if (date) {
      // Set time to midnight for consistent date comparison
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      setSelectedDate(newDate);
      
      // Optionally refresh logs when date changes
      if (studentData?.student_id) {
        fetchMyLogs(studentData.student_id);
      }
    }
  }, [studentData?.student_id, fetchMyLogs]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('Current state:', {
      selectedDate: selectedDate.toISOString(),
      filter,
      logsCount: processedLogs.length,
      filteredCount: filteredLogs.length
    });
  }, [selectedDate, filter, processedLogs, filteredLogs]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background_default }}>
      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={goBack} className="mr-3">
              <Icon name="arrow-back" size={24} color={colors.text_primary} />
            </TouchableOpacity>
            <Text className="text-xl font-p_bold" style={{ color: colors.text_primary }}>
              My Logs
            </Text>
          </View>
          
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity onPress={onRefresh} disabled={isLoading}>
              <Icon 
                name="refresh" 
                size={24} 
                color={isLoading ? colors.text_secondary : colors.primary_main} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Icon name="calendar-today" size={24} color={colors.primary_main} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <ErrorDisplay error={error} colors={colors} onClear={clearError} />
        )}

        {/* Stats Card */}
        <StatsCard 
          colors={colors}
          filteredCount={filteredLogs.length}
          totalCount={processedLogs.length}
          selectedDate={selectedDate}
          isLoading={isLoading}
        />

        {/* Date Picker */}
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Filter Buttons */}
        <FilterButtons 
          colors={colors}
          filter={filter}
          setFilter={setFilter}
        />

        {/* Logs List */}
        <LogsList 
          colors={colors}
          filteredLogs={filteredLogs}
          processedLogs={processedLogs}
          isLoading={isLoading}
          error={error}
          selectedDate={selectedDate}
          filter={filter}
          formatTime={formatTime}
          formatDate={formatDate}
        />
      </ScrollView>
    </SafeAreaView>
  );
});

// Memoized sub-components
const ErrorDisplay = React.memo(({ error, colors, onClear }) => (
  <View 
    className="mb-4 p-4 rounded-2xl border" 
    style={{ 
      backgroundColor: colors.background_paper,
      borderColor: colors.error_main,
      borderWidth: 1
    }}
  >
    <View className="flex-row justify-between items-start">
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Icon name="warning" size={16} color={colors.error_main} />
          <Text className="text-sm font-p_semi ml-2" style={{ color: colors.error_main }}>
            Error Loading Logs
          </Text>
        </View>
        <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
          {error}
        </Text>
      </View>
      <TouchableOpacity onPress={onClear}>
        <Icon name="close" size={20} color={colors.error_main} />
      </TouchableOpacity>
    </View>
  </View>
));

const StatsCard = React.memo(({ colors, filteredCount, totalCount, selectedDate, isLoading }) => (
  <View 
    className="mb-4 p-4 rounded-2xl"
    style={{ backgroundColor: colors.background_paper }}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View 
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: colors.background_neutral }}
        >
          <Icon name="timeline" size={24} color={colors.primary_main} />
        </View>
        <View>
          <Text className="text-lg font-p_bold" style={{ color: colors.text_primary }}>
            {filteredCount} Records
          </Text>
          <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
            for {selectedDate.toDateString()}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-sm font-p_med" style={{ color: colors.text_primary }}>
          Total: {totalCount}
        </Text>
        <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
          {isLoading ? 'Loading...' : 'All time'}
        </Text>
      </View>
    </View>
  </View>
));

const FilterButtons = React.memo(({ colors, filter, setFilter }) => (
  <View className="flex-row justify-between mb-6">
    {['All', 'Entry', 'Exit'].map((item) => (
      <TouchableOpacity
        key={item}
        onPress={() => setFilter(item)}
        className={`w-[30%] py-3 rounded-2xl ${filter === item ? '' : 'border'}`}
        style={{
          backgroundColor: filter === item ? colors.primary_main : 'transparent',
          borderColor: colors.primary_main,
          borderWidth: filter === item ? 0 : 1
        }}
      >
        <Text
          className="text-center text-sm font-p_med"
          style={{
            color: filter === item ? colors.text_temp : colors.primary_main,
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
));

const LogsList = React.memo(({ 
  colors, 
  filteredLogs, 
  processedLogs, 
  isLoading, 
  error, 
  selectedDate, 
  filter,
  formatTime,
  formatDate 
}) => (
  <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.background_paper }}>
    {isLoading && processedLogs.length === 0 ? (
      <View className="p-8 items-center">
        <Icon name="hourglass-empty" size={32} color={colors.text_secondary} />
        <Text className="text-sm font-p_med mt-2" style={{ color: colors.text_secondary }}>
          Loading logs...
        </Text>
      </View>
    ) : filteredLogs.length > 0 ? (
      <View className="p-4">
        {filteredLogs.map((log) => (
          <LogRow
            key={log.id}
            log={log}
            showStudentInfo={false}
            formatTime={formatTime}
            formatDate={formatDate}
          />
        ))}
      </View>
    ) : (
      <EmptyState 
        colors={colors}
        error={error}
        processedLogsLength={processedLogs.length}
        selectedDate={selectedDate}
        filter={filter}
      />
    )}
  </View>
));

const EmptyState = React.memo(({ colors, error, processedLogsLength, selectedDate, filter }) => (
  <View className="p-8 items-center">
    <Icon name="event-note" size={48} color={colors.text_secondary} />
    <Text className="text-base font-p_bold mt-4 mb-2" style={{ color: colors.text_primary }}>
      No Logs Found
    </Text>
    <Text className="text-sm font-p_reg text-center px-4" style={{ color: colors.text_secondary }}>
      {error 
        ? 'Unable to load logs. Please try refreshing.'
        : processedLogsLength === 0
          ? 'No logs available yet.'
          : `No ${filter.toLowerCase()} records found for ${selectedDate.toDateString()}.`
      }
    </Text>
  </View>
));

export default StudentLogs;
