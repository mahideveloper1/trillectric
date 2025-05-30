import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DeviceChart = ({ deviceId }) => {
  const [chartData, setChartData] = useState([]);

  const fetchRecentData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/recent-data/${deviceId}`);
      const data = await response.json();
      
      const formattedData = data.map(item => ({
        time: new Date(item.timestamp).toLocaleTimeString(),
        voltage: item.voltage,
        current: item.current,
        timestamp: item.timestamp
      }));
      
      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchRecentData();
    const interval = setInterval(fetchRecentData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [deviceId]);

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Readings - {deviceId}</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="voltage" 
            stroke="#2563eb" 
            strokeWidth={2}
            name="Voltage (V)"
          />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="#dc2626" 
            strokeWidth={2}
            name="Current (A)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeviceChart;