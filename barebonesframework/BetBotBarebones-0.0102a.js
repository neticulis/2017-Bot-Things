
/* ~~~~~ GAMBLETRON BARE BONES BET BOT - (C) Neti AKA MathWins 2017 All Rights Reserved ~~ \
 * This is only a skeleton bot, it has the bare essentials needed for the framework
 * all upgrades are in the Addons folder, and code must be copied and pasted directly into this script 
 * Eventually this should be automated so it builds a script using only the parts we need for a strategy
\~~~~~ */ window.gtbb={}; gtbb.ver= 'GTBB (Bare) v0.0102a'; /* ~~~~~~~~ */ 


 /* ~~~~~~~	The Match Class handles the main game data ~~~~~~/
  * window.gtbb.game will contain a new match spawn during init
\ ~~~~ */ window.gtbb.game=null; /* ~~~~~~~~ */ 
// gameAddon will contain the optional modules for the match class
window.gtbb.gameAddon={};


class Match {
	constructor(data=null){
		this.playersJoined=[];
		this.playersWon=[];
		this.playersLost=[];
		this.game_id=null;
		this.playerBets={};
		this.totalBet=null;
	}
	addToHistory(data=null) {
		
	}
	reset(data = null) {
		// Variables that should be reset between games
		this.playersJoined=[];
		this.playersWon=[];
		this.playersLost=[];
		this.totalBet=0;
		this.playerBets={}
	}
	game_starting(data = null) {
		console.log('game_starting #'+data.game_id);
		this.game_id=data.game_id;
	}
	game_started(data = null) {
		this.playersLost=gtbb.game.playersJoined;
		console.log('game_started with '+this.playersJoined.length+' players');
		this.playerBets=data;
		this.totalBet=0; 
		for (var q in this.playerBets){
			let qq=this.playerBets[q]; 
			this.totalBet+=qq.bet;
		}
		console.log((this.totalBet/100).toFixed(0)+' bits bet');
	}
	game_crash(data = null) {
		// Reset game vars 500 milliseconds after crash
		setTimeout(function(){gtbb.game.reset();},500);
		console.log('game_crash with '+this.playersWon.length+' won and '+this.playersLost.length+' lost');
		// If these optional addons are present, run them
		if (gtbb.gameAddon.didHouseWin){
			gtbb.gameAddon.didHouseWin();
		}
		if (gtbb.gameAddon.totalWon){
			gtbb.gameAddon.totalWon();
		}
		if (gtbb.gameAddon.totalLost){
			gtbb.gameAddon.totalLost();
		}
	}
	async player_bet(data = null) {
		this.playersJoined.push(data.username);
	}
	async cashed_out(data = null) {
		this.playersWon.push(data.username);
		this.playersLost.splice(this.playersLost.indexOf(data.username),1);
	}
	async msg(data = null) {
		
	}
}

gtbb.gameAddon.didHouseWin=function(){
	
}
gtbb.gameAddon.totalWon=function(){
	
}
gtbb.gameAddon.totalLost=function(){
	
}


 /* ~~~~~~~	Bustabit Engine Triggers/API ~~~~~ (paste addons ABOVE this)~~~~~~/
  * All game data is pushed to us via engine.on 
  * This should stay at the bottom of the script with the engine.on's
  \ ~~~~ */	window.babListen={} /* ~~~~~~~~ */ 

// the incomingData function directs incoming data to the correct functions and classes based on the trigger
babListen.incomingData=function(data=null){
	if (!data){ return null	}
	// triggerFired will be a string with one of the 6 engine.on triggers
	let triggerFired=this.trigger.arguments[0];
	//  gtbb should contain the match class and its trigger handlers
	//  if gtbb.game is null, we need to initialize framework
	if (!gtbb.game){
		// Initialize the Match class to handle incoming betting data
		gtbb.game=new Match();
	} else {
		
		// Bot initiated, start handling incoming data
		// Send data to match class trigger routine
		gtbb.game[triggerFired](data);
	}
	
}

engine.on('game_starting', babListen.incomingData);
engine.on('game_started', babListen.incomingData);
engine.on('game_crash', babListen.incomingData);
engine.on('cashed_out', babListen.incomingData);
engine.on('player_bet', babListen.incomingData);
engine.on('msg', babListen.incomingData);
