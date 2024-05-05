const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
	addUser,
	getUser,
	removeUser,
	getUserByRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "Alex";

// Set statice folder\
app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", (socket) => {
	socket.on("join", ({ username, room }) => {
		const user = addUser(socket.id, username, room);
		console.log(`${user.username}(${socket.id}) joined [${user.room}]`);

		socket.join(user.room);

		socket.emit("message", formatMessage(botName, "Welcome to Betusei !"));

		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMessage(botName, `${user.username} has joined the room`)
			);

		io.to(user.room).emit("users", {
			room: user.room,
			users: getUserByRoom(user.room),
		});

		// Listen for 'chatMsg'
		socket.on("chatMsg", (msg) => {
			const user = getUser(socket.id);
			console.log(`[${user.room}]: ${user.username}(${socket.id}) - ${msg}`);
			io.to(user.room).emit("message", formatMessage(user.username, msg));
		});

		// Client disconnects
		socket.on("disconnect", () => {
			const user = removeUser(socket.id);

			if (user) {
				console.log(`${user.username}(${socket.id}) left [${user.room}]`);
				io.emit(
					"message",
					formatMessage(botName, `${user.username} has left the chat`)
				);

				io.to(user.room).emit("users", {
					room: user.room,
					userList: getUserByRoom(user.room),
				});
			}
		});
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
