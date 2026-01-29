# Melooha - Astrology Web Application

A full-stack astrology web application featuring user authentication, birth chart generation, zodiac insights, and AI-powered daily guidance.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Project Overview

This project demonstrates proficiency in:
- **Frontend-Backend Interaction** - RESTful API communication
- **API Integration** - External service integration with fallback strategies
- **Authentication** - JWT-based secure authentication
- **AI Integration** - Google Gemini AI for personalized content
- **Clean Architecture** - MVC pattern with service layer

## 🏗️ Architecture & Design Patterns

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Pages   │  │Components│  │ Context  │  │ Services │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       └─────────────┼─────────────┼─────────────┘               │
│                     │             │                              │
└─────────────────────┼─────────────┼──────────────────────────────┘
                      │ HTTP/REST   │ State
┌─────────────────────┼─────────────┼──────────────────────────────┐
│                     ▼             │     SERVER (Express)         │
│  ┌──────────────────────────────────────────────────────┐       │
│  │                    ROUTES                             │       │
│  │   /auth    │    /astrology    │    /guidance         │       │
│  └──────┬─────────────┬─────────────────┬───────────────┘       │
│         │             │                 │                        │
│  ┌──────▼─────────────▼─────────────────▼───────────────┐       │
│  │                 MIDDLEWARE                            │       │
│  │         JWT Authentication │ Error Handling          │       │
│  └──────┬─────────────┬─────────────────┬───────────────┘       │
│         │             │                 │                        │
│  ┌──────▼─────────────▼─────────────────▼───────────────┐       │
│  │                 CONTROLLERS                           │       │
│  │   authController │ astrologyController │ guidance    │       │
│  └──────┬─────────────┬─────────────────┬───────────────┘       │
│         │             │                 │                        │
│  ┌──────▼─────────────▼─────────────────▼───────────────┐       │
│  │                  SERVICES                             │       │
│  │   geminiService  │  prokeralaService                 │       │
│  │   (Strategy Pattern: AI ↔ Fallback)                  │       │
│  └──────┬─────────────┬─────────────────────────────────┘       │
│         │             │                                          │
└─────────┼─────────────┼──────────────────────────────────────────┘
          │             │
    ┌─────▼─────┐  ┌────▼────────┐
    │  MongoDB  │  │ External    │
    │  Atlas    │  │ APIs        │
    └───────────┘  │ - Gemini AI │
                   │ - Prokerala │
                   └─────────────┘
```

### Design Patterns Used

| Pattern | Implementation | Purpose |
|---------|---------------|---------|
| **MVC** | Routes → Controllers → Models | Separation of concerns |
| **Service Layer** | `geminiService`, `prokeralaService` | External API abstraction |
| **Singleton** | Database connection, Services | Single instance management |
| **Strategy** | AI with fallback mechanism | Graceful degradation |
| **Middleware** | JWT auth, error handling | Request pipeline |
| **Repository** | Mongoose models | Data access abstraction |

## ✨ Features

### 🔐 Authentication
- User registration with birth details (DOB, Time, Place)
- JWT-based secure authentication
- Password hashing with bcrypt
- Protected API routes

### 🔮 Astrology Features
- **Zodiac Profile**: Complete sign info with traits, compatibility, lucky items
- **Kundli/Birth Chart**: Personalized birth chart with planetary positions
- **Daily Horoscope**: Zodiac-based predictions
- **Panchang**: Traditional Hindu calendar data

### 🤖 AI Features
- **Daily Guidance**: Personalized AI-generated cosmic messages
- **AI Chat**: Interactive conversational astrology assistant
- **Chat History**: Persistent conversation storage in MongoDB

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18, Vite | UI framework |
| Backend | Node.js, Express | API server |
| Database | MongoDB Atlas | Data persistence |
| **Vector DB** | **ChromaDB** | **RAG / Context storage (BONUS)** |
| Auth | JWT, bcryptjs | Authentication |
| AI | Groq (Llama 3.3 70B) | Content generation |
| Astrology | Prokerala API | Astrological data |

## 🧠 RAG Architecture (Vector Database - BONUS)

The application uses **ChromaDB** for Retrieval Augmented Generation:

```
User Query → Vector Search → Retrieve Context → AI Generation
     │              ▼                                  │
     │       ┌──────────────┐                         │
     │       │  ChromaDB    │                         │
     │       │  (23 docs)   │                         │
     │       │  Knowledge   │                         │
     │       └──────────────┘                         │
     └───────────────────────────────────────► Groq AI
                                        (Context-aware response)
