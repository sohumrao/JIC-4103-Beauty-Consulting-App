# Instructions for Using WebSocket API on Postman

These instructions will guide you on how to test the WebSocket (WS) endpoints for the Beauty Consulting App using Postman. You will be able to join chat rooms and send messages between a client and a stylist. The following examples will demonstrate how to simulate both client and stylist interactions.

## Step 1: Establish WebSocket Connection

1. Open **Postman**.
2. Click on the **New** button and select **WebSocket Request**.
3. Enter the WebSocket URL: `ws://localhost:5050` and click **Connect**.

Once the connection is established, you should see a `Connected` status at the bottom.

## Step 2: Join a Room

To join a room, you need to send a `joinRoom` event to the WebSocket server. This is necessary for each participant (client or stylist) to connect to the chat system. Below are examples of how to do this for both the client and the stylist.

### Example 1: Client Joins Room

```json
{
	"event": "joinRoom",
	"username": "client1"
}
```

-   **Description**: This request allows the client (`client1`) to join a chat room.
-   **Usage**: Paste this JSON into the **New message** section in Postman and click **Send**.

### Example 2: Stylist Joins Room

```json
{
	"event": "joinRoom",
	"username": "stylist7"
}
```

-   **Description**: This request allows the stylist (`stylist7`) to join the same chat room.
-   **Usage**: Similarly, paste this JSON into the **New message** section in Postman and click **Send**.

Both participants must join the room to initiate a conversation.

## Step 3: Send a Message

After joining the room, participants can send messages to each other. Below is an example where `client1` sends a message to `stylist7`.

### Example: Client Sends Message

```json
{
	"event": "sendMessage",
	"clientUsername": "client1",
	"stylistUsername": "stylist7",
	"sender": "client1",
	"content": "Hello, I would like to book an appointment."
}
```

-   **Description**: This request allows `client1` to send a message to `stylist7`.
-   **Fields**:
    -   `event`: The type of action, here it is `sendMessage`.
    -   `clientUsername`: The username of the client (`client1`).
    -   `stylistUsername`: The username of the stylist (`stylist7`).
    -   `sender`: The sender of the message (`client1`).
    -   `content`: The content of the message (`"Hello, I would like to book an appointment."`).
-   **Usage**: Paste this JSON into the **New message** section in Postman and click **Send**.

The stylist (`stylist7`) should receive the message if they are connected to the WebSocket.

## Important Notes

1. **Order of Actions**: The client and stylist must first send the `joinRoom` event before they can send or receive messages.
2. **Real-Time Messaging**: Both client and stylist must be connected to the WebSocket server at the same time to receive messages in real time.
3. **Testing with Multiple Tabs**: You can open multiple tabs in Postman to simulate different users (`client1` and `stylist7`). Make sure each user joins the room before attempting to send messages.
