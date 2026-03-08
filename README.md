<div align="center">
  <img src="public/vite.svg" alt="Mano.ai Logo" width="80" height="80">
  <h1>Mano.ai</h1>
  <p><strong>A Gamified, AI-Powered Sign Language Learning Platform & Real-Time Translator</strong></p>

  [![Live Demo](https://img.shields.io/badge/Live_Demo-manoai--seven.vercel.app-00E5FF?style=for-the-badge&logo=vercel)](https://manoai-seven.vercel.app/)
  
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![MediaPipe](https://img.shields.io/badge/AI_Powered-MediaPipe-FF6D00?style=flat-square&logo=google)]()
  [![Three.js](https://img.shields.io/badge/3D_Avatar-Three.js-000000?style=flat-square&logo=three.js)]()
</div>

<br />

## 🌟 About The Project

**Mano.ai** is an innovative, accessible application designed to bridge the communication gap between the hearing and the Deaf communities. It takes inspiration from popular gamified learning apps (like Duolingo) but completely reimagines them for sign language. 

Through highly responsive **AI Hand Tracking (MediaPipe)**, interactive **3D Avatars (Three.js)**, and an engaging reward system (Streaks, XP, and global Leaderboards), learning sign language becomes incredibly accessible and addictively fun.

Beyond just learning, the app features **The Bridge**, an accessibility mode acting as a real-time translator: it listens to spoken speech and instantly translates it into 3D sign language animations to foster seamless face-to-face communication.

---

## ✨ Key Features

* **📚 Interactive Gamified Lessons**: Learn alphabets, greetings, and common words with a structured curriculum. 
* **📷 Real-Time AI Tracking**: Practice signs physically. The app uses the device's webcam and Google MediaPipe to verify your signs with high accuracy.
* **🧊 3D Sign Language Avatars**: View intricate hand models demonstrating signs from multiple angles seamlessly implemented via React Three Fiber.
* **🌉 The Bridge Mode**: Point your device at a hearing person speaking. The app will generate live captions and dynamically sign the words using the 3D Avatar!
* **🏆 Leaderboards & Daily Quests**: Compete with others globally, track XP, maintain streaks, and accomplish daily missions to unlock achievements.
* **🎛 Multi-Dialect Ready**: Built with localization in mind (ASL, BSL, ISL region toggling available in Settings).
* **💎 Premium Aesthetic**: Developed with a stunning, modern dark-mode UI incorporating "glassmorphism", neon glows, and buttery-smooth `framer-motion` animations.

---

## 🚀 Live Demo

Check out the live deployment of the application here:
**[https://manoai-seven.vercel.app/](https://manoai-seven.vercel.app/)**

> **Note:** For the best experience, please allow Camera permissions when prompted. The AI Tracker relies on the webcam to evaluate your physical sign language practices.

---

## 🛠 Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand)
* **AI Computer Vision**: [@mediapipe/tasks-vision](https://developers.google.com/mediapipe)
* **3D Rendering**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/) + [@react-three/drei](https://github.com/pmndrs/drei)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Deployment**: [Vercel](https://vercel.com/)

---

## 💻 Running Locally

To get a local development environment up and running, follow these steps:

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aswinkj2006/manoai.git
   cd manoai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173/` to see the app in action!

### Build for Production

```bash
npm run build
npm run preview # To preview the production bundle locally
```

---

## 📂 Project Structure

```text
manoai/
├── public/                 # Static assets (3D models like hand.glb, icons)
├── src/
│   ├── components/         # Reusable React components (BottomNav, Lesson, etc.)
│   │   ├── AvatarViewer.tsx # 3D Canvas / Three.js Implementation
│   │   ├── AITracker.tsx    # MediaPipe Hand Tracking Implementation
│   │   ├── BridgeMode.tsx   # Speech-to-Sign Real-time Component
│   │   └── ...
│   ├── data/               # Static course data, curriculums, and lesson structure
│   ├── store/              # Zustand global state (index.ts)
│   ├── App.tsx             # Main routing and dashboard structure
│   ├── App.css             # Global CSS Variables and Design System (Glassmorphism)
│   └── main.tsx            # React Entry Point
├── package.json
└── vite.config.ts
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🎨 Design System

Mano.ai features a highly customized vanilla CSS setup utilizing:
- **Neon Accents**: `rgba(0, 229, 255)` primary and `rgba(255, 0, 85)` secondary.
- **Glassmorphism panels**: `backdrop-filter: blur(16px)` on semi-transparent backgrounds.
- **Micro-interactions**: Hover lifts, ripple feedbacks, and smooth page transitions via Framer Motion.

---

<div align="center">
  <i>Built with ❤️ for accessible learning and communication.</i>
</div>
