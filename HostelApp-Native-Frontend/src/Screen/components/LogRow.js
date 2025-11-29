// components/LogRow.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';

const LogRow = React.memo(({ 
  log, 
  showStudentInfo = false, 
  onPress = null,
  formatTime,
  formatDate 
}) => {
  const { colors } = useTheme();

  // Format functions if not provided
  const defaultFormatTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Time';
    }
  };

  const defaultFormatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const timeFormatter = formatTime || defaultFormatTime;
  const dateFormatter = formatDate || defaultFormatDate;

  return (
    <View
      className="mb-3 overflow-hidden"
      style={{
        backgroundColor: colors.background_paper,
        borderRadius: 16
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.7 : 1}
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
              {showStudentInfo ? log.name : log.type}
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
            {showStudentInfo ? (
              `#{log.register_no || log.student_id} • ${log.type} • ${dateFormatter(log.time)} • ${timeFormatter(log.time)}`
            ) : (
              `${dateFormatter(log.time)} • ${timeFormatter(log.time)}`
            )}
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
      </TouchableOpacity>
    </View>
  );
});

export default LogRow;
