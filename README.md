# EventMate - Food Event Meetup App

EventMate is a React Native mobile application designed to connect food lovers and community members through local social events. Built using Firebase and TypeScript, this app allows users to discover nearby events, RSVP instantly, and interact with others via live comments — all from their mobile devices. The goal of the project was to create an intuitive, community-driven platform where event participation and engagement feel seamless.
---

Core Features

1. Event Discovery: Browse a curated list of local food and social events with engaging visuals and live data from Firebase Realtime Database.

2. Event Creation: Logged-in users can host their own events, complete with event image, location (via Google Places API), date, and description.

3. RSVP System: Users can RSVP in real-time — the system updates instantly, showing who’s attending (“going”) through live Firebase sync.

4. Comments Section: Each event includes a comment section for users to share thoughts, feedback, or plans. Built for real-time updates without page reloads.

5. Authentication & Session Management: Firebase Authentication handles secure sign-up, login, and persistent sessions using AsyncStorage.

6. Google Places Integration: Seamless autocomplete for event locations while creating new events.

7. Responsive Theming: Adaptive design that supports both light and dark modes for better user experience.

8. User Profile Management: Each user can manage their profile and view their RSVP’d events.





| Member         | Role                       | Responsibilities                              |
|----------------|----------------------------|-----------------------------------------------|
| Aftab Miraj    | Full-Stack Developer       | React Native UI, Firebase integration, Comments, RSVP |




## Tech Stack

Frontend: React Native (Expo), TypeScript

Backend: Firebase (Auth, Realtime Database, Hosting)

APIs: Google Places API

UI/UX: React Native Paper, Styled Components

Navigation: React Navigation

Storage: AsyncStorage for session and local cache

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




## Installation & Setup

### 1. Clone the Repository
git clone https://github.com/swachchhakh/food-events-app.git
cd food-events-app
yarn install/ npm install
npx expo start -c


1. Create a new project using this template:

npx create-expo-app@latest --template react-navigation/template

2. Edit the "app.json" file to configure the `name`, `slug`, `scheme` and bundle identifiers (`ios.bundleIdentifier` and `android.bundleIdentifier`) for your app.

3. Edit the "src/App.tsx" file to start working on your app.

## Running the app

- Install the dependencies:
  npm install
  

- Start the development server:

  npm start


- Build and run iOS and Android development builds:
  npm run ios
  # or
  npm run android
  

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
