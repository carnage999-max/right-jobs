# RightJobs Mobile App

Built with React Native, Expo, and NativeWind.

## Features
- **Job Seeker**: Search jobs, apply, manage profile, ID verification wizard.
- **Admin**: Dashboard stats, user management, ID verification moderation.
- **Modern UI**: Rounded floating bottom navigation, glassmorphism, and sleek micro-animations.
- **Robust State**: TanStack Query for API state and React Hook Form for validation.

## Prerequisites
- Node.js (Latest LTS)
- pnpm (`npm install -g pnpm`)
- Expo Go (on your mobile device or emulator)

## Setup
1. Clone the repository and navigate to the mobile folder:
   ```bash
   cd right-jobs/mobile
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and set `EXPO_PUBLIC_API_URL` to your backend's API endpoint.*

## Running the App
- **Start Expo Development Server**:
  ```bash
  pnpm start
  ```
- **Run on Android**:
  ```bash
  pnpm android
  ```
- **Run on iOS**:
  ```bash
  pnpm ios
  ```
- **Open in Browser**:
  ```bash
  pnpm web
  ```

## Project Structure
- `app/`: Expo Router routes and layouts.
- `src/components/`: Reusable UI components.
- `src/screens/`: Main screen implementations.
- `src/services/api/`: API client and services.
- `src/context/`: React context providers (Auth).
- `src/hooks/`: Custom hooks (useToast, etc.).
- `docs/`: Mobile-specific documentation.

## Build and Deployment
To build for production using EAS:
1. Install EAS CLI: `npm install -g eas-cli`
2. Login to Expo: `eas login`
3. Configure EAS: `eas build:configure`
4. Build for Android: `eas build --platform android`
5. Build for iOS: `eas build --platform ios`
