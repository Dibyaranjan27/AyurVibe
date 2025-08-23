# 🌿 AyurVibe ✨

A modern, personalized Ayurvedic wellness dashboard designed to help you discover your unique mind-body constitution (Prakriti) and cultivate a balanced lifestyle.

This application provides users with an interactive quiz to determine their primary Dosha (Vata, Pitta, Kapha) and delivers tailored diet, routine, and lifestyle recommendations based on the results. It features a secure, persistent user authentication system with Firebase and a dynamic dashboard to track wellness goals.

<div align="center">
  <img src="https://img.shields.io/badge/react-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/firebase-%23FFCA28.svg?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
</div>

---

<div align="center">
  <a href="https://ayur-vibe.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/View_Live_Demo-346B4A?style=for-the-badge&logo=vercel&logoColor=white" alt="View Live Demo"/>
  </a>
</div>

---
## ✍️ Author's Note

This project was developed as an academic assignment for my college. The entire application was built from scratch in about a week. As a rapid development project, there may be bugs or areas for improvement. 

If you find any issues, please feel free to **raise an issue**. If you like the project, please give it a **star ⭐** and consider **forking it 🍴** to explore your own ideas!

---

## 🖥️ Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://github.com/Dibyaranjan27/AyurVibe/blob/main/screenshots/ayur-vibe.vercel.app_%20homepage.png" alt="AyurVibe Homepage Screenshot" width="400">
        <br/>
        <em>Homepage</em>
      </td>
      <td align="center">
        <img src="https://github.com/Dibyaranjan27/AyurVibe/blob/main/screenshots/ayur-vibe.vercel.app_results.png" alt="AyurVibe Results Screenshot" width="400">
        <br/>
        <em>Personalized Dosha Results</em>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://github.com/Dibyaranjan27/AyurVibe/blob/main/screenshots/ayur-vibe.vercel.app_%20quiz.png" alt="AyurVibe Quiz Screenshot" width="400">
        <br/>
        <em>Interactive Dosha Quiz</em>
      </td>
      <td align="center">
        <img src="https://github.com/Dibyaranjan27/AyurVibe/blob/main/screenshots/ayur-vibe.vercel.app_dashboard.png" alt="AyurVibe Dashboard Screenshot" width="400">
        <br/>
        <em>Personalized User Dashboard</em>
      </td>
    </tr>
     <tr>
      <td align="center">
        <img src="https://github.com/Dibyaranjan27/AyurVibe/blob/main/screenshots/ayur-vibe.vercel.app_login.png" alt="AyurVibe Login Screenshot" width="400">
        <br/>
        <em>Login Page</em>
      </td>
      <td align="center">
        <img src="https://github.com/Dibyaranjan27/AyurVibe/blob/main/screenshots/ayur-vibe.vercel.app_register.png" alt="AyurVibe Register Screenshot" width="400">
        <br/>
        <em>Registration Page</em>
      </td>
    </tr>
  </table>
</div>

---

## 📌 Key Features

-   🧘 **Interactive Dosha Quiz:** A comprehensive quiz to accurately determine the user's unique Prakriti.
-   📊 **Personalized Results:** A detailed results page displaying the Dosha breakdown and key traits.
-   📝 **Custom Wellness Plans:** Tailored diet, routine, and lifestyle recommendations for each Dosha type.
-   🔒 **Full Authentication:** Secure user registration and login with Firebase Auth (Email/Password, Google, Anonymous).
-   👤 **User Dashboard:** A central hub to view wellness streaks, track daily balance, and manage reminders.
-   ✏️ **Editable User Profiles:** Users can manage their personal and health details derived from the quiz.
-   🔔 **Real-Time Browser Notifications:** A functional notification system for scheduled reminders.
-   🌙 **Dark Mode Support:** A sleek, eye-friendly dark theme for comfortable use in low-light environments.
-   👑 **Admin Section:** A secure, role-based admin dashboard to view all users and feedback submissions.
-   🚀 **Modern & Accessible UI:** Built with a focus on clean design, accessibility, and smooth animations.

---

## 🔮 Future Plans

-   🤖 **AI-Powered Dosha Analysis:** Integrate a Machine Learning model to provide a more dynamic and accurate Dosha determination from the quiz answers.
-   🧠 **Generative AI for Custom Plans:** Utilize a Large Language Model (LLM) to generate deeply personalized diet and routine plans based on user preferences and goals.
-   💬 **AI Wellness Chatbot:** Implement an AI-driven chatbot to answer user questions, provide health feedback, and offer encouragement.

---

## 🛠️ Tech Stack

-   **Frontend:** React, TypeScript, Vite
-   **Styling:** Tailwind CSS
-   **Animation:** Framer Motion
-   **Backend & Database:** Firebase (Authentication, Firestore)
-   **Routing:** React Router
-   **State Management:** React Context API
-   **Notifications:** Browser Notification API

---

## 🔥 Firebase Setup Guide

To run this project, you need to set up your own Firebase project.

