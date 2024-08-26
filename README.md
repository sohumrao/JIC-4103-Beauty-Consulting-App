# JDD-4103-Consulting

# Summary
This product is a mobile app for beauty consultations. The current product is a client profile creation interface, allowing for users to input personal information as well as specific hair details/concerns. This was chosen as the artifact to be implemented because from the beginning, the goal of this project has been to bridge the gap between beauty client and stylist; allowing users to upload details to be seen by stylists will alleviate concerns on both ends and make the consultation process easier overall. This artifact also allows for a demonstration of the full technology stack, since data can be inputted through the UI, sent to the back end, and uploaded to the database.

The app utilizes a React Native front end UI, connected to a Node.js backend through an API running via the Express library. User data is stored in a MongoDB database hosted on the cloud service MongoDB Atlas. The use of the Expo library allows for the Javascript to be built, bundled, and rendered on both iOS and Android devices using the Expo Go app.

## 0.0.0

### Features
- App landing screen
- Client data input
- Upload of data to database

### Bug Fixes
- None

### Known Issues
- Issues with sending client concerns via request body
- Occasional issues with API URL