```

### Knowledge Base (23 Documents):
- 12 Zodiac profiles with traits & careers
- Planetary meanings (Sun, Moon, Saturn, Jupiter)
- House interpretations (1st, 2nd, 7th, 10th)
- Topics: love, career, health, dasha, retrograde

## 📁 Project Structure

```
Melooha/
├── server/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.js           # Entry point with API docs
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection (Singleton)
│   │   ├── models/
│   │   │   ├── User.js        # User schema with validation
│   │   │   └── ChatMessage.js # Chat history schema
│   │   ├── middleware/
│   │   │   └── authMiddleware.js # JWT verification
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── astrologyRoutes.js
│   │   │   └── guidanceRoutes.js
│   │   ├── controllers/       # Request handlers (MVC)
│   │   │   ├── authController.js
│   │   │   ├── astrologyController.js
│   │   │   └── guidanceController.js
│   │   └── services/          # External API integration
│   │       ├── geminiService.js    # AI (Strategy pattern)
│   │       └── prokeralaService.js # Astrology API
│   └── .env                   # Configuration
│
├── client/                    # Frontend (React + Vite)
│   └── src/
│       ├── App.jsx           # Routes & guards
│       ├── context/
│       │   └── AuthContext.jsx # Global auth state
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   └── DashboardPage.jsx
│       ├── components/
│       │   ├── ZodiacInfo.jsx
│       │   ├── KundliChart.jsx
│       │   ├── DailyGuidance.jsx
│       │   └── AIChat.jsx
│       └── services/
│           └── api.js        # Axios with interceptors
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Google AI Studio account (free)

### Installation

```bash
# Clone and install
cd Melooha

# Install backend
cd server && npm install

# Install frontend
cd ../client && npm install
```

### Configuration

Create `server/.env`:
```env
PORT=5000
JWT_SECRET=your_secret_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/melooha
GEMINI_API_KEY=your_gemini_key
PROKERALA_CLIENT_ID=your_client_id
PROKERALA_CLIENT_SECRET=your_secret
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Run

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Visit: http://localhost:3000

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register  # Register with birth details
POST /api/auth/login     # Login, returns JWT
GET  /api/auth/me        # Get profile (protected)
PUT  /api/auth/me        # Update profile (protected)
```

### Astrology (Protected)
```
GET /api/astrology/zodiac          # Zodiac sign info
GET /api/astrology/kundli          # Birth chart
GET /api/astrology/daily-horoscope # Daily horoscope
GET /api/astrology/panchang        # Panchang data
```

### AI Guidance (Protected)
```
GET    /api/guidance/daily        # AI daily guidance
POST   /api/guidance/chat         # Chat with AI
GET    /api/guidance/chat/history # Chat history
DELETE /api/guidance/chat/history # Clear history
```

## 🔒 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiry
- Protected routes via middleware
- Input validation on all endpoints
- CORS configured for security

## 🎨 UI/UX

- Dark cosmic theme
- Responsive design
- Glassmorphism effects
- Smooth animations
- Intuitive navigation

## 📊 Database Schema

```javascript
// User Model
{
  email: String,
  password: String (hashed),
  name: String,
  dateOfBirth: Date,
  timeOfBirth: String,
  placeOfBirth: String,
  coordinates: { latitude, longitude },
  zodiacSign: String (auto-calculated),
  createdAt: Date
}

// ChatMessage Model
{
  user: ObjectId (ref: User),
  role: 'user' | 'assistant',
  content: String,
  createdAt: Date
}
```

## 🔄 Error Handling Strategy

The application implements graceful degradation:

1. **AI Unavailable** → Falls back to curated zodiac-specific messages
2. **Astrology API Down** → Uses calculated fallback data
3. **Auth Failures** → Clear error messages with guidance
4. **Network Issues** → Automatic retry with user feedback

## 🎯 Future Enhancements

- [ ] Email verification
- [ ] Password reset
- [ ] Geocoding for birth place
- [ ] Detailed Dasha predictions
- [ ] User compatibility matching
- [ ] Mobile app (React Native)
- [ ] Vector database for AI context (RAG)

## 📝 Interview Discussion Points

1. **Why MVC with Service Layer?**
   - Separation of concerns for maintainability
   - Services abstract external dependencies
   - Easy to test and mock

2. **Strategy Pattern for AI?**
   - Graceful degradation when API unavailable
   - Seamless user experience
   - Easy to swap AI providers

3. **JWT vs Sessions?**
   - Stateless scalability
   - Works well with SPAs
   - Easy to verify on any server

4. **MongoDB vs SQL?**
   - Flexible schema for user data
   - Easy horizontal scaling
   - Native JavaScript/JSON support

---

**Built with ✨ cosmic energy**
