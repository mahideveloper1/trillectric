## How to Set up

### Frontend 
- cd frontend
- npm install
- npm run dev

### Backend
- cd backend
- npm install
- add your mongodb databse url in server.js file
- node server.js to start the server

## System Thinking Responses

### 1. What would break with 5,000 devices?
- Database bottleneck: Single MongoDB instance can't handle 50,000 writes/second 
- The current findOne() with sorting on every request would create performance bottlenecks
- Memory overflow: Storing all real-time connections in memory would crash the server
- WebSocket limits: Node.js has default connection limits (~65,000, but performance degrades much earlier)
- MongoDB queries without proper indexing would become slow

### 2. How would you redesign for scale?
- Database sharding: Partition devices across multiple MongoDB clusters by device_id hash
- Message queue: Use Redis to buffer incoming telemetry data
- Microservices: Separate ingestion service, storage service, and API service
- Load balancing: Multiple Node.js instances behind nginx/AWS ALB
- Caching: Redis for latest device readings, reduce DB queries
- WebSocket clustering: Use Redis adapter for Socket.IO clustering
- Time-series DB: Consider TimescaleDB for telemetry data
- Pagination: Implement device list pagination and virtual scrolling

### 3. How to ensure only verified devices can send data?
- Authentication: JWT tokens or API keys per device
- Certificate-based auth: Mutual TLS with device certificates
- IP whitelisting: Restrict API access to known device networks
- Rate limiting: Prevent spam attacks from compromised devices
- Data validation: Strict schema validation for telemetry payloads
- Device registration: Mandatory device registration process
- Logging: Log all device communications for security monitoring
- Encryption: End-to-end encryption for sensitive telemetry data