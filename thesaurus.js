var rest = require('restler');

const regex = /^botty what is ([A-Za-z\-]+)$/;
const apiKey = '4bee055a-b2fa-423d-ab99-d57100b3de13'

module.exports = class ThesaurusResponse {

	constructor(rtm) {
		this.rtm = rtm;
	}

	canHandle(message) {
		return regex.test(message.text);
	}

	handle(message) {
		let result = regex.exec(message.text);

		if (result && result[1]) {
			let self = this;
			this.query(result[1]).then(relatedWords => {
				self.rtm.sendMessage(`${relatedWords}`, message.channel, (err, msg) => {
					console.log(err, msg);
				});
			});
		}
	}

	query(input) {
		return new Promise((resolve, reject) => {
			let options = {
				parser: rest.parsers.xml
			};

			rest.get(`http://www.dictionaryapi.com/api/v1/references/thesaurus/xml/${input}?key=${apiKey}`, options)
				.on('complete', (data) => {
					if (!data) {
						reject(data);
					}
					var relatedWords = '';
					relatedWords += data.entry_list.entry[0].sens[0].rel[0]
					resolve(relatedWords);
				});
		});
	}
}
