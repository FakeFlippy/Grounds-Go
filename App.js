import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import MapScreen from './screens/MapScreen';
import RoutesScreen from './screens/RoutesScreen';
import PlannerScreen from './screens/PlannerScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#232F3E" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Routes') {
              iconName = focused ? 'bus' : 'bus-outline';
            } else if (route.name === 'Planner') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#1C1C1E',
            borderTopColor: '#38383A',
            height: 90,
            paddingBottom: 30,
            paddingTop: 10,
          },
          headerStyle: {
            backgroundColor: '#232F3E',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        })}
      >
        <Tab.Screen 
          name="Map" 
          component={MapScreen}
          options={{
            title: 'Live Map',
            headerTitle: 'GroundsGo - Live Transit'
          }}
        />
        <Tab.Screen 
          name="Routes" 
          component={RoutesScreen}
          options={{
            title: 'Bus Routes',
            headerTitle: 'UVA & City Routes'
          }}
        />
        <Tab.Screen 
          name="Planner" 
          component={PlannerScreen}
          options={{
            title: 'Trip Planner',
            headerTitle: 'AI Trip Planner'
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Settings',
            headerTitle: 'App Settings'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
