/* ~~~~~ GAMBLETRON BARE BONES ALERT BOT - (C) Neti AKA MathWins 2017 All Rights Reserved ~~ \
 * This is only a skeleton bot, it has the bare essentials needed for the framework
 * all upgrades are in the Addons folder, and code must be copied and pasted directly into this script 
 * Eventually this should be automated so it builds a script using only the parts we need for a strategy
\~~~~~ */
window.gtab = {};
gtab.ver = 'GTAB (Bare) v0.0001a'; /* ~~~~~~~~ */
gtab.engine = engine;
// Bot will not send chat messages when this is true (will still parse and everything else)
gtab.muted = false;

// Only these users can send the bot special commands via chat (like mute)
gtab.admins = ['HERPES', 'MathWins'];

// Usernames in the blacklist will not have their chat messages parsed
gtab.blacklist = ['TestUser'];

/* ~~~~~~~	The Match Class handles the main game data ~~~~~~/
  * window.gtab.game will contain a new match spawn during init
\ ~~~~ */
window.gtab.game = null; /* ~~~~~~~~ */
// gameAddon will contain the optional modules for the match class
window.gtab.gameAddon = {};


class Match {
	constructor(data = null) {
		this.playersJoined = [];
		this.playersWon = [];
		this.playersLost = [];
		this.game_id = null;
		this.playerBets = {};
		this.totalBet = null;
	}
	addToHistory(data = null) {

	}
	reset(data = null) {
		// Variables that should be reset between games
		this.playersJoined = [];
		this.playersWon = [];
		this.playersLost = [];
		this.totalBet = 0;
		this.playerBets = {}
	}
	game_starting(data = null) {
		console.log('game_starting #' + data.game_id);
		this.game_id = data.game_id;
	}
	game_started(data = null) {
		this.playersLost = gtab.game.playersJoined;
		console.log('game_started with ' + this.playersJoined.length + ' players');
		this.playerBets = data;
		this.totalBet = 0;
		for (var q in this.playerBets) {
			let qq = this.playerBets[q];
			this.totalBet += qq.bet;
		}
		console.log((this.totalBet / 100).toFixed(0) + ' bits bet');
	}
	game_crash(data = null) {
		// Reset game vars 500 milliseconds after crash
		setTimeout(function () {
			gtab.game.reset();
		}, 500);
		console.log('game_crash with ' + this.playersWon.length + ' won and ' + this.playersLost.length + ' lost');
		// If these optional addons are present, run them
		if (gtab.gameAddon.didHouseWin) {
			gtab.gameAddon.didHouseWin();
		}
		if (gtab.gameAddon.totalWon) {
			gtab.gameAddon.totalWon();
		}
		if (gtab.gameAddon.totalLost) {
			gtab.gameAddon.totalLost();
		}
	}
	async player_bet(data = null) {
		this.playersJoined.push(data.username);
	}
	async cashed_out(data = null) {
		this.playersWon.push(data.username);
		this.playersLost.splice(this.playersLost.indexOf(data.username), 1);
	}
	async msg(data = null) {

	}
}

gtab.gameAddon.didHouseWin = function () {

}
gtab.gameAddon.totalWon = function () {

}
gtab.gameAddon.totalLost = function () {

}


/* ~~~~~~~	Bustabit Engine Triggers/API ~~~~~ (paste addons ABOVE this)~~~~~~/
 * All game data is pushed to us via engine.on 
 * This should stay at the bottom of the script with the engine.on's
 \ ~~~~ */
window.gtab.babListen = {} /* ~~~~~~~~ */

