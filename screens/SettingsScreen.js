import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const settingSections = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'push_notifications',
          title: 'Push Notifications',
          subtitle: 'Get alerts for bus delays and arrivals',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
          icon: 'notifications',
        },
        {
          id: 'arrival_alerts',
          title: 'Arrival Alerts',
          subtitle: 'Notify when your bus is approaching',
          type: 'switch',
          value: true,
          onValueChange: () => {},
          icon: 'alarm',
        },
      ],
    },
    {
      title: 'Location & Privacy',
      items: [
        {
          id: 'location_tracking',
          title: 'Location Services',
          subtitle: 'Allow app to access your location',
          type: 'switch',
          value: locationTracking,
          onValueChange: setLocationTracking,
          icon: 'location',
        },
        {
          id: 'data_usage',
          title: 'Data Usage',
          subtitle: 'Optimize for cellular data',
          type: 'switch',
          value: false,
          onValueChange: () => {},
          icon: 'cellular',
        },
      ],
    },
    {
      title: 'App Preferences',
      items: [
        {
          id: 'dark_mode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme throughout the app',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
          icon: 'moon',
        },
        {
          id: 'auto_refresh',
          title: 'Auto Refresh',
          subtitle: 'Automatically update bus locations',
          type: 'switch',
          value: autoRefresh,
          onValueChange: setAutoRefresh,
          icon: 'refresh',
        },
        {
          id: 'default_map',
          title: 'Default Map View',
          subtitle: 'Standard',
          type: 'navigation',
          icon: 'map',
          onPress: () => Alert.alert('Coming Soon', 'Map view options will be available in a future update.'),
        },
      ],
    },
    {
      title: 'Support & Info',
      items: [
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve GroundsGo',
          type: 'navigation',
          icon: 'chatbubble-ellipses',
          onPress: () => Alert.alert('Feedback', 'Email us at feedback@groundsgo.app'),
        },
        {
          id: 'about',
          title: 'About GroundsGo',
          subtitle: 'Version 1.0.0',
          type: 'navigation',
          icon: 'information-circle',
          onPress: () => showAbout(),
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'How we protect your data',
          type: 'navigation',
          icon: 'shield-checkmark',
          onPress: () => Alert.alert('Privacy Policy', 'Visit groundsgo.app/privacy for our full privacy policy.'),
        },
      ],
    },
  ];

  const showAbout = () => {
    Alert.alert(
      'About GroundsGo',
      'GroundsGo is a unified transit tracker for UVA and Charlottesville, designed to make campus transportation stress-free.\n\nBuilt with ❤️ for the UVA community.\n\nVersion 1.0.0',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === 'switch'}
      >
        <View style={styles.settingIcon}>
          <Ionicons name={item.icon} size={22} color="#FF6B35" />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>

        <View style={styles.settingControl}>
          {item.type === 'switch' ? (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: '#3A3A3C', true: '#FF6B35' }}
              thumbColor="#FFFFFF"
            />
          ) : (
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (section) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your GroundsGo experience</Text>
      </View>

      {settingSections.map(renderSection)}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made for UVA students by UVA students
        </Text>
        <Text style={styles.versionText}>
          GroundsGo v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 5,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: '#1C1C1E',
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  settingIcon: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 2,
  },
  settingControl: {
    marginLeft: 15,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  versionText: {
    color: '#6D6D70',
    fontSize: 12,
  },
});
