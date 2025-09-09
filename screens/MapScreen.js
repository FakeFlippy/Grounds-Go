import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LocationService from '../services/LocationService';

// Temporarily disable MapView for testing
// import MapView, { Marker, Polyline } from 'react-native-maps';

const { height: screenHeight } = Dimensions.get('window');

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [locationPermission, setLocationPermission] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 38.0336, // UVA coordinates
    longitude: -78.5080,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);

  // Mock bus data for demonstration
  const mockBuses = [
    {
      id: 'uva_1',
      name: 'UVA Bus 1',
      route: 'Red Line',
      latitude: 38.0356,
      longitude: -78.5090,
      heading: 45,
      nextStop: 'Alderman Library',
      eta: '3 min',
    },
    {
      id: 'uva_2',
      name: 'UVA Bus 2',
      route: 'Blue Line',
      latitude: 38.0316,
      longitude: -78.5070,
      heading: 180,
      nextStop: 'Scott Stadium',
      eta: '7 min',
    },
    {
      id: 'cat_1',
      name: 'CAT Bus 1',
      route: 'Route 7',
      latitude: 38.0296,
      longitude: -78.5100,
      heading: 270,
      nextStop: 'Barracks Road',
      eta: '12 min',
    },
  ];

  useEffect(() => {
    initializeLocation();
    // Simulate loading bus data
    setTimeout(() => {
      setBuses(mockBuses);
      setLoading(false);
    }, 2000);

    // Cleanup on unmount
    return () => {
      LocationService.cleanup();
    };
  }, []);

  const initializeLocation = async () => {
    setLocationLoading(true);
    try {
      const currentLocation = await LocationService.getCurrentLocation();
      if (currentLocation) {
        setLocation(currentLocation);
        setLocationPermission('granted');
        
        // Update map region to user's location if within service area
        if (LocationService.isInServiceArea(currentLocation)) {
          setMapRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }

        // Get address for display
        const address = await LocationService.getAddressFromCoordinates(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
        setLocationAddress(address);
      } else {
        setLocationPermission('denied');
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      setLocationPermission('denied');
    } finally {
      setLocationLoading(false);
    }
  };

  const centerOnUser = async () => {
    if (location && location.coords) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      // Try to get fresh location
      setLocationLoading(true);
      const freshLocation = await LocationService.getCurrentLocation();
      if (freshLocation) {
        setLocation(freshLocation);
        setMapRegion({
          latitude: freshLocation.coords.latitude,
          longitude: freshLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        Alert.alert(
          'Location Not Available', 
          'Unable to get your current location. Please check that location services are enabled.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: () => initializeLocation() }
          ]
        );
      }
      setLocationLoading(false);
    }
  };

  const getBusIcon = (route) => {
    const routeColors = {
      'Red Line': '#FF3B30',
      'Blue Line': '#007AFF',
      'Route 7': '#34C759',
      'Route 11': '#FF9500',
    };
    return routeColors[route] || '#8E8E93';
  };

  return (
    <View style={styles.container}>
      {/* Map Section - Top Half */}
      <View style={styles.mapSection}>
        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={60} color="#FF6B35" />
            <Text style={styles.mapTitle}>GroundsGo Live Map</Text>
            <Text style={styles.mapSubtitle}>Interactive map coming soon</Text>
            
            {/* Location Status Overlay */}
            <View style={styles.locationOverlay}>
              {locationLoading ? (
                <View style={styles.locationItem}>
                  <ActivityIndicator size="small" color="#FF6B35" />
                  <Text style={styles.locationText}>Getting location...</Text>
                </View>
              ) : location ? (
                <View style={styles.locationItem}>
                  <Ionicons name="location" size={14} color="#34C759" />
                  <Text style={styles.locationText}>
                    {LocationService.isInServiceArea(location) ? 'In service area' : 'Outside service area'}
                  </Text>
                </View>
              ) : (
                <View style={styles.locationItem}>
                  <Ionicons name="location-outline" size={14} color="#FF3B30" />
                  <Text style={styles.locationText}>Location unavailable</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Map Control Buttons */}
          <View style={styles.mapControls}>
            <TouchableOpacity 
              style={[styles.mapControlButton, locationLoading && styles.controlButtonDisabled]} 
              onPress={centerOnUser}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <ActivityIndicator size="small" color="#FF6B35" />
              ) : (
                <Ionicons name="locate" size={20} color="#FF6B35" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mapControlButton} onPress={() => setBuses(mockBuses)}>
              <Ionicons name="refresh" size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bus List Section - Bottom Half */}
      <View style={styles.busListSection}>
        <View style={styles.busListHeader}>
          <Text style={styles.busListTitle}>Live Buses</Text>
          <View style={styles.busCounter}>
            <Text style={styles.busCountText}>{buses.length} tracked</Text>
          </View>
        </View>
        
        <ScrollView 
          style={styles.busScrollView}
          contentContainerStyle={styles.busScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.busLoadingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text style={styles.busLoadingText}>Loading live bus data...</Text>
            </View>
          ) : buses.length > 0 ? (
            buses.map((bus) => (
              <TouchableOpacity key={bus.id} style={styles.busCard}>
                <View style={styles.busCardHeader}>
                  <View style={[styles.busIndicator, { backgroundColor: getBusIcon(bus.route) }]}>
                    <Ionicons name="bus" size={18} color="white" />
                  </View>
                  <View style={styles.busInfo}>
                    <Text style={styles.busName}>{bus.name}</Text>
                    <Text style={styles.busRoute}>{bus.route}</Text>
                  </View>
                  <View style={styles.busEtaContainer}>
                    <Text style={styles.busEta}>{bus.eta}</Text>
                    <Text style={styles.busEtaLabel}>ETA</Text>
                  </View>
                </View>
                
                <View style={styles.busDetails}>
                  <View style={styles.busDetailItem}>
                    <Ionicons name="location-outline" size={14} color="#8E8E93" />
                    <Text style={styles.busDetailText}>Next: {bus.nextStop}</Text>
                  </View>
                  <TouchableOpacity style={styles.trackButton}>
                    <Ionicons name="navigate" size={14} color="#FF6B35" />
                    <Text style={styles.trackButtonText}>Track</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noBusesContainer}>
              <Ionicons name="bus-outline" size={48} color="#8E8E93" />
              <Text style={styles.noBusesText}>No buses currently tracked</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={() => setBuses(mockBuses)}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  // Map Section Styles
  mapSection: {
    height: screenHeight * 0.5, // Top 50% of screen
    backgroundColor: '#1C1C1E',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
  },
  mapTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  mapSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 5,
  },
  locationOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    top: 20,
    flexDirection: 'column',
  },
  mapControlButton: {
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButtonDisabled: {
    opacity: 0.6,
  },
  // Bus List Section Styles
  busListSection: {
    flex: 1, // Bottom 50% of screen
    backgroundColor: '#000000',
  },
  busListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  busListTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  busCounter: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  busCountText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
  },
  busScrollView: {
    flex: 1,
  },
  busScrollContent: {
    padding: 20,
  },
  // Bus Card Styles
  busCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#38383A',
  },
  busCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  busIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  busInfo: {
    flex: 1,
  },
  busName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  busRoute: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  busEtaContainer: {
    alignItems: 'flex-end',
  },
  busEta: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: 'bold',
  },
  busEtaLabel: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 2,
  },
  busDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  busDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  busDetailText: {
    color: '#8E8E93',
    fontSize: 14,
    marginLeft: 6,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  trackButtonText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Loading and Empty States
  busLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  busLoadingText: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  noBusesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noBusesText: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
