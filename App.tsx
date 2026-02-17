/**
 * PlaneConnect - Main App Component
 * Bluetooth-based connectivity app for airplane passengers
 */
import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, StyleSheet, Button, Alert, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BleManager from 'react-native-ble-manager';

const Stack = createNativeStackNavigator();

export default function App() {
  const [bleInitialized, setBleInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeBLE();
  }, []);

  const initializeBLE = async () => {
    try {
      // Initialize BLE Manager
      await BleManager.start({showAlert: false});
      setBleInitialized(true);
      console.log('BLE initialized successfully');
    } catch (error) {
      console.error('BLE initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Initializing PlaneConnect...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!bleInitialized) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Text style={styles.errorTitle}>BLE Initialization Failed</Text>
          <Text style={styles.errorText}>
            Bluetooth Low Energy is not available on this device.
          </Text>
          <Button title="Retry" onPress={initializeBLE} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'PlaneConnect', headerStyle: {backgroundColor: '#007AFF'}}}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{title: 'Find Passengers', headerStyle: {backgroundColor: '#007AFF'}}}
        />
        <Stack.Screen
          name="Advertise"
          component={AdvertiseScreen}
          options={{title: 'Advertise', headerStyle: {backgroundColor: '#007AFF'}}}
        />
        <Stack.Screen
          name="DeviceDetail"
          component={DeviceDetailScreen}
          options={{title: 'Device', headerStyle: {backgroundColor: '#007AFF'}}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Home Screen
function HomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>✈️ PlaneConnect</Text>
        <Text style={styles.subtitle}>Connect with nearby passengers</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Button 
            title="🔍 Scan for Passengers" 
            onPress={() => navigation.navigate('Scan')} 
          />
          <View style={styles.buttonSpacing} />
          <Button 
            title="📍 Advertise My Device" 
            onPress={() => navigation.navigate('Advertise')} 
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ How It Works</Text>
          <Text style={styles.infoText}>
            • Use Bluetooth Low Energy (works with airplane mode)
          </Text>
          <Text style={styles.infoText}>
            • Scan to find nearby devices
          </Text>
          <Text style={styles.infoText}>
            • Connect for real-time collaboration
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Scan Screen
function ScanScreen({navigation}) {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);

  const startScan = async () => {
    setScanning(true);
    setDevices([]);

    try {
      await BleManager.scan([], 10000, false);
      
      const listener = BleManager.addEventListener(
        'BleManagerDiscoverDevice',
        (device) => {
          if (!devices.find(d => d.id === device.id)) {
            setDevices(prev => [...prev, device]);
          }
        }
      );

      setTimeout(() => {
        listener.remove();
        setScanning(false);
      }, 10000);

    } catch (error) {
      Alert.alert('Scan Error', error.message);
      setScanning(false);
    }
  };

  const handleDeviceSelect = (device) => {
    navigation.navigate('DeviceDetail', {device});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan for Devices</Text>
        
        <Button 
          title={scanning ? '⏳ Scanning...' : '🔄 Start Scan'} 
          onPress={startScan} 
          disabled={scanning}
        />

        {devices.length > 0 && (
          <View style={styles.deviceList}>
            <Text style={styles.subtitle}>{devices.length} device(s) found:</Text>
            {devices.map((device) => (
              <View key={device.id} style={styles.deviceItem}>
                <Text style={styles.deviceName}>{device.name || 'Unknown'}</Text>
                <Text style={styles.deviceId}>{device.id}</Text>
                {device.rssi && (
                  <Text style={styles.rssi}>Signal: {device.rssi} dBm</Text>
                )}
                <Button 
                  title="Connect" 
                  onPress={() => handleDeviceSelect(device)} 
                />
              </View>
            ))}
          </View>
        )}

        {scanning && <ActivityIndicator size="large" color="#007AFF" />}
      </View>
    </SafeAreaView>
  );
}

// Advertise Screen
function AdvertiseScreen() {
  const [isAdvertising, setIsAdvertising] = useState(false);

  const toggleAdvertising = async () => {
    if (isAdvertising) {
      try {
        await BleManager.stopAdvertising();
        setIsAdvertising(false);
        Alert.alert('Stopped', 'Advertising stopped');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      try {
        await BleManager.startAdvertising('PlaneConnect', [], {powerLevel: 'high'});
        setIsAdvertising(true);
        Alert.alert('Advertising', 'Your device is now visible!');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Advertise Device</Text>
        
        <View style={styles.advertiseCard}>
          <Text style={styles.advertiseText}>
            When enabled, other passengers can find your device via Bluetooth.
          </Text>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {isAdvertising ? '✅ Advertising Active' : '❌ Advertising Disabled'}
            </Text>
          </View>
          
          <Button 
            title={isAdvertising ? 'Stop Advertising' : 'Start Advertising'} 
            onPress={toggleAdvertising} 
            color={isAdvertising ? '#FF3B30' : '#007AFF'}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Note: Works with airplane mode enabled on iOS/Android
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Device Detail Screen
function DeviceDetailScreen({route, navigation}) {
  const {device} = route.params;

  const handleConnect = async () => {
    try {
      await BleManager.connect(device.id);
      Alert.alert('Connected', `Connected to ${device.name || device.id}`);
    } catch (error) {
      Alert.alert('Connection Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Device Details</Text>
        
        <View style={styles.deviceCard}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{device.name || 'Unknown'}</Text>
          
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{device.id}</Text>
          
          {device.rssi && (
            <>
              <Text style={styles.label}>Signal:</Text>
              <Text style={styles.value}>{device.rssi} dBm</Text>
            </>
          )}
        </View>

        <Button title="Connect" onPress={handleConnect} />
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorContent: {
    maxWidth: 400,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonSpacing: {
    height: 12,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976D2',
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    marginBottom: 4,
  },
  deviceList: {
    marginTop: 16,
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#888',
    marginBottom: 8,
  },
  rssi: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  advertiseCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  advertiseText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  deviceCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
});