// the incomingData function directs incoming data to the correct functions and classes based on the trigger
window.gtab.babListen.incomingData = function (triggerFired, data = null) {
	if (!data) {
		return null
	}
	console.log('Incoming Data: ' + (JSON.stringify(data)));
	// triggerFired will be a string with one of the 6 engine.on triggers


	//  gtab should contain the match class and its trigger handlers
	//  if gtab.game is null, we need to initialize framework
	if (!gtab.game) {
		gtab.say('Gambletron Alert Bot Initialized');
		// Initialize the Match class to handle incoming betting data
		gtab.game = new Match();
	} else {
		if (triggerFired == 'msg') {
			// dont parse your own messages or messages of people blacklisted
			if (data.username == 'Gambletron5000' || gtab.blacklist.indexOf(data.username) >= 0) {
				return null
			}
		}
		// Bot initiated, start handling incoming data
		// Send data to match class trigger routine
		gtab.game[triggerFired](data);
		gtab.engineOn[triggerFired](data);
	}

}

gtab.engine.on('game_starting', (data) => window.gtab.babListen.incomingData(gtab.engine.trigger.arguments[0], data));
gtab.engine.on('game_started', (data) => window.gtab.babListen.incomingData(gtab.engine.trigger.arguments[0], data));
gtab.engine.on('game_crash', (data) => window.gtab.babListen.incomingData(gtab.engine.trigger.arguments[0], data));
gtab.engine.on('cashed_out', (data) => window.gtab.babListen.incomingData(gtab.engine.trigger.arguments[0], data));
gtab.engine.on('player_bet', (data) => window.gtab.babListen.incomingData(gtab.engine.trigger.arguments[0], data));
gtab.engine.on('msg', (data) => window.gtab.babListen.incomingData(gtab.engine.trigger.arguments[0], data));

// Prototyping functions
gtab.engineOn = {};
gtab.engineOn.game_starting = function (data = null) {
	console.log(`Game game_starting`);
}
gtab.engineOn.game_started = function (data = null) {
	gtab.say('♧ Game #' + gtab.game.game_id + ' Started: ' + gtab.game.playersJoined.length + ' playing. ' + (gtab.game.totalBet / 100) + ' total bits bet.');
}
gtab.engineOn.game_crash = function (data = null) {
	gtab.say('♧ Game #' + gtab.game.game_id + ' Ended @ ' + (data.game_crash / 100) + 'x with ' + gtab.game.playersWon.length + ' winners.');
}
gtab.engineOn.cashed_out = function (data = null) {
	console.log(`Game cashed_out`);
}
gtab.engineOn.player_bet = function (data = null) {
	console.log(`Game player_bet`);
}
gtab.engineOn.msg = function (data = null) {

	// set to true if an admin sent the message
	let adminMessage = false;

	gtab.admins.indexOf(data.username) >= 0 ? adminMessage = true : adminMessage = false;
	if ((!data.message.startsWith('!') && !data.message.toLowerCase().startsWith('gambletron'))) {
		console.log(`Non command msg was received, exiting parse`);
		return null
	}
	let m = data.message.toLowerCase();
	let u = data.username.toLowerCase();
	let M = data.message;
	let U = data.username;
	let s = gtab.say;
	if (adminMessage) {
		if (m.includes('gambletron shh') || m.includes('gambletron mute') || m.includes('!shh') || m.includes('!mute')) {
			if (gtab.muted) {
				gtab.muted = false;
				s(`Thank you for un-muting me, master ${u}`);
			} else {
				s(`Yes master ${u}, I shall remain quite until you use the command again.`);
				gtab.muted = true;
			}
		}
	}
	m == '!admins' ? s(`${JSON.stringify(gtab.admins)}`) : null;
	m == '!str9' ? s(`a str9 appeared`) : null;
	m == '!most' ? s(`sorry, the !most command is not available yet.`) : null;
	m == '!due' ? s(`sorry, the !due command is not available yet.`) : null;
	m == '!test' ? s(`@${U} initiated a test.`) : null;
	m == '!rep' ? s(`[Rep] ${U} has rep 9000. (For help type !rep help)`) : null;
	m == '!testicle' ? s(`@${U} initiated a testicle.`) : null;
	(!data.message.startsWith('!') && data.username != 'Gambletron5000') ? s(`Blah Blah Blah (${U} sent a non !command message)`): null;

}
gtab.say = function (message = 'This is a chat message') {
	// If not muted, send message to chat
	if (!gtab.muted) {
		gtab.engine.chat(message);
		return true
	}
	return false
}
