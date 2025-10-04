## 🎵 Harmony Music Streaming Platform

A modern **Spotify-style music streaming website** where users can **upload, play, and manage their songs** — anytime, anywhere. Built with simplicity, performance, and clean design in mind.

## 📜 Description

**Harmony** is a full-stack music streaming platform that allows users to:
🎧 Upload their own songs.
🎶 Create personalized playlists.
💿 Stream music with smooth, fast playback.
📱 Access their favorite tracks from any device.

The goal of this project is to provide a **self-hosted, user-friendly alternative** to mainstream streaming apps like **Spotify**, while giving creators more control over their content.

## 📸 Screenshots and ✨ Key Features

* **User Authentication:** Secure login and registration system.
* <img width="1898" height="880" alt="image" src="https://github.com/user-attachments/assets/14b2b47a-3917-409c-b87f-9ed614c3a91c" />
* **Upload & Stream Music:** Users can upload songs and listen instantly.
* <img width="1884" height="881" alt="image" src="https://github.com/user-attachments/assets/b1c0d5b7-dc93-4af7-9c23-5c6b493a4954" />
* **Dynamic Playlist Management:** Create and manage playlists easily.
* <img width="1902" height="874" alt="image" src="https://github.com/user-attachments/assets/611b525a-4e4f-4cde-a914-556f918d6bb6" />
* **Search & Filter:** Quickly find songs, artists, or albums.
* <img width="1911" height="876" alt="image" src="https://github.com/user-attachments/assets/c44bd089-c125-4c8a-96b2-e00df40cca40" />

* **Responsive UI:** Fully optimized for desktop and mobile.
* **Modern Design:** Clean and minimal interface with smooth animations.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (React.js or similar)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JSON Web Tokens (JWT)
* **Deployment:** Cloud Run / Vercel / Render

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

### 🧩 Prerequisites

Make sure you have installed:

* Node.js (v20 or higher)
* npm (Node Package Manager)

---

### ⚙️ Installation & Setup

1. **Download the repository**

   ```bash
   git clone https://github.com/SURAJ1430sv/Harmony-Music-Streaming-Platform.git
   ```

2. **Open the folder with your code editor (e.g., VS Code)**

3. **Open terminal inside your editor**

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

Your app will be running locally — usually at:
👉 **[http://localhost:5000](http://localhost:5000)**

## 📂 Folder Structure

Harmony-Music-Streaming-Platform/
│
├── backend/               # Server-side logic
│   ├── controllers/       # Handle API requests
│   ├── models/            # MongoDB schemas
│   ├── routes/            # Express routes
│   └── server.js          # Entry point for backend
│
├── frontend/              # Client-side interface
│   ├── public/            # Static assets
│   ├── src/               # App source files
│   │   ├── components/    # UI components
│   │   ├── pages/         # Individual pages (Home, Player, Upload)
│   │   └── App.js         # Main application file
│   └── package.json       # Frontend dependencies
│
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── README.md              # Project documentation
└── package.json           # Main dependencies

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more information.
task = "packager.installForAll"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
waitForPort = 5000
