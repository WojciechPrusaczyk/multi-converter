# Multikonwerter

A modern, interactive **file converter** for **images and videos**, built with **Flask (Python)** and **React.js**, featuring a **dark, glassmorphism UI** with drag & drop, preview, progress animations, and one-click conversion.

This tool allows you to easily convert images (JPG, PNG, GIF, WebP) and videos (MP4, AVI, MOV, WebM) locally, without needing to use the command line.  
All conversions are powered by **ImageMagick** and **FFmpeg**, wrapped with a simple web interface.

---

## 🛠 Tech Stack & Requirements

![Python](https://img.shields.io/badge/Python%20%5E3.13-yellow?style=for-the-badge&logo=python)  
![NodeJS](https://img.shields.io/badge/Node.js%20%5E18+-gray?style=for-the-badge&logo=nodedotjs)  
![ReactJS](https://img.shields.io/badge/React.js-00d8ff?style=for-the-badge&logo=react)  
![Flask](https://img.shields.io/badge/Flask-black?style=for-the-badge&logo=flask)  
![FFmpeg](https://img.shields.io/badge/FFmpeg-darkgreen?style=for-the-badge&logo=ffmpeg)  
![ImageMagick](https://img.shields.io/badge/ImageMagick-purple?style=for-the-badge&logo=imagemagick)

### Requirements:
- **Python 3.13+** (with `venv`)
- **Node.js 18+**
- **npm**
- **ImageMagick** (for image conversions)
- **FFmpeg** (for video conversions)

---

## 🚀 Features
- Drag & Drop file upload with preview
- Convert **images** (JPG, PNG, GIF, WebP)
- Convert **videos** (MP4, AVI, MOV, WebM)
- Animated progress bar and smooth transitions
- Glassmorphism dark UI design
- Fully offline – no external API, your files never leave your system
- Runs via a single `run.sh` script (backend + frontend combined)

---

## 🔧 Installation & Usage

1. Clone the repository:

        git clone https://github.com/<your-username>/multikonwerter.git
        cd multikonwerter

2. Install required system dependencies:

        sudo zypper install ffmpeg ImageMagick

3. Make the run script executable:

        chmod +x run.sh

4. Start the application:

        ./run.sh

   This script will:
    - Create a Python virtual environment (if missing)
    - Install backend (Flask) dependencies
    - Install frontend (React) dependencies
    - Build the React app into static files
    - Launch the combined Flask + React server on port **5000**

5. Open in your browser:

        http://localhost:5000

---

## 📂 Project Structure

        multikonwerter/
        ├── backend/         # Flask backend (API + serves built React)
        │   ├── app.py       # Development server (API only)
        │   └── app_static.py # Production server (API + React build)
        ├── frontend/        # React frontend (source code)
        │   ├── src/         # Components, styles, app logic
        │   └── build/       # Production build (generated)
        ├── run.sh           # Single script to run the whole app
        └── requirements.txt # Backend dependencies

---
