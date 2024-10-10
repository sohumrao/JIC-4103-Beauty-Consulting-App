# Beauty Consulting App

This product is a mobile app for beauty consultations. The current product is a client profile creation interface, allowing for users to input personal information as well as specific hair details/concerns. This was chosen as the artifact to be implemented because from the beginning, the goal of this project has been to bridge the gap between beauty client and stylist; allowing users to upload details to be seen by stylists will alleviate concerns on both ends and make the consultation process easier overall. This artifact also allows for a demonstration of the full technology stack, since data can be inputted through the UI, sent to the back end, and uploaded to the database.

# Release Notes

## Version 0.2.0

### New Features:

- Stylist account creation (with business information) flow
- Profile Information editing and deletion
- Password reset implemented

### Bug Fixes

- Requests are validated on the backend
- Input errors are displayed to the user

### Known Issues

- Visual clipping on input fields when keyboard is open
- Plain text entry for Stylist Hair experience (fields are not synced between client and stylist)
- No logout button
- User can navigate backwards through flows
- Circular dependency for navigation and session state

---

## Version 0.1.0

### New Features

- Photo upload interface and storage
- Signup and Create Account screens

### Bug Fixes

- Added background image to signup screens

### Known Issues

- Native code cannot be built for ios/android yet
- Universal links for reset password links have yet to be implemented (this depends on building native code)
- The actual reset password interface and API endpoint (after clicking on the reset link) are not yet implemented
- Some components clash with styling of a few pages, causing unintended formatting errors

---

## Version 0.0.0

### Features

- App landing screen
- Client data input
- Upload of data to database

### Bug Fixes

- None

### Known Issues

- Issues with sending client concerns via request body
- Occasional issues with API URL

---
