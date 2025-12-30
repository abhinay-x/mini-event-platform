# 📅 Mini Event Platform – MERN Stack

A full-stack Mini Event Platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to create events, view upcoming events, and RSVP with strict capacity enforcement and concurrency safety.

This project was built as part of a Full Stack Developer Intern technical assessment, with a strong focus on backend correctness, business logic, and deployment readiness.

## 🔗 Live Application

- **Frontend (Vercel):** 
- **Backend (Render):** 
- **GitHub Repository:** https://github.com/abhinay-x/mini-event-platform.git

## 🧱 Tech Stack

### Frontend
- React.js
- Axios
- React Router
- Tailwind CSS (for responsive UI)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt (password hashing)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 📁 Project Structure

```
mini-event-platform/
├── client/               # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── server/               # Node + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
│
└── README.md
```

## ⚙️ Running the Application Locally

### 1️⃣ Clone the Repository

```bash
git clone 
cd mini-event-platform
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `/server` with:

```
PORT=5000
MONGO_URI=mongodb+srv://abhinay:Abhinay%401234@cluster0.edyvmpz.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start backend server:

```bash
npm run dev
```

Backend will run at: `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

## 🔐 Authentication Flow

- Users can sign up and log in
- Passwords are securely hashed using bcrypt
- JWT tokens are issued on login
- Protected routes use JWT middleware
- Only authenticated users can create, edit, delete, or RSVP to events

## 🎯 RSVP Capacity & Concurrency Handling (CORE LOGIC)

### ❗ Problem Statement

When multiple users attempt to RSVP simultaneously for an event with limited capacity, the system must:
- Prevent overbooking
- Avoid race conditions
- Ensure data consistency

### ✅ Solution Strategy Used

This project uses MongoDB atomic updates to enforce RSVP capacity safely.

#### 🔧 Key Techniques

- **Atomic Conditional Update**

```js
Event.findOneAndUpdate(
  { _id: eventId, attendeesCount: { $lt: capacity } },
  { $inc: { attendeesCount: 1 } },
  { new: true }
)
```

The update only succeeds if capacity is available, preventing two users from claiming the same slot.

- **Unique RSVP Constraint**

`{ userId, eventId }` → unique index

Prevents duplicate RSVPs by the same user.

- **Rollback on Failure**

If RSVP record creation fails, the attendee count is reverted, ensuring data consistency.

### 🛡 Why This Works

- MongoDB guarantees atomicity at the document level.
- No race condition even under simultaneous requests.
- Scales well without complex locking mechanisms.

## ✅ Features Implemented

### 🔹 Core Features
- User Signup & Login (JWT-based authentication)
- Create, view, edit, and delete events
- Event image upload
- RSVP to events
- Cancel RSVP
- Strict capacity enforcement
- Concurrency-safe RSVP handling
- Responsive UI (Desktop / Tablet / Mobile)
- Authorization checks (creator-only edit/delete)

### ⭐ Enhanced Features
- Search events by title
- User dashboard:
  - Events created by user
  - Events user has RSVP’d to
- Event status indicators:
  - Available
  - Few slots left
  - Full
- Button states & validations
- Toast notifications for user actions

## 🚀 Deployment

### 🌐 Frontend Deployment (Vercel)

Environment variables:

```
VITE_API_BASE_URL=http://localhost:5000
```

### 🧠 Backend Deployment (Render)

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables:** 
      MONGO_URI=mongodb+srv://abhinay:Abhinay%401234@cluster0.edyvmpz.mongodb.net/?appName=Cluster0
      JWT_SECRET=your_jwt_secret
      PORT=5000      