const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Device = require('./models/Device');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://mahi-developer:4321dcbaA@cluster0.gxptcmt.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.get('/latest-data/:device_id', async (req, res) => {
  try {
    const { device_id } = req.params;
    const latestData = await Device.findOne({ device_id })
      .sort({ timestamp: -1 })
      .limit(1);
    
    if (!latestData) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.json(latestData);
  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent readings for graph (last 20 readings)
app.get('/recent-data/:device_id', async (req, res) => {
  try {
    const { device_id } = req.params;
    const recentData = await Device.find({ device_id })
      .sort({ timestamp: -1 })
      .limit(20);
    
    res.json(recentData.reverse()); // Reverse to show chronological order
  } catch (error) {
    console.error('Error fetching recent data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all devices
app.get('/devices', async (req, res) => {
  try {
    const devices = await Device.distinct('device_id');
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Simulate device data pushing every 10 seconds
const simulateDeviceData = () => {
  const deviceIds = ['SOL-001', 'SOL-002', 'SMT-001'];
  
  setInterval(async () => {
    for (const deviceId of deviceIds) {
      const deviceData = {
        device_id: deviceId,
        timestamp: new Date().toISOString(),
        voltage: Math.round((220 + Math.random() * 20) * 10) / 10, // 220-240V
        current: Math.round((4 + Math.random() * 2) * 10) / 10 // 4-6A
      };
      
      try {
        const device = new Device(deviceData);
        await device.save();
        
        // Emit to connected clients
        io.emit('deviceData', deviceData);
        
        console.log(`Data pushed for ${deviceId}:`, deviceData);
      } catch (error) {
        console.error('Error saving device data:', error);
      }
    }
  }, 10000); 
};

simulateDeviceData();

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});