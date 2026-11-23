# Vemzora Rider Android

This repository is the Android Studio project for the Vemzora Rider WebView app.

## Build APK on GitHub (no Android Studio required)

1. Upload **all contents of this folder** to the root of a new GitHub repository. Keep the hidden `.github` folder and its path `.github/workflows/build-apk.yml`.
2. Commit to `main` (or `master`).
3. Open the repository's **Actions** tab.
4. Select **Build Vemzora Rider APK** and choose **Run workflow** if it has not already run automatically.
5. Open the successful run, scroll to **Artifacts**, and download `vemzora-rider-debug-apk`.
6. Extract the artifact ZIP. It contains `app-debug.apk`.

## App URL

The app loads `https://vemzora.in/?riderApp=1` from `app/build.gradle`.

The website must already be deployed with the matching Vemzora rider portal before installing/testing the APK.

## Important limitations

- This is a WebView Android app shell. Order login, rider identity, order state, and OTP workflow are provided by the website.
- The app does not include a separate backend.
- Reliable push notifications while the app is closed are not configured in this project. That requires a push backend (for example Firebase Cloud Messaging), device registration, and server-side event delivery.
- The included workflow builds a debug APK for testing. A signed release APK/AAB needs a release signing key and secure GitHub Secrets.
