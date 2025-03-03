# RollCall 📅

A social media app 📱 for you to keep your friends accountable: going to class, club meetings, fun activities, events, etc.

## Project Overview

### Inspiration 🌟

This app hopes to solve a common challenge many people face: maintaining discipline and staying productive. In a world where distractions are abundant, it can be tempting to skip classes or take a day off work and lay in bed all day. This app provides a fun and engaging way to motivate users to attend classes/work and participate in their scheduled events by holding them accountable to their commitments.

### Core Features 🔑

- Event-Based Image Upload 📸: Fetch user's Google Calendar events and requires them to upload an image of themselves attending the event
- Peer Validation 👍: Other users can endorse the image to validate it, ensuring the image reflects the user's attendance.
- Streaks 🔥: Validated images contribute to building streaks, motivating users to continue attending events and building consistent habits.
- Accountability and Social Interaction 📱: Users can interact with each other, building a sense of community where they support one another's productivity and success.

### Tech Stack 🧑‍💻
MongoDB
Express
React Native (Expo)
Node
Google OAuth 2.0

## Quick Start 💡

### 1. Clone the Repository 

```bash
git clone https://github.com/dwu006/hoth.git
```

### 2. Install Dependencies

```bash
// Install frontend dependencies
cd frontend
npm install
cd .. 

// Install backend dependencies
cd backend
npm install
```

### 3. Setup Environment Variables

- Create a .env file in the backend directory
- Add required environment variables

```bash
MONGODB_URI=your_mongodb_uri
```

### 4. Start the Frontend

```bash
// Run the web app
npm run web

// Run the ios app (emulator)
npm run ios

// Run the ios app (phone)
// Download the Expo Go app from the app store
npx expo start
// Scan the qr code from the terminal and follow instructions on the app

// Run the android app
npm run android
```

### 5. Start the Backend

```bash
cd backend
node app.js
```

## Contributing

We welcome contributions! Please feel free to submit a pull request.
