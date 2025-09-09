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
    // UVA Health System Routes
    {
      id: 'uva_red',
      name: 'Red Line',
      system: 'UVA',
      color: '#FF3B30',
      description: 'Health System commuter service - Red parking lots',
      frequency: 'Variable',
      hours: '5:00 AM - 7:00 AM, 2:30 PM - 8:00 PM',
      stops: ['Red Lots', 'Scott Stadium', 'Health System'],
      active: true,
    },
    {
      id: 'uva_blue',
      name: 'Blue Line',
      system: 'UVA',
      color: '#007AFF',
      description: 'Health System service - Emmet/Ivy Garage',
      frequency: 'Variable',
      hours: '7:00 AM - 8:00 PM',
      stops: ['Emmet/Ivy Garage', 'Health System', 'Medical Center'],
      active: true,
    },
    // UVA Academic Routes
    {
      id: 'uva_gold',
      name: 'Gold Line',
      system: 'UVA',
      color: '#FFD700',
      description: 'Primary academic route - Central Grounds circulation',
      frequency: '10-20 min',
      hours: '5:00 AM - 10:00 PM',
      stops: ['McCormick Rd', 'Garrett Hall', 'Monroe Hall', 'Chapel', 'Shannon Library'],
      active: true,
    },
    {
      id: 'uva_green',
      name: 'Green Line',
      system: 'UVA',
      color: '#34C759',
      description: 'Academic route - Central Grounds to research areas',
      frequency: '20-30 min',
      hours: '7:30 AM - 10:00 PM',
      stops: ['McCormick Rd', 'Research Areas', 'Central Grounds', 'Academic Buildings'],
      active: true,
    },
    {
      id: 'uva_orange',
      name: 'Orange Line',
      system: 'UVA',
      color: '#FF9500',
      description: 'Academic route - Scott Stadium connection',
      frequency: '10-30 min',
      hours: '7:30 AM - 10:00 PM',
      stops: ['Scott Stadium', 'Central Grounds', 'Academic Areas', 'Parking Lots'],
      active: true,
    },
    {
      id: 'uva_silver',
      name: 'Silver Line',
      system: 'UVA',
      color: '#C0C0C0',
      description: 'Academic route - Extended campus service',
      frequency: '15-30 min',
      hours: '6:30 AM - 8:00 PM',
      stops: ['Extended Campus', 'Central Grounds', 'Academic Buildings'],
      active: true,
    },
    {
      id: 'uva_night_pilot',
      name: 'UTS Night Pilot',
      system: 'UVA',
      color: '#9D4EDD',
      description: 'Late night campus safety service',
      frequency: '15-20 min',
      hours: '10:00 PM - 2:00 AM',
      stops: ['Central Grounds', 'Residential Areas', 'The Corner', 'Medical Center'],
      active: true,
    },
    {
      id: 'uva_ondemand',
      name: 'UTS OnDemand',
      system: 'UVA',
      color: '#AF52DE',
      description: 'Request-based late night service',
      frequency: 'On Request',
      hours: '10:00 PM - 5:00 AM',
      stops: ['Campus-wide', 'On-demand pickup/dropoff'],
      active: true,
    },
    // CAT Routes - Complete list from Charlottesville Area Transit
    {
      id: 'cat_trolley',
      name: 'Downtown/UVA Trolley',
      system: 'CAT',
      color: '#5AC8FA',
      description: 'Downtown Mall - UVA Central Grounds',
      frequency: '15 min',
      hours: '6:00 AM - 12:00 AM',
      stops: ['Downtown Mall', 'UVA Central', 'The Corner', 'Preston Ave'],
      active: true,
    },
    {
      id: 'cat_1',
      name: 'Route 1 - PVCC/Woolen Mills',
      system: 'CAT',
      color: '#FF3B30',
      description: 'PVCC - Woolen Mills - Downtown',
      frequency: '60 min',
      hours: '6:00 AM - 9:00 PM',
      stops: ['PVCC', 'Woolen Mills', 'Downtown Transit', 'Monticello Ave'],
      active: true,
    },
    {
      id: 'cat_2',
      name: 'Route 2 - 5th St Station',
      system: 'CAT',
      color: '#34C759',
      description: '5th Street Station - Downtown Mall',
      frequency: '60 min',
      hours: '6:00 AM - 9:00 PM',
      stops: ['5th St Station', 'Belmont', 'Downtown Mall', 'Water St'],
      active: true,
    },
    {
      id: 'cat_3',
      name: 'Route 3 - Southwood/Belmont',
      system: 'CAT',
      color: '#FF9500',
      description: 'Southwood - Belmont - Downtown',
      frequency: '60 min',
      hours: '6:00 AM - 9:00 PM',
      stops: ['Southwood', 'Belmont', 'Downtown Transit', 'Monticello Ave'],
      active: true,
    },
    {
      id: 'cat_4',
      name: 'Route 4 - Cherry Ave/Harris Rd',
      system: 'CAT',
      color: '#AF52DE',
      description: 'Cherry Avenue - Harris Road corridor',
      frequency: '60 min',
      hours: '6:00 AM - 9:00 PM',
      stops: ['Cherry Ave', 'Harris Rd', 'Downtown Transit', 'UVA Hospital'],
      active: true,
    },
    {
      id: 'cat_5',
      name: 'Route 5 - Commonwealth',
      system: 'CAT',
      color: '#FF6B35',
      description: 'Commonwealth Drive - Barracks Road',
      frequency: '60 min',
      hours: '6:00 AM - 9:00 PM',
      stops: ['Commonwealth Dr', 'Barracks Road', 'UVA Hospital', 'Downtown Transit'],
      active: true,
    },
    {
      id: 'cat_6',
      name: 'Route 6 - Ridge St/Prospect Ave',
      system: 'CAT',
      color: '#32D74B',
      description: 'Ridge Street - Prospect Avenue',
      frequency: '60 min',
      hours: '6:00 AM - 9:00 PM',
      stops: ['Ridge St', 'Prospect Ave', 'Downtown Transit', 'Belmont'],
      active: true,
    },
    {
      id: 'cat_7',
      name: 'Route 7 - Emmet St/Seminole Trail',
      system: 'CAT',
      color: '#007AFF',
      description: 'Emmet Street - Seminole Trail - Barracks Road',
      frequency: '30 min',
      hours: '6:00 AM - 10:00 PM',
      stops: ['Barracks Road', 'Seminole Trail', 'UVA Hospital', 'Downtown Transit'],
      active: true,
    },
    {
      id: 'cat_8',
      name: 'Route 8 - Preston Ave/Emmit St',
      system: 'CAT',
      color: '#8E8E93',
      description: 'Preston Avenue - Emmit Street corridor',
      frequency: '60 min',
      hours: '6:00 AM - 9:00 PM',
      stops: ['Preston Ave', 'Emmit St', 'Downtown Transit', 'UVA Central'],
      active: true,
    },
    {
      id: 'cat_9',
      name: 'Route 9 - UVA Health/YMCA',
      system: 'CAT',
      color: '#FF2D92',
      description: 'UVA Health System - YMCA',
      frequency: '60 min',
      hours: '6:00 AM - 9:00 PM',
      stops: ['UVA Hospital', 'YMCA', 'Downtown Transit', 'Medical Center'],
      active: true,
    },
    {
      id: 'cat_10',
      name: 'Route 10 - Pantops',
      system: 'CAT',
      color: '#5856D6',
      description: 'Pantops - Rivanna Trail - Downtown',
      frequency: '60 min',
      hours: '6:00 AM - 9:00 PM',
      stops: ['Pantops', 'Rivanna Trail', 'Downtown Transit', 'Monticello Ave'],
      active: true,
    },
    {
      id: 'cat_11',
      name: 'Route 11 - Locust Ave/Rio Rd',
      system: 'CAT',
      color: '#FF6B00',
      description: 'Locust Avenue - Rio Road - Fashion Square',
      frequency: '30 min',
      hours: '6:30 AM - 9:30 PM',
      stops: ['Fashion Square', 'Rio Rd', 'Barracks Road', 'Downtown Transit'],
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
