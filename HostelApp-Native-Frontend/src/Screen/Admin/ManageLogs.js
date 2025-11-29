import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/Header';
import { ApiContext } from '../../Context/Context';

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatLogDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const LogCard = React.memo(({ log, colors }) => (
  <View
    className="mb-3 overflow-hidden"
    style={{
      backgroundColor: colors.background_paper,
      borderRadius: 16
    }}
  >
    <View
      className="flex-row items-center px-4 py-4"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: log.type === 'Entry' ? colors.primary_main : colors.error_main,
      }}
    >
      {/* Left Content */}
      <View className="flex-1 mr-3">
        <View className="flex-row items-center mb-1">
          <Text 
            numberOfLines={1} 
            className="text-sm font-p_bold flex-1 mr-2" 
            style={{ color: colors.text_primary }}
          >
            {log.name}
          </Text>
          {log.status && log.status !== 'Unknown' && (
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
        <Text 
          className="text-xs font-p_reg" 
          style={{ color: colors.text_secondary }}
        >
          #{log.register_no} • {formatLogDate(log.time)} • {formatTime(log.time)}
        </Text>
      </View>

      {/* Right Icon */}
      <View 
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ 
          backgroundColor: log.type === 'Entry' 
            ? colors.primary_main + '15' 
            : colors.error_main + '15' 
        }}
      >
        <Icon
          name={log.type === 'Entry' ? 'login' : 'logout'}
          size={20}
          color={log.type === 'Entry' ? colors.primary_main : colors.error_main}
        />
      </View>
    </View>
  </View>
));

