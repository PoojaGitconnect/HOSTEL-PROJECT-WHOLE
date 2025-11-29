import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoRow from '../components/Inforow';
import AppHeader from '../components/Header';

export default function ProfileDetail({ route }) {
  const { colors } = useTheme();
  const { profile } = route.params;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background_default }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader absolute={true}/>
        
        {/* Header with background image and avatar */}
        <View className="relative mb-14">
          <View className="h-36 rounded-b-3xl overflow-hidden" style={{ backgroundColor: colors.primary_dark }}>
            {/* Background swirl image */}
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop' }}
              style={{ width: '100%', height: '100%', opacity: 0.5 }}
              resizeMode="cover"
            />
          </View>

          {/* Profile image */}
            <View className="absolute bottom-[-40] left-1/2" style={{ transform: [{ translateX: -56 }] }}>
            <View
                className="w-28 h-28 rounded-full overflow-hidden border-4"
                style={{ borderColor: colors.background_default }}
            >
                <Image
                source={{ uri: profile?.avatar || 'https://i.pravatar.cc/100?img=5' }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                />
            </View>
            </View>

        </View>

        {/* Main Content */}
        <View className="px-4">
          {/* Name */}
          <Text className="text-xl font-p_semi text-center mb-1" style={{ color: colors.text_primary }}>
            {profile?.name || 'Amélie Laurent'}
          </Text>

          {/* Section Heading */}
          <Text className="text-lg font-p_semi mb-4 mt-6" style={{ color: colors.text_primary }}>
            Basic Information
          </Text>

          {/* Info Container */}
          <View
            className="rounded-2xl px-4 py-5 space-y-4"
            style={{ backgroundColor: colors.background_paper }}
          >
            <InfoRow icon="badge" label="Student ID" value={profile?.roll || 'ST101'} colors={colors} />
            <InfoRow icon="meeting-room" label="Room No" value={profile?.room || 'A-102'} colors={colors} />
            <InfoRow icon="cake" label="Age" value={profile?.age?.toString() || '21'} colors={colors} />
            <InfoRow icon="phone" label="Phone Number" value={profile?.phone || '+91 98765 43210'} colors={colors} />
            <InfoRow icon="event" label="Joining Date" value={profile?.joiningDate || '01 July 2024'} colors={colors} />
            <InfoRow icon="home" label="Address" value={profile?.address || 'Udupi, Karnataka'} colors={colors} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
