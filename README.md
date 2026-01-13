# React Canvas Game Engine

A high-performance 2D game boilerplate built with **React** and the **HTML5 Canvas API**. This project demonstrates how to handle game loops, rendering cycles, and state management (scoring, resetting) within a modern React functional component structure.

## 🚀 Features

* **HTML5 Canvas Integration:** Direct pixel manipulation using the Canvas 2D Context.
* **Optimized Game Loop:** Uses `requestAnimationFrame` for smooth 60 FPS rendering, decoupled from React's render cycle.
* **State Management:**
    * Real-time Score tracking.
    * **Reset/Restart Functionality:** Instantly clears the canvas and resets game variables without reloading the page.
* **React Hooks:** Utilizes `useRef` for DOM access and `useEffect` for lifecycle management.

## 🛠️ Tech Stack

* **Frontend Library:** React.js
* **Build Tool:** Vite (Recommended) or Create React App
* **Rendering:** HTML5 Canvas API
* **Styling:** CSS / Tailwind CSS

## 📦 Installation & Setup

Prerequisites: Ensure you have **Node.js** installed (v14+ recommended).

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    # or if using Create React App:
    # npm start
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA).

## 🎮 How It Works

### The Game Loop Pattern
Unlike standard React apps that render based on state changes, this project uses a mutable ref approach to handle the game loop to avoid performance bottlenecks.

```javascript
// Simplified Logic
const render = () => {
  draw(ctx); // Custom drawing logic
  animationRef.current = requestAnimationFrame(render);
};
