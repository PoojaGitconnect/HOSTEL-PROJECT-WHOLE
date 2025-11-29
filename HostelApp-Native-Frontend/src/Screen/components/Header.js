import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AppHeader({
  screenName,
  backIcon,
  RenderIcon,
  absolute,
  RenderMenu,
}) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const absoluteStyle = absolute
    ? {
        position: 'absolute',
        top: 0,
        zIndex: 10,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
      }
    : { backgroundColor: colors.background_default, height: 50 };

  return (
    <Appbar.Header style={[absoluteStyle]}>
      <Appbar.Action
        animated={false}
        icon={() => (
          <Ionicons
            name="chevron-back-outline" // Custom icon name
            size={24}
            color={absolute ? colors.text_secondary : colors.text_primary}
          />
        )}
        onPress={handleBackPress}
        style={{
          backgroundColor: colors.background_default,
        }}
      />
      <Appbar.Content
        title={screenName}
        titleStyle={{
          fontSize: 17,
          fontFamily: 'Poppins-SemiBold',
          color: colors.text_primary,
        }}
      />
      {RenderIcon && <RenderIcon />}
      {RenderMenu && <RenderMenu />}
    </Appbar.Header>
  );
}
