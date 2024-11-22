import express from "express";
import { Message } from "../model/message.js";
import { Client } from "../model/client.js";
import { Stylist } from "../model/stylist.js";
import asyncHandler from "express-async-handler";
import { WebSocketServer } from "ws";

const router = express.Router();
let wss;
const connectedUsers = {}; // Store connected users

// Function to set up the WebSocket server
export const setUpWebSocketServer = (server) => {
	wss = new WebSocketServer({ server });

	// WebSocket connection handling
	wss.on("connection", (ws) => {
		console.log("New WebSocket connection established");

		// Handle incoming messages from clients
		ws.on("message", async (message) => {
			try {
				const data = JSON.parse(message);
				if (data.event === "joinRoom" && data.username) {
					ws.username = data.username; // Attach the username to the WebSocket instance
					connectedUsers[data.username] = ws; // Store the WebSocket connection
					console.log(`${data.username} joined the room`);
				} else if (data.event === "sendMessage") {
					const { clientUsername, stylistUsername, sender, content } =
						data;

					// Validate data
					if (
						!clientUsername ||
						!stylistUsername ||
						!sender ||
						!content
					) {
						console.error("Invalid message data");
						ws.send(
							JSON.stringify({
								event: "error",
								message: "Invalid message data",
							})
						);
						return;
					}

					// Save the message to MongoDB
					const newMessage = new Message({
						clientUsername,
						stylistUsername,
						sender,
						content,
					});
					await newMessage.save();

					// Find the recipient WebSocket connection
					const recipientUsername =
						sender === clientUsername
							? stylistUsername
							: clientUsername;
					const recipientWs = connectedUsers[recipientUsername];

					if (
						recipientWs &&
						recipientWs.readyState === WebSocketServer.OPEN
					) {
						recipientWs.send(
							JSON.stringify({
								event: "receiveMessage",
								clientUsername,
								stylistUsername,
								sender,
								content,
								createdAt: newMessage.createdAt,
							})
						);
					}

					console.log(
						`Message from ${sender} sent to ${recipientUsername}`
					);
				}
			} catch (error) {
				console.error("Error handling message:", error);
			}
		});

		ws.on("close", () => {
			console.log("WebSocket connection closed");
			if (ws.username) {
				delete connectedUsers[ws.username]; // Remove the disconnected user
			}
		});
	});
};

// Endpoint to fetch chat history between a client and a stylist
router.get(
	"/history/:clientUsername/:stylistUsername",
	asyncHandler(async (req, res) => {
		const { clientUsername, stylistUsername } = req.params;

		// Fetch chat history
		const messages = await Message.find({
			clientUsername,
			stylistUsername,
		}).sort({ createdAt: 1 });

		// Format the response for the chat page
		const formattedMessages = messages.map((message) => ({
			content: message.content,
			sender: message.sender,
			createdAt: message.createdAt,
		}));

		// Fetch the profile picture and name for the stylist
		const stylist = await Stylist.findOne({ username: stylistUsername });
		const client = await Client.findOne({ username: clientUsername });

		res.json({
			stylist: {
				name: stylist?.info?.name,
				profilePicture: stylist?.profilePhoto?.photoData,
			},
			client: {
				name: client?.info?.name,
				profilePicture: client?.profilePhoto?.photoData,
			},
			messages: formattedMessages,
		});
	})
);

// Endpoint to fetch recent messages for the Messages Page
router.get(
	"/recent/:username",
	asyncHandler(async (req, res) => {
		const { username } = req.params;

		// Fetch most recent message per conversation
		const messages = await Message.aggregate([
			{
				$match: {
					$or: [
						{ clientUsername: username },
						{ stylistUsername: username },
					],
				},
			},
			{
				$sort: { createdAt: -1 }, // Sort messages by most recent
			},
			{
				$group: {
					_id: {
						$cond: [
							{ $eq: ["$clientUsername", username] },
							"$stylistUsername",
							"$clientUsername",
						],
					},
					mostRecentMessage: { $first: "$$ROOT" },
				},
			},
		]);

		// Fetch additional details for each conversation
		const enrichedMessages = await Promise.all(
			messages.map(async (msg) => {
				const otherUsername =
					msg.mostRecentMessage.clientUsername === username
						? msg.mostRecentMessage.stylistUsername
						: msg.mostRecentMessage.clientUsername;

				// Find the other user
				const otherUser =
					(await Client.findOne({ username: otherUsername })) ||
					(await Stylist.findOne({ username: otherUsername }));

				return {
					name: otherUser?.info?.name,
					profilePicture: otherUser?.profilePhoto?.photoData,
					messagePreview: msg.mostRecentMessage.content,
					sender: msg.mostRecentMessage.sender,
					timestamp: msg.mostRecentMessage.createdAt,
				};
			})
		);

		// Sort enriched messages to return the most recent messages first
		enrichedMessages.sort(
			(a, b) => new Date(b.timestamp) - new Date(a.timestamp)
		);

		res.json(enrichedMessages);
	})
);

export default router;
