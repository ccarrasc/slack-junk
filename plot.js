var rest = require('restler');

const regex = /^botty plot (.+)$/;
const appid = 'K4PUAR-LRXYLGP3V3';

module.exports = class PlotFunctionResponse {

	constructor(rtm, webClient) {
		this.rtm = rtm;
		this.webClient = webClient;
	}

	canHandle(message) {
		return regex.test(message.text);
	}

	handle(message) {
		let result = regex.exec(message.text);

		if (result && result[1]) {
			let self = this;
			this.query(result[1]).then(images => {
				if (!images || !images.length) {
					self.rtm.sendMessage(':see_no_evil:', message.channel, (err, msg) => {
						console.log(err, msg);
					});
				} else {
					var attachments = [];
					images.forEach(image => {
						let url = decodeURI(image);

						attachments.push({
							fallback: url,
							image_url: url
						});
					});

					var opts = {
						as_user: true,
						attachments: attachments
					};

					self.webClient.chat.postMessage(message.channel, result[1], opts, (err, res) => console.log('done',err, res));
				}
			});
		}
	}

	query(input) {
		return new Promise((resolve, reject) => {
			let images = [];
			let options = {
				parser: rest.parsers.xml
			};

			rest.get(`http://api.wolframalpha.com/v2/query?input=${input}&appid=${appid}`, options)
				.on('complete', (data) => {
					if (!data || !data.queryresult) {
						reject(data);
					}

					var pods = data.queryresult.pod;
					pods.forEach(pod => {
						if (pod.$.id == 'Plot') {
							pod.subpod.forEach(subpod => {
								subpod.img.forEach(img => {
									images.push(img.$.src);
								});
							});
						}
					});

					resolve(images);
				});
		});
	}
}
