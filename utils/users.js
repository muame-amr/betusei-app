const users = [];

const addUser = (id, username, room) => {
	const user = { id, username, room };
	users.push(user);

	return user;
};

const getUser = (id) => {
	return users.find((user) => user.id === id);
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);
	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

const getUserByRoom = (room) => {
	return users.filter((user) => user.room === room);
};

module.exports = { addUser, getUser, removeUser, getUserByRoom };
