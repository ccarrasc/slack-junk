
const regex = /^botty echo (.+)$/;

module.exports = class SimpleEchoResponse {

	constructor(rtm) {
		this.rtm = rtm;
	}

	canHandle(message) {
		return regex.test(message.text);
	}

	handle(message) {
		let result = regex.exec(message.text);

		if (result && result[1]) {
			this.rtm.sendMessage(`${result[1]}`, message.channel, (err, msg) => {
				console.log(err, msg);
			});
		}
	}
}
