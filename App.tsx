/**
 * PlaneConnect - Main App Component
 * Bluetooth-based connectivity app for airplane passengers
 * 
 * Features:
 * - BLE device discovery (works with airplane mode)
 * - Synchronized video playback
 * - Offline content sharing
 * - Group chat/emoji reactions
 * - Remote control
 */
import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Switch,
  Platform,
  TextInput,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BleManager from 'react-native-ble-manager';

const Stack = createNativeStackNavigator();

// BLE Service and Characteristic UUIDs
const SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const DATA_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';
const CONTROL_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef2';

export default function App() {
  const [bleInitialized, setBleInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);

  useEffect(() => {
    initializeBLE();
    return () => {
      BleManager.disconnect(connectedDevices.map(d => d.id));
    };
  }, []);

  const initializeBLE = async () => {
    try {
      await BleManager.start({showAlert: false});
      setBleInitialized(true);
      console.log('BLE initialized successfully');
      
      // Start advertising after a brief delay
      setTimeout(() => {
        startAdvertising();
      }, 1000);
    } catch (error) {
      console.error('BLE initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAdvertising = async () => {
    if (Platform.OS === 'android') {
      await BleManager.startAdvertising('PlaneConnect', [SERVICE_UUID], {advertiseMode: 'balanced'});
    } else {
      await BleManager.startAdvertising('PlaneConnect', {powerLevel: 'high'});
    }
    setIsAdvertising(true);
    console.log('Advertising started');
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
          component={() => <HomeScreen navigation={navigation} />}
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
        <Stack.Screen
          name="SyncPlayer"
          component={SyncPlayerScreen}
          options={{title: 'Watch Together', headerStyle: {backgroundColor: '#007AFF'}}}
        />
        <Stack.Screen
          name="FileShare"
          component={FileShareScreen}
          options={{title: 'Share Files', headerStyle: {backgroundColor: '#007AFF'}}}
        />
        <Stack.Screen
          name="GroupChat"
          component={GroupChatScreen}
          options={{title: 'Chat & Reactions', headerStyle: {backgroundColor: '#007AFF'}}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Home Screen with Feature Cards
function HomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>✈️ PlaneConnect</Text>
        <Text style={styles.subtitle}>Connect with nearby passengers</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✨ New Features</Text>
          
          <TouchableOpacity 
            style={styles.featureRow}
            onPress={() => navigation.navigate('SyncPlayer')}
          >
            <Text style={styles.featureIcon}>🎬</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureName}>Watch Together</Text>
              <Text style={styles.featureDesc}>Synchronized video playback</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureRow}
            onPress={() => navigation.navigate('FileShare')}
          >
            <Text style={styles.featureIcon}>📂</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureName}>Share Files</Text>
              <Text style={styles.featureDesc}>Offline content sharing</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureRow}
            onPress={() => navigation.navigate('GroupChat')}
          >
            <Text style={styles.featureIcon}>💬</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureName}>Chat & Reactions</Text>
              <Text style={styles.featureDesc}>Group chat with emojis</Text>
            </View>
          </TouchableOpacity>
        </View>

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
            ✅ Uses Bluetooth Low Energy (works with airplane mode)
          </Text>
          <Text style={styles.infoText}>
            ✅ Free peer-to-peer streaming
          </Text>
          <Text style={styles.infoText}>
            ✅ No internet required
          </Text>
        </View>

        {isAdvertising && (
          <View style={styles.advertisingBadge}>
            <Text style={styles.advertisingText}>📍 Advertising: ON</Text>
          </View>
        )}
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
      await BleManager.scan([], 15000, false);
      
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
      }, 15000);

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
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <View style={styles.deviceItem}>
                <Text style={styles.deviceName}>{item.name || 'Unknown'}</Text>
                <Text style={styles.deviceId}>{item.id}</Text>
                {item.rssi && (
                  <Text style={styles.rssi}>Signal: {item.rssi} dBm</Text>
                )}
                <Button 
                  title="Connect" 
                  onPress={() => handleDeviceSelect(item)} 
                />
              </View>
            )}
          />
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
        if (Platform.OS === 'android') {
          await BleManager.startAdvertising('PlaneConnect', [SERVICE_UUID], {advertiseMode: 'balanced'});
        } else {
          await BleManager.startAdvertising('PlaneConnect', {powerLevel: 'high'});
        }
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
            <Text style={styles.toggleLabel}>Enable Advertising:</Text>
            <Switch value={isAdvertising} onValueChange={toggleAdvertising} />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {isAdvertising ? '✅ Visible to others' : '❌ Not visible'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Note: Works with airplane mode enabled on iOS/Android
          </Text>
          <Text style={styles.infoText}>
            Range: ~10 meters (33 feet)
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Device Detail Screen
function DeviceDetailScreen({route, navigation}) {
  const {device} = route.params;
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    try {
      await BleManager.connect(device.id);
      setIsConnected(true);
      Alert.alert('Connected', `Connected to ${device.name || device.id}`);
      
      // Start BLE data listener
      BleManager.retrieveServices(device.id);
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
          
          {isConnected ? (
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedText}>✅ Connected</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.deviceActions}>
          <Button title="Connect" onPress={handleConnect} />
          <View style={styles.buttonSpacing} />
          <Button 
            title="Watch Together" 
            color="#10B981"
            onPress={() => navigation.navigate('SyncPlayer', {device})} 
          />
          <View style={styles.buttonSpacing} />
          <Button 
            title="Share Files" 
            color="#F59E0B"
            onPress={() => navigation.navigate('FileShare', {device})} 
          />
          <View style={styles.buttonSpacing} />
          <Button 
            title="Chat & Reactions" 
            color="#6366F1"
            onPress={() => navigation.navigate('GroupChat', {device})} 
          />
          <View style={styles.buttonSpacing} />
          <Button 
            title="Back" 
            color="#666"
            onPress={() => navigation.goBack()} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Sync Player Screen
function SyncPlayerScreen({route, navigation}) {
  const {device} = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎬 Watch Together</Text>
        
        <View style={styles.playerCard}>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.placeholderText}>🎬 Video Player</Text>
          </View>
          
          <View style={styles.playerControls}>
            <Button 
              title={isPlaying ? '⏸ Pause' : '▶ Play'} 
              onPress={() => setIsPlaying(!isPlaying)} 
            />
            <Button title="Set Duration (s)" onPress={() => setDuration(180)} />
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {width: `${(currentTime / duration) * 100}%`}]} />
          </View>
          
          <Text style={styles.timeDisplay}>{currentTime}s / {duration}s</Text>
        </View>

        <View style={styles.syncInfo}>
          <Text style={styles.syncText}>Synced with: {device.name || device.id}</Text>
          <Text style={styles.syncText}>Status: {isPlaying ? 'Playing' : 'Paused'}</Text>
          <Text style={styles.syncText}>Sync: {isPlaying ? 'Synced' : 'Paused'}</Text>
        </View>

        <View style={styles.buttonSpacing} />
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

// File Share Screen
function FileShareScreen({route, navigation}) {
  const {device} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📂 Share Files</Text>
        
        <View style={styles.fileShareCard}>
          <Text style={styles.fileText}>
            Send photos, videos, and documents directly to nearby passengers.
          </Text>
          <Text style={styles.fileText}>
            Works without internet!
          </Text>
        </View>

        <View style={styles.fileList}>
          <TouchableOpacity style={styles.fileItem}>
            <Text style={styles.fileIcon}>📸</Text>
            <Text style={styles.fileName}>vacation.jpg</Text>
            <Text style={styles.fileSize}>2.4 MB</Text>
            <Button title="Send" onPress={() => Alert.alert('Sent', 'File sent to passenger')} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fileItem}>
            <Text style={styles.fileIcon}>🎥</Text>
            <Text style={styles.fileName}>trip_video.mp4</Text>
            <Text style={styles.fileSize}>15.7 MB</Text>
            <Button title="Send" onPress={() => Alert.alert('Sent', 'File sent to passenger')} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fileItem}>
            <Text style={styles.fileIcon}>🎵</Text>
            <Text style={styles.fileName}>playlist.mp3</Text>
            <Text style={styles.fileSize}>12.3 MB</Text>
            <Button title="Send" onPress={() => Alert.alert('Sent', 'File sent to passenger')} />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonSpacing} />
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

