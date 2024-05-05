const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const chatMessages = document.querySelector(".chat-messages");

const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const socket = io();

const outputMessage = (message) => {
	console.log(message);
	const div = document.createElement("div");

	div.classList.add("message");
	div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
	    <p class="text">
			${message.text}
		</p>
    `;
	chatMessages.appendChild(div);
};

const setRoomName = (room) => {
	roomName.innerText = room;
};

const setUserList = (users) => {
	userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
};

socket.emit("join", { username, room });

socket.on("users", ({ room, users }) => {
	setRoomName(room);
	setUserList(users);
});

socket.on("message", (message) => {
	outputMessage(message);

	// Scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (event) => {
	event.preventDefault();

	let msg = event.target.elements.msg;

	socket.emit("chatMsg", msg.value);
	msg.value = "";
	msg.focus();
});
