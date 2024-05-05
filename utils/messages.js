const moment = require("moment");

const formatMessage = (username, text, time) => {
	return {
		username,
		text,
		time: moment().format("h:mm a"),
	};
};

module.exports = formatMessage;
