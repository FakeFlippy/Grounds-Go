import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LocationService from '../services/LocationService';

// Temporarily disable MapView for testing
// import MapView, { Marker, Polyline } from 'react-native-maps';

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
      {/* Temporary placeholder for map - will be replaced with actual MapView once dependencies are fixed */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapHeader}>
          <Ionicons name="map" size={40} color="#FF6B35" />
          <Text style={styles.mapTitle}>GroundsGo Live Map</Text>
          <Text style={styles.mapSubtitle}>UVA & Charlottesville Transit</Text>
          
          {/* Location Status */}
          <View style={styles.locationStatus}>
            {locationLoading ? (
              <View style={styles.locationItem}>
                <ActivityIndicator size="small" color="#FF6B35" />
                <Text style={styles.locationText}>Getting your location...</Text>
              </View>
            ) : location ? (
              <View style={styles.locationItem}>
                <Ionicons name="location" size={16} color="#34C759" />
                <Text style={styles.locationText}>
                  {LocationService.isInServiceArea(location) ? 'In service area' : 'Outside service area'}
                </Text>
              </View>
            ) : (
              <View style={styles.locationItem}>
                <Ionicons name="location-outline" size={16} color="#FF3B30" />
                <Text style={styles.locationText}>Location unavailable</Text>
              </View>
            )}
            
            {locationAddress && (
              <Text style={styles.addressText}>{locationAddress}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.busListContainer}>
          <Text style={styles.busListTitle}>Live Bus Tracking</Text>
          {buses.map((bus) => (
            <View key={bus.id} style={styles.busItem}>
              <View style={[styles.busIndicator, { backgroundColor: getBusIcon(bus.route) }]}>
                <Ionicons name="bus" size={16} color="white" />
              </View>
              <View style={styles.busDetails}>
                <Text style={styles.busName}>{bus.name}</Text>
                <Text style={styles.busRoute}>{bus.route}</Text>
                <Text style={styles.busEta}>Next: {bus.nextStop} • {bus.eta}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <Text style={styles.comingSoonText}>
          📍 Interactive map coming soon!{'\n'}
          Currently showing live bus data in list format.
        </Text>
      </View>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading live bus data...</Text>
        </View>
      )}

      {/* Control buttons */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, locationLoading && styles.controlButtonDisabled]} 
          onPress={centerOnUser}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color="#FF6B35" />
          ) : (
            <Ionicons name="locate" size={24} color="#FF6B35" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={() => setBuses(mockBuses)}>
          <Ionicons name="refresh" size={24} color="#FF6B35" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={initializeLocation}>
          <Ionicons name="location" size={24} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Bus count indicator */}
      <View style={styles.busCounter}>
        <Text style={styles.busCountText}>
          {buses.length} buses tracked
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mapPlaceholder: {
    flex: 1,
    padding: 20,
  },
  mapHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  mapTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  mapSubtitle: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 5,
  },
  locationStatus: {
    marginTop: 20,
    alignItems: 'center',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  addressText: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  busListContainer: {
    flex: 1,
  },
  busListTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  busItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  busIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  busDetails: {
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
  busEta: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 4,
  },
  comingSoonText: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '500',
  },
  controls: {
    position: 'absolute',
    right: 20,
    top: 100,
    flexDirection: 'column',
  },
  controlButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
  busMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  busCounter: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  busCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
