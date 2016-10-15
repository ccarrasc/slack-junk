let RtmClient = require('@slack/client').RtmClient;
let RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
let MemoryDataStore = require('@slack/client').MemoryDataStore;
var WebClient = require('@slack/client').WebClient;

let SimpleEchoResponse = require('./simple');
let PlotFunctionResponse = require('./plot');
let DefinitionResponse = require('./definition');
let ThesaurusResponse = require('./thesaurus');

let token = 'xoxb-91763784404-whudWX7VGNk3fHllPQa35vrS';
let rtm = new RtmClient(token, {logLevel: 'error', dataStore: new MemoryDataStore()});
let webClient = new WebClient(token);

var user;
var team;
let simpleEchoResponse = new SimpleEchoResponse(rtm);
let plotResponse = new PlotFunctionResponse(rtm, webClient);
let definitionResponse = new DefinitionResponse(rtm);
let thesaurusResponse = new ThesaurusResponse(rtm);

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
	user = rtm.dataStore.getUserById(rtm.activeUserId);
  team = rtm.dataStore.getTeamById(rtm.activeTeamId);
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
	if (message.user == rtm.activeUserId) {
		return;
	}

	if (simpleEchoResponse.canHandle(message)) {
		simpleEchoResponse.handle(message);
	} else if (plotResponse.canHandle(message)) {
		plotResponse.handle(message);
	} else if (definitionResponse.canHandle(message)) {
		definitionResponse.handle(message);
	} else if (thesaurusResponse.canHandle(message)) {
		thesaurusResponse.handle(message);
	} else {
		rtm.sendMessage(tableflip(), message.channel, (err, msg) => {
			console.log(err, msg);
		});
	}
});

rtm.on(RTM_EVENTS.CHANNEL_CREATED, (message) => {
  // Listens to all `channel_created` events from the team
});

console.log('starting');
rtm.start();

function tableflip() {
	min = Math.ceil(0);
  max = Math.floor(5);
  let result = Math.floor(Math.random() * (max - min)) + min;

	switch (result) {
		case 0:
			return '(╯°□°)╯︵ ┻━┻';
		case 1:
			return '(ノಠ益ಠ)ノ彡┻━┻';
		case 2:
			return '┬──┬ ﾉ(°—°ﾉ)';
		case 3:
			return '(┛◉Д◉)┛彡┻━┻';
		default:
			return '¯\\_(ツ)_/¯';
	}
}