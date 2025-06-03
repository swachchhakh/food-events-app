# 🍽️ Food Event Meetup App

A React Native mobile app that allows users to discover food-related events, RSVP, and engage through comments. Built with Firebase for real-time interaction and authentication.

---

## 🚀 Features

- 🔥 Real-time event listing
- ✅ RSVP support (Going / Not Going)
- 💬 Comment section with live updates
- 🔐 Firebase Auth (Email/Password)
- 🖼️ Event images & details
- 📱 Keyboard-aware UI

---

## 👨‍💻 Team Roles

| Member         | Role                       | Responsibilities                              |
|----------------|----------------------------|-----------------------------------------------|
| Aftab Miraj    | Full-Stack Developer       | React Native UI, Firebase integration, Comments, RSVP |
| Noble Kodie   | UI/UX Designer (Optional)  | Wireframes, design systems (Figma, etc.)       |



## 🛠️ Tech Stack

- **React Native (with Expo)**
- **Firebase (Auth + Realtime Database)**
- **TypeScript / JavaScript**
- **AsyncStorage**
- **React Navigation**

<details>
   <summary>
   ├── components/
   ├── CommentsSection.tsx
   ├── GooglePlacesApi.js
   ├── Rsvp.tsx
├── navigation/
    ├── screens/
     ├── Home.tsx
     ├── CreateEvent.tsx
     ├── Home.tsx
     ├── Login.tsx
     ├── Register.tsx
     ├── Profile.tsx
     ├── Event/
        ├── EventDetails.tsx
        ├── CreateEvent.tsx
        ├── EventList.tsx     
├── services/
│   ├── firebaseConfig.ts
    ├── AuthService.ts
├── App.tsx
├── package.json
└── README.md
</summary>
</details>




## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/swachchhakh/food-events-app.git
cd food-events-app
yarn install/ npm install
npx expo start -c


1. Create a new project using this template:

   ```sh
   npx create-expo-app@latest --template react-navigation/template
   ```

2. Edit the `app.json` file to configure the `name`, `slug`, `scheme` and bundle identifiers (`ios.bundleIdentifier` and `android.bundleIdentifier`) for your app.

3. Edit the `src/App.tsx` file to start working on your app.

## Running the app

- Install the dependencies:

  ```sh
  npm install
  ```

- Start the development server:

  ```sh
  npm start
  ```

- Build and run iOS and Android development builds:

  ```sh
  npm run ios
  # or
  npm run android
  ```

- In the terminal running the development server, press `i` to open the iOS simulator, `a` to open the Android device or emulator, or `w` to open the web browser.

## Notes

This project uses a [development build](https://docs.expo.dev/develop/development-builds/introduction/) and cannot be run with [Expo Go](https://expo.dev/go). To run the app with Expo Go, edit the `package.json` file, remove the `expo-dev-client` package and `--dev-client` flag from the `start` script.

We highly recommend using the development builds for normal development and testing.

The `ios` and `android` folder are gitignored in the project by default as they are automatically generated during the build process ([Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/)). This means that you should not edit these folders directly and use [config plugins](https://docs.expo.dev/config-plugins/) instead. However, if you need to edit these folders, you can remove them from the `.gitignore` file so that they are tracked by git.

## Resources

- [React Navigation documentation](https://reactnavigation.org/)
- [Expo documentation](https://docs.expo.dev/)

---

Demo assets are from [lucide.dev](https://lucide.dev/)
