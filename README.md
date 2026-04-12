# 📊 Business Insights Dashboard

A full-stack mobile application that simulates a Business Insights Dashboard similar to Google Business Profile. Displays business details, insights metrics, and customer reviews via a React Native app backed by a Node.js/Express API and MongoDB Atlas.

---

## 📱 Screenshots

| Login | Insights | Business Profile | Reviews |
|-------|----------|-----------------|---------|
| Email/password auth | Cards + Bar Chart | Full business info | Filterable reviews |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | React Native (CLI) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Render |
| Repository | GitHub |
| Build | APK (Android) |

---

## 📁 Project Structure

```
business-insights/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Business.js
│   │   ├── Insights.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js       # POST /login
│   │   ├── business.js   # GET /business
│   │   ├── insights.js   # GET /insights
│   │   └── reviews.js    # GET /reviews
│   ├── middleware/
│   │   └── auth.js       # JWT protect middleware
│   ├── seed/
│   │   └── seed.js       # Database seeder
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── render.yaml
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── InsightsScreen.js
│   │   │   ├── BusinessScreen.js
│   │   │   └── ReviewsScreen.js
│   │   ├── navigation/
│   │   │   └── AppNavigator.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   └── theme/
│   │       └── index.js
│   ├── App.js
│   └── package.json
├── BusinessInsights.postman_collection.json
└── README.md
```

---

## 🚀 Backend Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/business-insights.git
cd business-insights/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/business_insights?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Set up MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Create free account
2. Create a new cluster (M0 Free Tier)
3. Under **Database Access** → Add database user with password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Under **Databases** → Connect → Drivers → Copy connection string
6. Paste into your `.env` as `MONGO_URI` replacing `<username>` and `<password>`

### 5. Seed the database
```bash
npm run seed
```

This creates:
- **User**: `admin@business.com` / `password123`
- **Business**: ABC Salon data
- **Insights**: Profile views, search views, etc.
- **Reviews**: 8 sample reviews

### 6. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## 🌐 API Reference

### Base URL
- **Local**: `http://localhost:5000`
- **Deployed**: `https://business-insights-api.onrender.com`

### Endpoints

#### `POST /login`
Authenticate user.

**Request Body:**
```json
{
  "email": "admin@business.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": { "id": "...", "email": "admin@business.com" }
  }
}
```

---

#### `GET /business` 🔒
Get business profile. Requires `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "ABC Salon",
    "category": "Beauty Salon",
    "address": "Hyderabad, Telangana, India",
    "phone": "9876543210",
    "rating": 4.2,
    "total_reviews": 120
  }
}
```

---

#### `GET /insights` 🔒
Get business insights. Requires `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "profile_views": 1200,
    "search_views": 800,
    "website_clicks": 150,
    "phone_calls": 60,
    "direction_requests": 40
  }
}
```

---

#### `GET /reviews` 🔒
Get all reviews sorted by date. Requires `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Ravi Kumar",
      "rating": 5,
      "comment": "Absolutely fantastic service!",
      "date": "2026-03-20"
    }
  ]
}
```

---

## 📦 Deploy to Render

### Steps
1. Push your backend code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add Environment Variables:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = your secret key
6. Click **Deploy**
7. Copy the live URL (e.g., `https://business-insights-api.onrender.com`)
8. Update `frontend/src/services/api.js` → `BASE_URL` with your Render URL

---

## 📱 Frontend (React Native) Setup

### Prerequisites
- Node.js v18+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- Java 17 (for Android builds)

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Update API URL
Edit `src/services/api.js`:
```js
const BASE_URL = 'https://your-app.onrender.com'; // your deployed URL
// OR for local testing:
// const BASE_URL = 'http://10.0.2.2:5000'; // Android emulator
// const BASE_URL = 'http://localhost:5000';  // iOS simulator
```

### 3. Run on Android
```bash
# Start Metro bundler
npm start

# In another terminal
npm run android
```

### 4. Run on iOS (macOS only)
```bash
cd ios && pod install && cd ..
npm run ios
```

### 5. Build APK (Android Release)
```bash
# Generate signing key (first time only)
keytool -genkeypair -v -storetype PKCS12 -keystore android/app/release.keystore \
  -alias business-insights -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
cd android && ./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🧪 Postman Testing

1. Open Postman → Import → select `BusinessInsights.postman_collection.json`
2. Set collection variable `base_url` to your API URL
3. Run **Login** first — the token is auto-saved to collection variable
4. Run other requests — they use the saved token automatically

---

## 📋 Demo Credentials

| Field | Value |
|-------|-------|
| Email | `admin@business.com` |
| Password | `password123` |

---

## ✅ Features Implemented

- [x] JWT Authentication (Login / Logout)
- [x] Business Profile Screen
- [x] Insights Dashboard with metric cards
- [x] Bar Chart visualization (collapsible)
- [x] Reviews list with star ratings
- [x] Review filter by star rating
- [x] Pull-to-refresh on all screens
- [x] Error handling with retry
- [x] Loading states
- [x] Token persistence via AsyncStorage
- [x] Tap-to-call phone number
- [x] Tap-to-navigate address (Google Maps)
- [x] MongoDB Atlas integration
- [x] Render deployment ready
- [x] Postman collection

---

## 👤 Author

Built for Business Insights Dashboard Technical Assignment.

---

## 📄 License

MIT
