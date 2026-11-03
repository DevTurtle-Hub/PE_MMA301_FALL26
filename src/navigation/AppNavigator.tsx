import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';
import { BookProvider } from '../context/BookContext';

// Screens (Home, Login, Register, List, Detail)
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ListScreen } from '../screens/ListScreen';
import { DetailScreen } from '../screens/DetailScreen';

import { THEME } from '../config/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  // Requirement: "Đã đăng nhập -> Chuyển thẳng vào màn hình List (không được chớp/flash màn hình Home)"
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  // Requirement: "Logged out, the app opens on the Home screen; after logging in you land on the List screen"
  if (user == null) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  // Đã đăng nhập -> Chuyển thẳng vào màn hình List
  return (
    <BookProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </BookProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});