export default function ManageLogs() {
  const { colors } = useTheme();
  const { logs, fetchLogs, isLoading, error, clearError } = useContext(ApiContext);
  
  // Set initial date to September 1, 2025 (where your data exists)
  const [selectedDate, setSelectedDate] = useState(new Date('2025-09-01'));
  const [showPicker, setShowPicker] = useState(false);
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Fetch logs on component mount
  useEffect(() => {
    const loadLogs = async () => {
      try {
        console.log('Starting to fetch logs...');
        const response = await fetchLogs();
        console.log('Logs response:', response);
        console.log('Logs from context:', logs);
        console.log('Total logs loaded:', logs?.length || 0);
        
        // Debug: Show first few logs
        if (logs && logs.length > 0) {
          console.log('First log sample:', logs[0]);
          console.log('Log structure keys:', Object.keys(logs[0]));
        }
      } catch (error) {
        console.error('Error loading logs:', error);
      }
    };
    
    loadLogs();
  }, []);

  // Debug: Log whenever logs state changes
  useEffect(() => {
    console.log('Logs state updated:', logs?.length || 0, 'logs');
    if (logs && logs.length > 0) {
      console.log('Sample log structure:', logs[0]);
    }
  }, [logs]);

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      console.log('Refreshing logs...');
      await fetchLogs();
    } catch (error) {
      console.log('Refresh error:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  // Format time from datetime string
  const formatTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Time';
    }
  };

  // Format date from datetime string
  const formatLogDate = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Process logs to show individual entry/exit records
  const processLogs = () => {
    console.log('Processing logs, raw logs count:', logs?.length || 0);
    
    if (!logs || logs.length === 0) {
      console.log('No logs to process');
      return [];
    }

    const processedLogs = [];
    
    logs.forEach((log, index) => {
      console.log(`Processing log ${index}:`, {
        id: log.id,
        name: log.name,
        register_no: log.register_no,
        student_id: log.student_id,
        entry_time: log.entry_time,
        exit_time: log.exit_time,
        entry_status: log.entry_status || log.entry_Status, // Handle both cases
        exit_status: log.exit_status
      });

      // Add entry record if exists
      if (log.entry_time && log.entry_time !== null && log.entry_time !== '') {
        processedLogs.push({
          id: `${log.id}_entry`,
          name: log.name || `Student ${log.student_id}`, // Fallback name
          register_no: log.register_no || 'Unknown',
          type: 'Entry',
          time: log.entry_time,
          status: log.entry_status || log.entry_Status || 'Unknown', // Handle both cases
          student_id: log.student_id,
          original_log_id: log.id
        });
        console.log(`Added entry record for log ${log.id}`);
      }
      
      // Add exit record if exists
      if (log.exit_time && log.exit_time !== null && log.exit_time !== '') {
        processedLogs.push({
          id: `${log.id}_exit`,
          name: log.name || `Student ${log.student_id}`, // Fallback name
          register_no: log.register_no || 'Unknown',
          type: 'Exit',
          time: log.exit_time,
          status: log.exit_status || 'Unknown',
          student_id: log.student_id,
          original_log_id: log.id
        });
        console.log(`Added exit record for log ${log.id}`);
      }
    });

    console.log('Processed logs count:', processedLogs.length);
    if (processedLogs.length > 0) {
      console.log('Sample processed log:', processedLogs[0]);
    }

    // Sort by time (most recent first)
    const sortedLogs = processedLogs.sort((a, b) => new Date(b.time) - new Date(a.time));
    console.log('Sorted logs count:', sortedLogs.length);
    
    return sortedLogs;
  };

  // Filter logs based on selected date, filter type, and search query
  const processedLogs = processLogs();
  const filteredLogs = processedLogs.filter((log) => {
    const logDate = formatLogDate(log.time);
    const selectedDateStr = formatDate(selectedDate);
    const sameDate = logDate === selectedDateStr;
    const matchType = filter === 'All' || log.type === filter;
    
    // Search functionality - search by name, register_no, or student_id
    const matchSearch = searchQuery === '' || 
      (log.name && log.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.register_no && log.register_no.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.student_id && log.student_id.toString().includes(searchQuery));
    
    console.log(`Filtering log ${log.id}:`, {
      logTime: log.time,
      logDate,
      selectedDateStr,
      sameDate,
      type: log.type,
      filter,
      matchType,
      searchQuery,
      matchSearch,
      included: sameDate && matchType && matchSearch
    });
    
    return sameDate && matchType && matchSearch;
  });

  console.log('Final filtered logs count:', filteredLogs.length);
  console.log('Selected date:', selectedDate.toDateString());
  console.log('Filter:', filter);
  console.log('Search Query:', searchQuery);

  const renderIcons = () => {
    return (
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity 
          onPress={() => setShowSearch(!showSearch)}
        >
          <Icon 
            name="search" 
            size={24} 
            color={showSearch ? colors.primary_main : colors.text_secondary} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onRefresh}
          disabled={isLoading}
        >
          <Icon 
            name="refresh" 
            size={24} 
            color={isLoading ? colors.text_disabled : colors.primary_main} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Icon name="calendar-today" size={24} color={colors.primary_main} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background_default }}>
      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AppHeader screenName={'Manage Logs'} RenderIcon={renderIcons} />

        {/* Search Bar */}
        {showSearch && (
          <View className="mb-4">
            <View 
              className="flex-row items-center px-4 py-1 rounded-2xl border-2"
              style={{
                backgroundColor: colors.background_paper,
                borderColor: searchQuery ? colors.primary_main : colors.background_default
              }}
            >
              <Icon name="search" size={20} color={colors.text_secondary} />
              <TextInput
                className="flex-1 ml-3 text-base font-p_reg"
                style={{ color: colors.text_primary }}
                placeholder="Search by name, register no, or student ID..."
                placeholderTextColor={colors.text_secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={showSearch}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon name="clear" size={20} color={colors.text_secondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Error Display */}
        {error && (
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
              <TouchableOpacity onPress={clearError}>
                <Icon name="close" size={20} color={colors.error_main} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Stats Card */}
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
                  {filteredLogs.length} Records
                </Text>
                <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
                  for {selectedDate.toDateString()}
                  {searchQuery && ` • "${searchQuery}"`}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-sm font-p_med" style={{ color: colors.text_primary }}>
                Total: {processedLogs.length}
              </Text>
              <Text className="text-xs font-p_reg" style={{ color: colors.text_secondary }}>
                {isLoading ? 'Loading...' : 'All time'}
              </Text>
            </View>
          </View>
        </View>

        {/* Date Picker */}
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowPicker(false);
              if (date) {
                console.log('Date changed to:', date.toDateString());
                setSelectedDate(date);
              }
            }}
          />
        )}

        {/* Filter Buttons */}
        <View className="flex-row justify-between mb-6">
          {['All', 'Entry', 'Exit'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                console.log('Filter changed to:', item);
                setFilter(item);
              }}
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

        {/* Logs List - Proper alignment without extra container */}
        {isLoading ? (
          <View className="items-center py-8">
            <Icon name="hourglass-empty" size={32} color={colors.text_secondary} />
            <Text className="text-sm font-p_med mt-2" style={{ color: colors.text_secondary }}>
              Loading logs...
            </Text>
          </View>
        ) : filteredLogs.length > 0 ? (
          filteredLogs.map(log => (
            <LogCard
              key={`${log.id}_${log.type}`}
              log={log}
              colors={colors}
            />
          ))
        ) : (
          <View className="items-center py-8">
            <Icon name="event-note" size={48} color={colors.text_secondary} />
            <Text className="text-base font-p_bold mt-4 mb-2" style={{ color: colors.text_primary }}>
              No Logs Found
            </Text>
            <Text 
              className="text-sm font-p_reg text-center mt-2" 
              style={{ color: colors.text_secondary }}
            >
              {error 
                ? 'Unable to load logs. Please try refreshing.'
                : searchQuery 
                  ? `No results found for "${searchQuery}"`
                  : `No ${filter.toLowerCase()} records found for selected date.`
              }
            </Text>
            {searchQuery && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                className="mt-3 px-4 py-2 rounded-xl"
                style={{ backgroundColor: colors.primary_main }}
              >
                <Text className="text-sm font-p_med" style={{ color: colors.text_temp }}>
                  Clear Search
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
