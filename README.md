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
- Database problem: Single MongoDB instance can't handle 50,000 writes/second 
- Memory overflow: Storing all real-time connections in memory would crash the server
- WebSocket limits: Node.js has default connection limits (~65,000, but performance degrades much earlier)
- MongoDB queries without proper indexing would become slow

### 2. How would you redesign for scale?
- we can use autoscaling in AWS and for high availability use multi Az architecture
- Message queue: Use Redis to buffer incoming telemetry data
- Microservices: Separate ingestion service, storage service, and API service
- Load balancing: Multiple Node.js instances behind nginx/AWS ALB
- Caching: Redis for latest device readings, reduce DB queries
- WebSocket clustering: Use Redis adapter for Socket.IO clustering

### 3. How to ensure only verified devices can send data?
- Use vpc and private subnet or internal network only allowed internal data
- we can alos use waf rule to allow specific IPs 
- Use Security Groups to define who can talk to your instance (access control).
- Use Route Tables to define how traffic moves within your VPC (routing logic)
- Authentication can be doen by JWT tokens or API keys per device
- Rate limiting can be done to Prevent spam attacks from compromised devices
- Data validation for Strict schema validation for telemetry payloads
