### ClientController

-   **Create User**

    -   **POST** `/client`
    -   **Description**: Creates a new client profile.

-   **Update Client**

    -   **PUT** `/client/{username}`
    -   **Description**: Updates a client's profile by username.

-   **Delete Client**

    -   **DELETE** `/client/{username}`
    -   **Description**: Deletes a client's profile by username.

-   **Match Client with Stylists**
    -   **GET** `/client/matchStylists/{username}`
    -   **Description**: Finds matching stylists based on the client's preferences.

---

### StylistController

-   **Create User**

    -   **POST** `/stylist`
    -   **Description**: Creates a new stylist profile.

-   **Get User**
    -   **GET** `/stylist/{username}`
    -   **Description**: Retrieves stylist profile details by username.

---

### AccountController

-   **Create Account**

    -   **POST** `/account/createAccount`
    -   **Description**: Creates a new account for a user.

-   **Upload Profile Photo**

    -   **POST** `/account/photo`
    -   **Description**: Uploads a profile photo for the user.

-   **Get Profile Photo**
    -   **GET** `/account/{username}/photo`
    -   **Description**: Retrieves the profile photo for a user by username.

---

### AppointmentController

-   **Create Appointment**

    -   **POST** `/appointment/create`
    -   **Description**: Creates a new appointment.

-   **Get All Appointments for Client**

    -   **GET** `/appointment/client/{username}`
    -   **Description**: Retrieves all appointments for a specific client.

-   **Get All Appointments for Stylist**

    -   **GET** `/appointment/stylist/{username}`
    -   **Description**: Retrieves all appointments for a specific stylist.

-   **Cancel Appointment**

    -   **PUT** `/appointment/{id}/cancel`
    -   **Description**: Marks an appointment as canceled by appointment ID.

-   **Complete Appointment**

    -   **PUT** `/appointment/{id}/complete`
    -   **Description**: Marks an appointment as completed by appointment ID.

-   **Check Date Availability for Stylist**

    -   **GET** `/appointment/availability?username={id}&month={monthNumber}`
    -   **Description**: Checks availability for each date in a specified month for a stylist.

-   **Check Booking Availability for Stylist**

    -   **GET** `/appointment/checkbooking?stylistUsername={username}&dateTime={dateTime}
    -   **Description**: Checks if an appointment already exists with that stylist at that time.
