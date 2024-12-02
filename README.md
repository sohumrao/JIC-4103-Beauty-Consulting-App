# Beauty Consulting App

This is a mobile app for beauty consultations.
The app's features include account creation, client and stylist profile creation,
a directory for searching for stylists based on location and user profiles,
booking and managing appointments, and live messaging.

The goal of this project is to bridge the gap between beauty clients and stylists:
allowing users to share important details before appointments will alleviate concerns
from both clients and stylists to improve the beauty appointment experience.

# Release Notes

## Version 1.0.0

### New Features

-   Preliminary Setup
    -   Landing Page
    -   Backend Server
    -   Database Connection
-   Authentication
    -   Sign Up
        -   Client & Stylist Consultations
    -   Login
    -   Password Reset (with email confirmation)
-   Profiles
    -   Client Profile Page
        -   Edit personal information and hair profile
        -   Delete with confirmation
    -   Stylist Business Information Page
        -   Add, edit, and delete services
-   Navigation
    -   Bottom Tab Navigation bar
    -   Logout button
-   Directory
    -   Location-based search
    -   Sorting results based on profile-matching algorithm
    -   Clients can view Stylist Business Information Pages
-   Appointments
    -   Calendar Component to select from available times
    -   Appointments Page to view upcoming appointments
    -   Clients/Stylists can view each other's profiles
    -   Appointment cancellation
-   Messaging
    -   Conversations Page to view active chats with other users
    -   Chat Page with real-time message sending and recieving
-   Developer Tooling
    -   Automatic code formatting and checks
    -   Standalone script to automatically generate plausible fake user data
    -   Docker Compose file for setting up mail server

### Bug Fixes

-   Upload, store, and display profile pictures to/from the database
-   Standardize backend error handling with Error objects
-   Prevent keyboard from covering the user interface on primary screens
-   Age field in profile was refactored into Birthday
-   Display errors to users on primary screens
-   Prevent users from navigating to previous pages when they shouldn't be able to
-   Prevent multiple users from booking the same appointment time with the same stylist
-   Revamped background image, header, and user interface appearance
-   Restructure files to remove circular imports and dependencies

### Known Issues

-   Clients can book multiple appointments with different stylists at the same time
-   Keyboard still obscures some input fields
-   Styling is not consistent on all pages
-   User interface appears squashed on small screens
-   Platform-native code has not been built for iOS/Android
-   Some forms on the frontend do not have proper input validation
-   Some backend endpoints are missing authorization and validation
-   Messaging backend uses a global websocket (potential bottleneck/security concern)
