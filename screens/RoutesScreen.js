import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RoutesScreen() {
  const [selectedSystem, setSelectedSystem] = useState('all');

  const routes = [
    // UVA Routes
    {
      id: 'uva_red',
      name: 'Red Line',
      system: 'UVA',
      color: '#FF3B30',
      description: 'Central Grounds - Alderman Library - Scott Stadium',
      frequency: '10-15 min',
      hours: '7:00 AM - 11:00 PM',
      stops: ['Alderman Library', 'Newcomb Hall', 'Scott Stadium', 'JPJ Arena'],
      active: true,
    },
    {
      id: 'uva_blue',
      name: 'Blue Line',
      system: 'UVA',
      color: '#007AFF',
      description: 'North Grounds - Medical Center - Central Grounds',
      frequency: '12-18 min',
      hours: '6:30 AM - 10:30 PM',
      stops: ['Medical Center', 'Copeley Hill', 'Central Grounds', 'The Corner'],
      active: true,
    },
    {
      id: 'uva_green',
      name: 'Green Line',
      system: 'UVA',
      color: '#34C759',
      description: 'Research Park - Central Grounds',
      frequency: '20-25 min',
      hours: '7:00 AM - 6:00 PM',
      stops: ['Research Park', 'Fontaine Research Park', 'Central Grounds'],
      active: false,
    },
    // CAT Routes
    {
      id: 'cat_7',
      name: 'Route 7',
      system: 'CAT',
      color: '#FF9500',
      description: 'Barracks Road - Downtown Mall',
      frequency: '30 min',
      hours: '6:00 AM - 10:00 PM',
      stops: ['Barracks Road', 'UVA Hospital', 'Preston Ave', 'Downtown Mall'],
      active: true,
    },
    {
      id: 'cat_11',
      name: 'Route 11',
      system: 'CAT',
      color: '#AF52DE',
      description: 'Stonefield - UVA - Downtown',
      frequency: '30 min',
      hours: '6:30 AM - 9:30 PM',
      stops: ['Stonefield', 'Barracks Road', 'UVA Central', 'Downtown Transit Station'],
      active: true,
    },
    {
      id: 'cat_free',
      name: 'Free Trolley',
      system: 'CAT',
      color: '#5AC8FA',
      description: 'Downtown Mall Circulator',
      frequency: '15 min',
      hours: '10:00 AM - 12:00 AM',
      stops: ['Downtown Mall', 'Water St', 'Market St', 'Preston Ave Station'],
      active: true,
    },
  ];

  const filteredRoutes = selectedSystem === 'all' 
    ? routes 
    : routes.filter(route => route.system === selectedSystem);

  const renderRoute = ({ item }) => (
    <TouchableOpacity style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <View style={[styles.routeColorIndicator, { backgroundColor: item.color }]} />
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{item.name}</Text>
          <Text style={styles.routeSystem}>{item.system} Transit</Text>
        </View>
        <View style={styles.routeStatus}>
          <View style={[styles.statusDot, { backgroundColor: item.active ? '#34C759' : '#FF3B30' }]} />
          <Text style={[styles.statusText, { color: item.active ? '#34C759' : '#FF3B30' }]}>
            {item.active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <Text style={styles.routeDescription}>{item.description}</Text>

      <View style={styles.routeDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>Every {item.frequency}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>{item.hours}</Text>
        </View>
      </View>

      <View style={styles.stopsContainer}>
        <Text style={styles.stopsTitle}>Key Stops:</Text>
        <View style={styles.stopsGrid}>
          {item.stops.map((stop, index) => (
            <View key={index} style={styles.stopChip}>
              <Text style={styles.stopText}>{stop}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.trackButton}>
        <Ionicons name="location" size={18} color="#FF6B35" />
        <Text style={styles.trackButtonText}>Track on Map</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedSystem === 'all' && styles.activeFilterTab]}
          onPress={() => setSelectedSystem('all')}
        >
          <Text style={[styles.filterText, selectedSystem === 'all' && styles.activeFilterText]}>
            All Routes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedSystem === 'UVA' && styles.activeFilterTab]}
          onPress={() => setSelectedSystem('UVA')}
        >
          <Text style={[styles.filterText, selectedSystem === 'UVA' && styles.activeFilterText]}>
            UVA Transit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedSystem === 'CAT' && styles.activeFilterTab]}
          onPress={() => setSelectedSystem('CAT')}
        >
          <Text style={[styles.filterText, selectedSystem === 'CAT' && styles.activeFilterText]}>
            CAT Buses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Routes list */}
      <FlatList
        data={filteredRoutes}
        renderItem={renderRoute}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
  },
  activeFilterTab: {
    backgroundColor: '#FF6B35',
  },
  filterText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 20,
  },
  routeCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#38383A',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeColorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 15,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  routeSystem: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 2,
  },
  routeStatus: {
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  routeDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  routeDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    color: '#8E8E93',
    fontSize: 14,
    marginLeft: 6,
  },
  stopsContainer: {
    marginBottom: 15,
  },
  stopsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  stopsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stopChip: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  stopText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  trackButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
