import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function InfoRow({ icon, label, value, colors }) {
  return (
    <View className="flex-row justify-between items-center py-3">
      <View className="flex-row items-center space-x-3">
        <Icon 
          name={icon} 
          size={20} 
          color={colors.text_secondary || '#666'} 
        />
        <Text 
          className="text-sm font-medium"
          style={{ color: colors.text_secondary || '#666' }}
        >
          {label}
        </Text>
      </View>
      <Text 
        className="text-sm font-regular text-right flex-1 ml-4"
        style={{ color: colors.text_primary || '#000' }}
      >
        {value}
      </Text>
    </View>
  );
}