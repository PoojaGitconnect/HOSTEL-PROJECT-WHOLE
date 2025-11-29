import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ApiContext } from '../Context/Context';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [registerNo, setRegisterNo] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { colors } = useTheme();
  const navigation = useNavigation();
  const {
    adminLogin,
    studentLogin,
    isLoading,
    error,
    clearError
  } = useContext(ApiContext);

  const handleLogin = async () => {
    try {
      if (error) clearError();

      if (role === 'admin') {
        if (!username.trim()) {
          Alert.alert('Required Field', 'Please enter your username');
          return;
        }
        if (!password.trim()) {
          Alert.alert('Required Field', 'Please enter your password');
          return;
        }

        console.log('Admin login attempt:', { username });
        const response = await adminLogin(username, password);
        console.log('Admin login response:', response);
        
        if (response && response.status === 'success') {
          // navigation.replace('AdminHome');
        } else {
          Alert.alert('Login Failed', response?.message || 'Invalid credentials');
        }

      } else {
        if (!name.trim()) {
          Alert.alert('Required Field', 'Please enter your name');
          return;
        }
        if (!registerNo.trim()) {
          Alert.alert('Required Field', 'Please enter your register number');
          return;
        }
        if (!/^\d+$/.test(registerNo)) {
          Alert.alert('Invalid Format', 'Register number must contain only digits');
          return;
        }

        console.log('Student login attempt:', { name, registerNo });
        const response = await studentLogin(name, registerNo);
        console.log('Student login response:', response);
        
        if (response && response.status === 'success') {
          // navigation.replace('StudentHome');
        } else {
          Alert.alert('Login Failed', response?.message || 'Invalid name or register number');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Login Failed', err?.message || error || 'Unknown error occurred');
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background_default }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary_main} />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Compact Header */}
        <View 
          className="relative overflow-hidden"
          style={{ 
            backgroundColor: colors.primary_main,
            height: height * 0.32,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28
          }}
        >
          {/* Minimal Background Elements */}
          <View 
            className="absolute opacity-10"
            style={{
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: 'rgba(255,255,255,0.1)'
            }}
          />
          <View 
            className="absolute opacity-8"
            style={{
              bottom: -20,
              left: -20,
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(255,255,255,0.08)'
            }}
          />

          {/* Compact Header Content */}
          <View className="flex-1 justify-center items-center px-6">
            {/* Smaller Logo */}
            <View 
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Icon name="school" size={28} color="white" />
            </View>

            {/* Compact Title */}
            <Text 
              className="text-2xl font-p_bold text-center mb-2"
              style={{ color: colors.text_temp }}
            >
              POLY Hostel
            </Text>
            <Text 
              className="text-sm font-p_reg text-center opacity-90 mb-3"
              style={{ color: colors.text_temp }}
            >
              Management System
            </Text>
            <Text 
              className="text-base font-p_med text-center"
              style={{ color: colors.text_temp }}
            >
              Welcome Back!
            </Text>
          </View>
        </View>

        {/* Compact Main Content */}
        <View className="flex-1 px-5 -mt-6">
          {/* Compact Login Card */}
          <View 
            className="rounded-2xl shadow-lg p-5"
            style={{ 
              backgroundColor: colors.background_paper,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8
            }}
          >
            {/* Compact Role Switcher */}
            <View className="mb-6">
              <Text 
                className="text-base font-p_semi text-center mb-3"
                style={{ color: colors.text_primary }}
              >
                Login Type
              </Text>
              <View 
                className="flex-row p-1 rounded-xl"
                style={{ backgroundColor: colors.background_default }}
              >
                <TouchableOpacity 
                  onPress={() => {
                    setRole('admin');
                    setUsername(''); setPassword(''); setName(''); setRegisterNo('');
                    if (error) clearError();
                  }}
                  className={`flex-1 py-2.5 rounded-lg`}
                  style={{
                    backgroundColor: role === 'admin' ? colors.primary_main : 'transparent',
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    <Icon 
                      name="admin-panel-settings" 
                      size={16} 
                      color={role === 'admin' ? 'white' : colors.text_secondary}
                    />
                    <Text 
                      className="font-p_semi ml-2 text-sm"
                      style={{ color: role === 'admin' ? 'white' : colors.text_secondary }}
                    >
                      Admin
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    setRole('student');
                    setUsername(''); setPassword(''); setName(''); setRegisterNo('');
                    if (error) clearError();
                  }}
                  className={`flex-1 py-2.5 rounded-lg`}
                  style={{
                    backgroundColor: role === 'student' ? colors.primary_main : 'transparent',
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    <Icon 
                      name="school" 
                      size={16} 
                      color={role === 'student' ? 'white' : colors.text_secondary}
                    />
                    <Text 
                      className="font-p_semi ml-2 text-sm"
                      style={{ color: role === 'student' ? 'white' : colors.text_secondary }}
                    >
                      Student
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Compact Error Display */}
            {error && (
              <View 
                className="mb-4 p-3 rounded-xl border"
                style={{ 
                  backgroundColor: '#fef2f2', 
                  borderColor: '#fecaca' 
                }}
              >
                <View className="flex-row items-center">
                  <View 
                    className="w-6 h-6 rounded-full items-center justify-center mr-2"
                    style={{ backgroundColor: '#fee2e2' }}
                  >
                    <Icon name="error" size={14} color="#dc2626" />
                  </View>
                  <Text 
                    className="flex-1 text-sm font-p_med"
                    style={{ color: '#dc2626' }}
                  >
                    {error}
                  </Text>
                </View>
              </View>
            )}

            {/* Compact Input Fields */}
            <View className="space-y-4 mb-5">
              {/* First Input */}
              <View>
                <Text 
                  className="text-sm font-p_semi mb-2"
                  style={{ color: colors.text_primary }}
                >
                  {role === 'admin' ? 'Username' : 'Full Name'} *
                </Text>
                <View
                  className={`flex-row items-center px-3 py-3 rounded-xl border-2`}
                  style={{
                    borderColor: usernameFocused ? colors.primary_main : colors.background_default,
                    backgroundColor: usernameFocused 
                      ? colors.primary_main + '08' 
                      : colors.background_default
                  }}
                >
                  <View 
                    className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: usernameFocused 
                        ? colors.primary_main + '20' 
                        : colors.background_paper 
                    }}
                  >
                    <Icon
                      name={role === 'admin' ? 'person' : 'account-circle'}
                      size={18}
                      color={usernameFocused ? colors.primary_main : colors.text_secondary}
                    />
                  </View>
                  <TextInput
                    value={role === 'admin' ? username : name}
                    onChangeText={role === 'admin' ? setUsername : setName}
                    onFocus={() => setUsernameFocused(true)}
                    onBlur={() => setUsernameFocused(false)}
                    placeholder={role === 'admin' ? 'Enter username' : 'Enter your full name'}
                    placeholderTextColor={colors.text_secondary}
                    style={{ color: colors.text_primary }}
                    className="flex-1 text-base font-p_reg"
                    keyboardType="default"
                    autoCapitalize={role === 'admin' ? 'none' : 'words'}
                  />
                </View>
              </View>

              {/* Second Input */}
              <View>
                <Text 
                  className="text-sm font-p_semi mb-2"
                  style={{ color: colors.text_primary }}
                >
                  {role === 'admin' ? 'Password' : 'Register Number'} *
                </Text>
                <View
                  className={`flex-row items-center px-3 py-3 rounded-xl border-2`}
                  style={{
                    borderColor: passwordFocused ? colors.primary_main : colors.background_default,
                    backgroundColor: passwordFocused 
                      ? colors.primary_main + '08' 
                      : colors.background_default
                  }}
                >
                  <View 
                    className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: passwordFocused 
                        ? colors.primary_main + '20' 
                        : colors.background_paper 
                    }}
                  >
                    <Icon
                      name={role === 'admin' ? 'lock' : 'badge'}
                      size={18}
                      color={passwordFocused ? colors.primary_main : colors.text_secondary}
                    />
                  </View>
                  <TextInput
                    value={role === 'admin' ? password : registerNo}
                    onChangeText={role === 'admin' ? setPassword : setRegisterNo}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder={role === 'admin' ? 'Enter password' : 'Enter register number'}
                    placeholderTextColor={colors.text_secondary}
                    secureTextEntry={role === 'admin' && !showPass}
                    className="flex-1 text-base font-p_reg"
                    style={{ color: colors.text_primary }}
                    keyboardType={role === 'admin' ? 'default' : 'number-pad'}
                  />
                  {role === 'admin' && (
                    <TouchableOpacity
                      onPress={() => setShowPass(!showPass)}
                      activeOpacity={0.7}
                      className="w-8 h-8 rounded-lg items-center justify-center"
                      style={{ backgroundColor: colors.background_paper }}
                    >
                      <Icon
                        name={showPass ? 'visibility' : 'visibility-off'}
                        size={18}
                        color={colors.primary_main}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* Compact Sign In Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="py-3.5 rounded-xl shadow-lg mb-3"
              style={{ 
                backgroundColor: colors.primary_main,
                opacity: isLoading ? 0.7 : 1,
                shadowColor: colors.primary_main,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6
              }}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <>
                    <View 
                      className="w-4 h-4 rounded-full border-2 border-white border-t-transparent mr-2"
                      style={{
                        transform: [{ rotate: '0deg' }]
                      }}
                    />
                    <Text className="text-white text-base font-p_semi">
                      Signing In...
                    </Text>
                  </>
                ) : (
                  <>
                    <Icon name="login" size={18} color="white" />
                    <Text className="text-white text-base font-p_semi ml-2">
                      Sign In
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Compact Footer */}
          <View className="mt-4 mb-6 items-center">
            <View className="flex-row items-center">
              <Icon name="security" size={14} color={colors.text_secondary} />
              <Text 
                className="text-xs font-p_med ml-2"
                style={{ color: colors.text_secondary }}
              >
                Your data is secure with us
              </Text>
            </View>
            <Text 
              className="text-xs font-p_reg mt-2"
              style={{ color: colors.text_secondary }}
            >
              POLY Hostel Management v1.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
