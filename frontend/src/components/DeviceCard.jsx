import React from 'react';

const DeviceCard = ({ device }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold mb-3">{device.device_id}</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Voltage:</span>
          <span className="font-medium">{device.voltage}V</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Current:</span>
          <span className="font-medium">{device.current}A</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Power:</span>
          <span className="font-medium">{Math.round(device.voltage * device.current)}W</span>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Last Update: {formatTime(device.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;