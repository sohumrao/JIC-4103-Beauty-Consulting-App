# Beauty Consulting App

This product is a mobile app for beauty consultations. The current product includes account creation, client and stylist profile creation, and a directory for finding stylists in a client’s city based on their preferences and needs. From the beginning, the goal of this project has been to bridge the gap between beauty client and stylist; allowing users to upload details to be seen by stylists will alleviate concerns on both ends and make the consultation process easier overall.

# Release Notes

## Version 0.3.0

### New Features:

-   Directory screen for clients and stylists with matching
-   Password validation before account deletion
-   Intuitive navigation bar
-   Stylist view screen update

### Bug Fixes

-   Circular dependencies, as well as overreliance on userState resolved
-   User navigation is limited by new navigation bar
-   Fields synced between client and stylist

### Known issues

-   Keyboard still obscures some input fields
-   Directory filtering by city nonfunctional
-   No logout button

## Version 0.2.0

### New Features:

-   Stylist account creation (with business information) flow
-   Profile Information editing and deletion
-   Password reset implemented

### Bug Fixes

-   Requests are validated on the backend
-   Input errors are displayed to the user

### Known Issues

-   Visual clipping on input fields when keyboard is open
-   Plain text entry for Stylist Hair experience (fields are not synced between client and stylist)
-   No logout button
-   User can navigate backwards through flows
-   Circular dependency for navigation and session state

---

## Version 0.1.0

### New Features

-   Photo upload interface and storage
-   Signup and Create Account screens

### Bug Fixes

-   Added background image to signup screens

### Known Issues

-   Native code cannot be built for ios/android yet
-   Universal links for reset password links have yet to be implemented (this depends on building native code)
-   The actual reset password interface and API endpoint (after clicking on the reset link) are not yet implemented
-   Some components clash with styling of a few pages, causing unintended formatting errors

---

## Version 0.0.0

### Features

-   App landing screen
-   Client data input
-   Upload of data to database

### Bug Fixes

-   None

### Known Issues

-   Issues with sending client concerns via request body
-   Occasional issues with API URL

---
