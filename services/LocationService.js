import * as Location from 'expo-location';
import { Alert } from 'react-native';

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.watchId = null;
    this.isWatching = false;
  }

  // Request location permissions
  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'GroundsGo needs location access to show nearby bus stops and provide accurate transit directions. Please enable location services in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  // Get current location once
  async getCurrentLocation() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 10000, // Use cached location if less than 10 seconds old
      });

      this.currentLocation = location;
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please make sure location services are enabled and try again.',
        [{ text: 'OK' }]
      );
      return null;
    }
  }

  // Start watching location changes
  async startWatchingLocation(callback) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      if (this.isWatching) {
        this.stopWatchingLocation();
      }

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update when moved 10 meters
        },
        (location) => {
          this.currentLocation = location;
          if (callback) {
            callback(location);
          }
        }
      );

      this.isWatching = true;
      return true;
    } catch (error) {
      console.error('Error watching location:', error);
      return false;
    }
  }

  // Stop watching location changes
  stopWatchingLocation() {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
      this.isWatching = false;
    }
  }

  // Check if location is within UVA/Charlottesville area
  isInServiceArea(location) {
    if (!location || !location.coords) {
      return false;
    }

    const { latitude, longitude } = location.coords;
    
    // UVA and Charlottesville area bounds
    const bounds = {
      north: 38.1,
      south: 37.9,
      east: -78.4,
      west: -78.6
    };

    return (
      latitude >= bounds.south &&
      latitude <= bounds.north &&
      longitude >= bounds.west &&
      longitude <= bounds.east
    );
  }

  // Calculate distance between two coordinates (in meters)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Find nearest bus stops to current location
  findNearbyBusStops(busStops, maxDistance = 500) {
    if (!this.currentLocation || !this.currentLocation.coords) {
      return [];
    }

    const { latitude, longitude } = this.currentLocation.coords;

    return busStops
      .map(stop => ({
        ...stop,
        distance: this.calculateDistance(latitude, longitude, stop.latitude, stop.longitude)
      }))
      .filter(stop => stop.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }

  // Get formatted address from coordinates (reverse geocoding)
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        return `${address.street || ''} ${address.name || ''}, ${address.city || 'Charlottesville'}, ${address.region || 'VA'}`.trim();
      }

      return 'Unknown location';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Unknown location';
    }
  }

  // Cleanup when service is no longer needed
  cleanup() {
    this.stopWatchingLocation();
    this.currentLocation = null;
  }
}

// Export singleton instance
export default new LocationService();
