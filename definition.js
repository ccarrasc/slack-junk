var rest = require('restler');

const regex = /^botty define ([A-Za-z\-]+)$/;
const apiKey = 'e737cb34-7abb-4f98-bbd0-8f6bf87633c1';

module.exports = class DefinitionResponse {

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
			this.query(result[1]).then(definition => {
				self.rtm.sendMessage(`${definition}`, message.channel, (err, msg) => {
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

			rest.get(`http://www.dictionaryapi.com/api/v1/references/collegiate/xml/${input}?key=${apiKey}`, options)
				.on('complete', (data) => {
					if (!data) {
						reject(data);
					}
					var definition = '';
					var definitions = data.entry_list.entry[0].def[0].dt;
					definitions.forEach(def => {
						if (typeof def !== 'string') {
							for (var prop in def) {
								if (prop == 'd_link') {
									definition += def[prop][0];
								} else {
									definition += def[prop];
								}
							}
						} else {
							definition += def;
						}
					});

					resolve(definition);
				});
		});
	}
}
