# Traced: Web-Based Therapeutic RPG 🎮

**Traced** is a web-based therapeutic application designed to assist individuals with **Autism Spectrum Disorder (ASD)** and **Dyspraxia** in developing fine motor skills.

By gamifying graphomotor exercises, users practice precision control by tracing abstract shapes. The system tracks accuracy, awards XP, and provides a low-frustration "Hot Reset" mechanism to encourage repetitive practice without anxiety.

---

## Features

* **✍️ Dynamic Tracing Engine:** Uses HTML5 Canvas to render shapes and detect cursor path compliance in real-time.
* **🔐 User Authentication:** Secure Login and Registration system using JWT (JSON Web Tokens) and Bcrypt.
* **📈 Progression System:** Users earn XP based on accuracy. Levels include "The Straight Path", "The Infinity Knot", and more.
* **🏆 Leaderboard:** Global ranking system to view top players by XP.
* **⚙️ Difficulty Modes:**
* **Easy:** Wide tolerance, low penalty.
* **Medium:** Standard precision required.
* **Hard:** Strict boundaries, high penalty for deviation.


* **🔄 Hot Reset:** Instant level retry mechanism designed for accessibility (no page reloads).
* **📱 Responsive Design:** Custom CSS styling for a focused, distraction-free interface.

---

## 🛠️ Technology Stack

* **Frontend:** React.js (Vite), HTML5 Canvas API
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Security:** `bcryptjs` (Hashing), `jsonwebtoken` (Auth), `cors` (Cross-Origin Resource Sharing)

---

## 🚀 Installation & Setup

### Prerequisites

* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or via Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/bhuvanesh-sudo/traced.git
cd traced

```

### 2. Backend Setup

The backend handles the API, database connection, and authentication.

1. Navigate to the backend folder:
```bash
cd backend

```


2. Install dependencies:
```bash
npm install

```


3. **Database Seeding (Crucial):**
You must populate the database with the initial shapes (levels). Run:
```bash
node seed.js

```


*(You should see "✅ Levels Seeded" in the console)*.
4. Start the Server:
```bash
node server.js

```


*(Ensure it says "🚀 Server running on port 5000" and "✅ MongoDB Connected")*

### 3. Frontend Setup

Open a **new terminal** window for the frontend.

1. Navigate to the root (or frontend folder):
```bash
cd frontend  # (Or root, depending on your folder structure)

```


2. Install dependencies:
```bash
npm install

```


3. Start the React App:
```bash
npm run dev

```


4. Open your browser at `http://localhost:5173`.

---

## 🕹️ How to Play

1. **Register/Login:** Create a "Hero" account to track your stats.
2. **Select a Level:** Choose a shape from the sidebar (e.g., "The Straight Path").
3. **Choose Difficulty:** Select Easy, Medium, or Hard.
4. **Trace:**
* Click and hold to draw.
* Follow the **Grey Guide Line**.
* Stay inside the path! If you go outside, the line turns red.


5. **Save XP:**
* Reach **98%** progress to complete the level.
* Click the green **"💾 Save & Claim XP"** button that appears.
* Watch your XP grow in the sidebar!

---

## 🔗 API Reference

| Method | Endpoint | Description |
| --- | --- | --- |
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Login and receive JWT |
| **GET** | `/api/game/shapes` | Fetch all level data |
| **GET** | `/api/game/leaderboard` | Get top 10 players by XP |
| **POST** | `/api/game/attempt` | Save game score and update XP |

---

## ❓ Troubleshooting

**1. "Network Error" or "Failed to fetch"**

* Ensure the backend is running (`node server.js`).
* Check that `server.js` has CORS enabled for `localhost:5173`.

**2. Login Page looks broken**

* Ensure `Login.css` is imported in `Login.jsx`.

**3. "Save XP" button not showing**

* You must complete the shape with >98% accuracy.
* Ensure you are logged in.

**4. Levels are empty**

* Run `node seed.js` in the backend folder to restore the shapes in MongoDB.

---
