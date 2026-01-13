# Traced: Web-Based Therapeutic RPG

> **"A Web-based RPG designed specifically to assist children with ASD and Dyspraxia in developing fine motor skills."**

**Traced** is a gamified occupational therapy tool built using **React** and the **HTML5 Canvas API**. It merges the engagement of Role-Playing Games (RPGs) with the repetitive motor-skill drills required for dyspraxia intervention, making therapy accessible and enjoyable.

## 📖 History & Motivation

Traditional fine motor skill therapy often involves repetitive tracing worksheets or pegboard tasks. For children with **Autism Spectrum Disorder (ASD)** or **Dyspraxia**, these tasks can be under-stimulating or frustration-inducing, leading to disengagement.

**Traced** was developed to solve this by:
1.  **Digitizing the "Tracing" Mechanic:** Moving graphomotor exercises from paper to the screen to improve mouse/trackpad proficiency.
2.  **Gamification:** Wrapping motor drills in an RPG narrative to provide extrinsic motivation (XP, Loot, Story) for completing physical tasks.

## 🧩 How It Helps: Design for Accessibility

The architecture of *Traced* was built with specific cognitive and physical accessibility guidelines in mind.

### 1. Targeting Dyspraxia (Fine Motor Control)
Dyspraxia affects the planning and coordination of movement.
* **The "Tracing" Engine:** The core mechanic requires the user to guide a character/cursor along a specific path without deviating. This strengthens **hand-eye coordination** and cursor precision.
* **Canvas Smoothing:** The game uses `requestAnimationFrame` for a high refresh rate. This ensures immediate visual feedback between hand movement and screen response, which is critical for correcting motor planning errors.



### 2. Targeting ASD (Sensory & Routine)
* **Low-Frustration UI:** The **"Hot Reset"** feature (implemented via React State) allows the child to instantly restart a level if they make a mistake. There are no "Game Over" screens or punishing sounds, reducing anxiety and preventing meltdowns associated with failure.
* **Predictable Visuals:** The pixel-art aesthetic provides high-contrast, clear boundaries that are easy to process visually, avoiding the sensory overload of modern high-fidelity graphics.

### 3. Cognitive Load Management
* **Single-Task Focus:** The game isolates one motor task at a time (e.g., "Move from A to B") without complex keyboard combinations that might confuse a user with poor proprioception.

## 🛠️ Technical Architecture

* **Frontend:** React (Vite)
* **Rendering:** HTML5 Canvas 2D Context (for pixel-perfect collision detection on traced paths).
* **Backend:** Node.js/Express (for saving progress/scoreboards so parents/therapists can track improvement over time).
* **Database:** MongoDB (Stores session data to analyze motor consistency).

## 🚀 Key Features

* **Precision Hitboxes:** The game detects when the cursor leaves the "safe path" using pixel-data analysis, providing gentle correction rather than failure states.
* **Therapeutic Progression:** Levels scale in difficulty, starting with straight lines (basic linear movement) and progressing to curves and zig-zags (complex motor planning).
* **Cross-Platform Access:** Being web-based, it allows therapy to happen at home on any computer, removing barriers to entry.

## 📦 Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/traced-rpg.git](https://github.com/your-username/traced-rpg.git)
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the application:
    ```bash
    npm run dev
    ```

## 📄 License

Distributed under the MIT License.
