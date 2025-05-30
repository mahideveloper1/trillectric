import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import DeviceCard from './components/DeviceCard';
import DeviceChart from './components/DeviceChart';

function App() {
  const [devices, setDevices] = useState({});
  const [deviceIds, setDeviceIds] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    // Fetch initial device list
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://localhost:3000/devices');
        const deviceList = await response.json();
        setDeviceIds(deviceList);
        if (deviceList.length > 0) {
          setSelectedDevice(deviceList[0]);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    // Fetch latest data for all devices
    const fetchLatestData = async () => {
      try {
        const devicePromises = deviceIds.map(async (deviceId) => {
          const response = await fetch(`http://localhost:3000/latest-data/${deviceId}`);
          return response.json();
        });
        
        const deviceData = await Promise.all(devicePromises);
        const deviceMap = {};
        deviceData.forEach(device => {
          deviceMap[device.device_id] = device;
        });
        
        setDevices(deviceMap);
      } catch (error) {
        console.error('Error fetching latest data:', error);
      }
    };

    fetchDevices();

    // Set up socket connection
    const socket = io('http://localhost:3000');
    
    socket.on('connect', () => {
      setConnectionStatus('Connected');
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
      console.log('Disconnected from server');
    });

    socket.on('deviceData', (data) => {
      setDevices(prev => ({
        ...prev,
        [data.device_id]: data
      }));
    });

    // Initial data fetch after device list is loaded
    if (deviceIds.length > 0) {
      fetchLatestData();
    }

    return () => {
      socket.disconnect();
    };
  }, [deviceIds.length]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full">
        <header className="bg-white shadow-sm p-4 mb-0">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Energy Device Dashboard</h1>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">{connectionStatus}</span>
            </div>
          </div>
        </header>

        <div className="p-4">
          {/* Device Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.values(devices).map((device) => (
              <DeviceCard key={device.device_id} device={device} />
            ))}
          </div>

          {/* Chart Section */}
          {deviceIds.length > 0 && (
            <div className="w-full">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Device for Chart:
                </label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {deviceIds.map((deviceId) => (
                    <option key={deviceId} value={deviceId}>
                      {deviceId}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedDevice && (
                <DeviceChart deviceId={selectedDevice} />
              )}
            </div>
          )}

          {/* No Data Message */}
          {Object.keys(devices).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No device data available. Make sure the backend server is running.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;