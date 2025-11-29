import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Parent from './Parent.js';
import { StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import Login from '../Screen/Login.js';
import AddStudent from '../Screen/Admin/AddStudent.js';
import ManageStudents from '../Screen/Admin/ManageStudents.js';
import Home from '../Screen/Student/Home.js';
import ManageLogs from '../Screen/Admin/ManageLogs.js';
import { ApiContext } from '../Context/Context';
import EditStudent from '../Screen/Admin/EditStudent.js';
import ViewLogs from '../Screen/Student/ViewLogs.js';

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  const { isAdminLoggedIn, isStudentLoggedIn } = useContext(ApiContext);
  const isLogged = isAdminLoggedIn || isStudentLoggedIn;

  let theme = useTheme();

  const isDarkTheme = theme.colors.background_default === '#000000';
  let barStyle = isDarkTheme ? 'light-content' : 'dark-content';

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background_default}
        barStyle={barStyle}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLogged ? (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ animation: 'fade_from_bottom' }}
            />
          ) : (
            <Stack.Screen
              name="Parent"
              component={Parent}
              options={{ animation: 'fade_from_bottom' }}
            />
          )}

          {/* Student Screen */}
          <Stack.Screen
            name="Home"
            component={Parent}
            options={{ animation: 'fade_from_bottom' }}
          />

          {/* Admin Screen */}
          <Stack.Screen
            name="Dashboard"
            component={Parent}
            options={{ animation: 'fade_from_bottom' }}
          />

          <Stack.Screen
            name="AddStudent"
            component={AddStudent}
            options={{ animation: 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="EditStudent"
            component={EditStudent}
            options={{ animation: 'fade_from_bottom' }}
          />

          <Stack.Screen
            name="ManageStudents"
            component={ManageStudents}
            options={{ animation: 'fade_from_bottom' }}
          />

          <Stack.Screen
            name="StudentLogs"
            component={ViewLogs}
            options={{ animation: 'fade_from_bottom' }}
          />

          <Stack.Screen
            name="ManageLogs"
            component={ManageLogs}
            options={{ animation: 'fade_from_bottom' }}
          />

          {/*Student Screen*/}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}