**1. Create a Firebase Project**
- Go to the [Firebase Console](https://console.firebase.google.com/) and click **"Add project"**.
- Give your project a name (e.g., "ayurvibe-app") and follow the setup steps.

**2. Create a Web App**
- In your new project's dashboard, click the web icon (`</>`) to add a new web app.
- Register the app with a nickname (e.g., "AyurVibe Web").
- After registering, Firebase will give you a `firebaseConfig` object. **Copy these credentials.**

**3. Enable Authentication Methods**
- In the Firebase console, go to **Build > Authentication**.
- Click the **"Sign-in method"** tab.
- You need to **enable** the following providers:
  - **Email/Password**
  - **Google** (you'll also need to provide a project support email)
  - **Anonymous**

**4. Set Up Firestore Database**
- Go to **Build > Firestore Database**.
- Click **"Create database"**.
- Start in **production mode**. This ensures your data is secure by default.
- Choose a location for your database servers.
- Go to the **"Rules"** tab and paste the following rules. This allows users to read and write only their own data.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  
    // Users Collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow list, get: if request.auth != null && request.auth.token.admin == true;
      allow delete: if request.auth != null && request.auth.token.admin == true;
    }

    // Feedback Collection
    match /feedback/{feedbackId} {
      allow create: if request.auth != null;
      allow list, get: if request.auth != null && request.auth.token.admin == true;
      allow delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

- Click **"Publish"** to save the rules.

---

## 🔧 Requirements

Before running the project, ensure you have the following installed:
-   Node.js (v18 or higher)
-   npm or yarn

---

## 🚀 Installation and Usage

### **1. Clone the Repository**
```sh
git clone https://github.com/Dibyaranjan27/ayurvibe.git
cd ayurvibe
```
### **2. Install Dependencies**
```sh
npm install
```

### **3. Set Up Firebase Environment Variables**

Create a .env.local file in the root of the project and add your Firebase project configuration. You can get these from your Firebase project settings.    

  `.env.local.example`

```
VITE_API_KEY="your-api-key"
VITE_AUTH_DOMAIN="your-auth-domain"
VITE_PROJECT_ID="your-project-id"
VITE_STORAGE_BUCKET="your-storage-bucket"
VITE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_APP_ID="your-app-id"
```
Rename this file to `.env.local` and fill in your actual Firebase credentials.

### **4. Run the Application**
```sh
npm run dev
```
The application will be available at `http://localhost:5173/`. To access the admin login, go to `http://localhost:5173/admin-login`.

## 👑 Becoming an Admin (Optional)

The application uses Firebase Custom Claims to manage admin roles securely. To make a user an admin, you must run a script using the Firebase Admin SDK.

### **Step 1: Get Your Firebase Service Account Key**
1.  Go to your **Firebase Console** -> **Project Settings** -> **Service accounts**.
2.  Click **"Generate new private key"**. A JSON file will be downloaded.
3.  Place this file in the root of your project and rename it to `serviceAccountKey.json`.
4.  **IMPORTANT:** Add `serviceAccountKey.json` to your `.gitignore` file immediately to prevent it from being committed to Git.

   
    ```
    # .gitignore
    serviceAccountKey.json
    ```

### **Step 2: Use the `setAdmin.js` Script**
1.  Open the `setAdmin.js` script located in your project root.
2.  Replace the placeholder email inside the script with the email address of a user who is already registered in your application.
3.  Install the Firebase Admin SDK if you haven't already:

   
    ```sh
    npm install firebase-admin
    ```

### **Step 3: Run the Script**
Execute the script from your terminal. This is a one-time action for each admin user.


```sh
node setAdmin.js
```

### Important Security Note
> The `serviceAccountKey.json` file grants **full administrative access** to your Firebase project. Protect it like a password. It is highly recommended to **delete this file from your project directory** after you have finished setting up your admin users, keeping a backup in a secure, private location (like a password manager).

---

## 📂 File Structure

A brief overview of the project's file structure.
```
/ayurvibe
│
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── assets/             # Images used throughout the application
│   ├── components/         # Reusable UI components (Navbar, Buttons, Cards, etc.)
│   ├── context/            # React Context providers (AppContext, NotificationsProvider)
│   ├── data/               # Firebase config, static data (questions, plans)
│   ├── hooks/              # Custom hooks (useOnClickOutside, useNotifications)
│   ├── icons/              # Static icons or icon components
│   ├── layouts/            # Main Layout for the routing
│   ├── pages/              # Top-level page components (Homepage, Login, Dashboard, etc.)
│   ├── styles/             # Additional global styles
│   ├── types/              # TypeScript type definitions (e.g., for quiz questions)
│   ├── utils/              # Utility and helper functions
│   │
│   ├── App.tsx             # Main application component with routing
│   ├── i18n.ts             # Internationalization (i18n) configuration
│   ├── index.css           # Global CSS and Tailwind directives
│   └── main.tsx            # The entry point of the React application
│
├── .env                    # Firebase environment variables (private)
├── index.html              # The main HTML file for Vite
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript compiler configuration
└── README.md               # This file
```
---

## 🤝 Contribution

Feel free to contribute to this project! Fork the repository, make your improvements, and submit a pull request. All contributions are welcome.

If you have any questions or suggestions, feel free to contact me. I'd be happy to help! 😊


## 📜 License

This project is open-source and available under the MIT License.



## 💡 Author

<p align="center">
<em>Crafted with pixels & passion by</em>
<br>
<strong>Dibyaranjan Maharana</strong>
<br>
<a href="https://github.com/Dibyaranjan27">GitHub</a> | <a href="https://www.linkedin.com/in/dibyaranjan-maharana-1228012b2/">LinkedIn</a>
</p>
