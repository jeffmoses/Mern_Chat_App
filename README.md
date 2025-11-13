# Real-Time Chat Application with Socket.io

A full-stack real-time chat application built with Node.js, Express, MongoDB, Socket.io, and React.

## 🚀 Features

- **Real-time messaging** with Socket.io
- **User authentication** with JWT tokens
- **Multiple chat rooms** (general, random, tech, gaming)
- **Typing indicators** showing when users are typing
- **Read receipts** to track message read status
- **Private messaging** between users
- **Online user list** with real-time updates
- **Responsive design** for mobile and desktop
- **MongoDB integration** for persistent message storage

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io-client** - Real-time client

## 📁 Project Structure

```
/
├── server/                          # Backend application
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   └── messageController.js     # Message handling
│   ├── models/
│   │   ├── User.js                  # User model
│   │   └── Message.js               # Message model
│   ├── socket/
│   │   └── socketHandler.js         # Socket.io event handlers
│   ├── utils/
│   │   └── generateToken.js         # JWT token generation
│   ├── middleware/
│   │   └── auth.js                  # Authentication middleware
│   ├── server.js                    # Main server file
│   ├── package.json
│   └── .env                         # Environment variables
└── client/                          # Frontend application
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── ChatWindow.jsx       # Message display
    │   │   ├── MessageInput.jsx     # Message input
    │   │   └── UserList.jsx         # Online users
    │   ├── context/
    │   │   ├── AuthContext.jsx      # Authentication context
    │   │   └── SocketContext.jsx    # Socket context
    │   ├── hooks/
    │   │   └── useAuth.js           # Auth hook
    │   ├── pages/
    │   │   ├── LoginPage.jsx        # Login page
    │   │   ├── RegisterPage.jsx     # Registration page
    │   │   └── ChatPage.jsx         # Main chat page
    │   ├── socket/
    │   │   └── socket.js            # Socket client setup
    │   ├── App.jsx                  # Main app component
    │   └── App.css                  # Global styles
    ├── package.json
    └── vite.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment variables:**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/socketio-chat
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment variables (optional):**
   Create a `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Messages
- `GET /api/messages/:room` - Get messages for a room
- `GET /api/messages/private/:userId` - Get private messages
- `PUT /api/messages/read` - Mark messages as read

## 📡 Socket.io Events

### Client to Server
- `joinRoom` - Join a chat room
- `sendMessage` - Send message to current room
- `sendPrivateMessage` - Send private message to user
- `typing` - Indicate typing status
- `readMessage` - Mark message as read
- `leaveRoom` - Leave current room

### Server to Client
- `roomJoined` - Successfully joined room
- `receiveMessage` - New message in room
- `receivePrivateMessage` - New private message
- `userJoined` - User joined room
- `userLeft` - User left room
- `userList` - Updated user list
- `typingUsers` - Users currently typing
- `messageRead` - Message marked as read

## 🧪 Testing the Application

1. **Start both servers:**
   - Backend: `cd server && npm start`
   - Frontend: `cd client && npm run dev`

2. **Open multiple browser tabs/windows** to `http://localhost:5173`

3. **Test features:**
   - Register/Login with different accounts
   - Join different rooms
   - Send messages and see real-time updates
   - Test typing indicators
   - Send private messages
   - Check online user list

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - For MongoDB Atlas, use the connection string provided

2. **Socket Connection Issues:**
   - Check if backend server is running on port 5000
   - Verify CLIENT_URL in server .env matches frontend URL

3. **Authentication Problems:**
   - Clear browser localStorage
   - Check JWT_SECRET is set in server .env

4. **CORS Errors:**
   - Ensure CLIENT_URL in server .env matches frontend origin

### Development Tips

- Use browser developer tools to inspect network requests
- Check server console for error messages
- Use MongoDB Compass to inspect database
- Test Socket.io events in browser console

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Secure headers

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use a process manager like PM2
3. Set up MongoDB database
4. Configure reverse proxy (nginx)

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve static files from `dist` directory
3. Configure API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support
jeffmosesotiende@gmail.com 
For questions or issues, please open an issue on GitHub or contact the development team.