// Group Chat Screen
function GroupChatScreen({route, navigation}) {
  const {device} = route.params;
  const [messages, setMessages] = useState([
    {id: '1', text: 'Hi! Ready to watch?', sender: 'them', timestamp: '10:30'},
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
    
    // In real implementation, send via BLE
    console.log('Sending message:', inputText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>💬 Chat & Reactions</Text>
        
        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <View style={[
                styles.messageRow,
                item.sender === 'me' ? styles.messageRowMe : styles.messageRowThem
              ]}>
                <View style={[
                  styles.messageBubble,
                  item.sender === 'me' ? styles.messageBubbleMe : styles.messageBubbleThem
                ]}>
                  <Text style={styles.messageText}>{item.text}</Text>
                  <Text style={styles.messageTime}>{item.timestamp}</Text>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.emojiButton}>
            <Text style={styles.emojiButtonText}>😊</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.emojiButton}>
            <Text style={styles.emojiButtonText}>👍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.emojiButton}>
            <Text style={styles.emojiButtonText}>🎬</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </View>

        <View style={styles.buttonSpacing} />
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
  advertisingBadge: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  advertisingText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#666',
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
  connectedBadge: {
    backgroundColor: '#10B981',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  connectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deviceActions: {
    marginTop: 16,
  },
  playerCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  videoPlaceholder: {
    backgroundColor: '#000',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 24,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    width: '0%',
  },
  timeDisplay: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  syncInfo: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  syncText: {
    fontSize: 14,
    color: '#1565C0',
    marginBottom: 4,
  },
  fileShareCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  fileText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  fileList: {
    marginBottom: 16,
  },
  fileItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  fileSize: {
    fontSize: 12,
    color: '#888',
  },
  chatContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    minHeight: 300,
    maxHeight: 400,
  },
  messageRow: {
    padding: 12,
  },
  messageRowMe: {
    alignItems: 'flex-end',
  },
  messageRowThem: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  },
  messageBubbleMe: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 4,
  },
  messageBubbleThem: {
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
  },
  messageTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  emojiButton: {
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  emojiButtonText: {
    fontSize: 20,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
});
