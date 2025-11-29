import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ApiContext } from '../Context/Context';
import Home from '../Screen/Student/Home';
import Dashboard from '../Screen/Admin/Dashboard';

const Parent = () => {
  const { 
    isAdminLoggedIn, 
    isStudentLoggedIn,
    adminData,
    studentData,
    isLoading 
  } = useContext(ApiContext);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isAdminLoggedIn) {
    return <Dashboard />;
  }

  if (isStudentLoggedIn) {
    return <Home />;
  }

  return null;
};

export default Parent;